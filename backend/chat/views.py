import os
import json
import traceback
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from dotenv import load_dotenv
from .models import Conversation, ChatTurn
from .flow import next_step
from rest_framework import viewsets, permissions
from .models import Conversation, ChatTurn
from .serializers import ConversationSerializer, ChatTurnSerializer

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from markdownify import markdownify as md
from langchain.text_splitter import RecursiveCharacterTextSplitter


# ================== Load biến môi trường ==================
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def md_to_plain(md_text: str) -> str:
    """Chuyển markdown -> plain text"""
    return md(md_text)


# ================== Load LLM ==================
llm = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=OPENAI_API_KEY,
    temperature=0,
)

embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)


# ================== Load 2 FAISS riêng ==================
try:
    news_vectorstore = FAISS.load_local(
        "backend/vectorstores/news_faiss",
        embeddings,
        allow_dangerous_deserialization=True
    )
    news_retriever = news_vectorstore.as_retriever(search_kwargs={"k": 3})
except Exception as e:
    news_retriever = None
    print("Không tìm thấy FAISS news:", e)

try:
    law_vectorstore = FAISS.load_local(
        "backend/vectorstores/laws_faiss",
        embeddings,
        allow_dangerous_deserialization=True
    )
    law_retriever = law_vectorstore.as_retriever(search_kwargs={"k": 3})
except Exception as e:
    law_retriever = None
    print("Không tìm thấy FAISS laws:", e)


# ================== Prompt chung ==================
prompt_template = """
Bạn là một chuyên gia tư vấn pháp luật Việt Nam. 
Dựa vào dữ liệu sau để trả lời cho người dùng:
{context}

Câu hỏi: {question}

Trả lời ngắn gọn, dễ hiểu, chính xác và bằng tiếng Việt.
"""

prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)


# ================== Build QA cho news và law ==================
qa_news = None
if news_retriever:
    qa_news = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=news_retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt}
    )

qa_law = None
if law_retriever:
    qa_law = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=law_retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt}
    )


# ================== Intent prompt ==================
intent_prompt = """
Bạn là bộ phân loại ý định cho hệ thống tư vấn pháp luật.
Chỉ trả về JSON hợp lệ, KHÔNG giải thích thêm, KHÔNG bao bọc trong ```json.

Ví dụ:
{{
  "intent": "tra_cuu_van_ban",
  "entities": "Bộ luật Lao động 2019",
  "explanation": "Người dùng hỏi về văn bản pháp luật cụ thể"
}}

Câu người dùng: "{user_input}"
"""



# ================== Hàm upsert news ==================
def upsert_one_news(news_obj):
    text = ""
    if hasattr(news_obj, "detail") and news_obj.detail and news_obj.detail.content_md:
        text = md_to_plain(news_obj.detail.content_md)
    elif getattr(news_obj, "content", None):
        text = md_to_plain(news_obj.content)

    if not text:
        return False

    meta = {
        "news_id": news_obj.id,
        "title": news_obj.title,
        "url": getattr(news_obj, "source_url", ""),
        "type": "news",
    }

    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
    docs = splitter.split_documents([Document(page_content=text, metadata=meta)])

    news_vectorstore.add_documents(docs)
    news_vectorstore.save_local("backend/vectorstores/news_faiss")
    return True


# ================== Hàm upsert law ==================
def upsert_one_law(law_obj):
    text = ""
    if getattr(law_obj, "content_md", None):
        text = md_to_plain(law_obj.content_md)
    elif getattr(law_obj, "content", None):
        text = md_to_plain(law_obj.content)

    if not text:
        return False

    meta = {
        "law_id": law_obj.id,
        "title": law_obj.title,
        "url": getattr(law_obj, "source_url", ""),
        "type": "law",
    }

    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
    docs = splitter.split_documents([Document(page_content=text, metadata=meta)])

    law_vectorstore.add_documents(docs)
    law_vectorstore.save_local("backend/vectorstores/laws_faiss")
    return True


# ================== API Chatbot ==================
@method_decorator(csrf_exempt, name="dispatch")
class ChatbotView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            query = data.get("query", "")

            if not query:
                return JsonResponse({"error": "Chưa nhập câu hỏi"}, status=400)

            # Phân loại intent
            intent_prompt_filled = intent_prompt.format(user_input=query)
            intent_resp = llm.invoke(intent_prompt_filled)
            print(repr(intent_resp.content))
            parsed_intent = json.loads(intent_resp.content)
            intent = parsed_intent.get("intent", "khac")

            # Trả lời dựa vào intent
            answer = "Xin lỗi, tôi chưa có câu trả lời."
            if intent == "tim_tin_tuc" and qa_news:
                result = qa_news.invoke(query)
                answer = result.get("result", answer)
            elif intent == "tra_cuu_van_ban" and qa_law:
                result = qa_law.invoke(query)
                answer = result.get("result", answer)
            else:
                # fallback: hỏi LLM thuần
                resp = llm.invoke(query)
                answer = resp.content

            return JsonResponse({
                "query": query,
                "answer": answer,
                "intent": intent,
                "entities": parsed_intent.get("entities", ""),
                "explanation": parsed_intent.get("explanation", "")
            })

        except Exception as e:
            print("Lỗi ChatbotView:", str(e))
            traceback.print_exc()   # in full traceback ra console
            return JsonResponse({"error": str(e)}, status=500)

#======================ý định============
@method_decorator(csrf_exempt, name="dispatch")
class IntentView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            user_text = data.get("text", "")
            if not user_text:
                return JsonResponse({"error": "Thiếu text"}, status=400)

            prompt = intent_prompt.format(user_input=user_text)
            resp = llm.invoke(prompt)
            parsed = json.loads(resp.content)
            # lưu DB
            # UserIntent.objects.create(raw_text=user_text, intent=parsed["intent"])
            return JsonResponse(parsed)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
#=================== Nội dung hội thoại================
@method_decorator(csrf_exempt, name="dispatch")
class ConversationView(View):
    def post(self, request, convo_id=None):
        data = json.loads(request.body)
        user_text = data.get("query")
        convo = Conversation.objects.get(pk=convo_id) if convo_id else Conversation.objects.create(user=request.user)

        step = next_step(convo.state, user_text, llm)
        convo.state = step["state"]
        convo.save()

        ChatTurn.objects.create(convo=convo, sender="user", text=user_text)
        ChatTurn.objects.create(convo=convo, sender="bot", text=step["reply"], meta=step["meta"])

        return JsonResponse({"reply": step["reply"], "state": step["state"], "meta": step["meta"], "convo_id": convo.id})
    
class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChatTurnViewSet(viewsets.ModelViewSet):
    serializer_class = ChatTurnSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        convo_id = self.kwargs.get("convo_pk")
        return ChatTurn.objects.filter(convo_id=convo_id, convo__user=self.request.user).order_by("created_at")

    def perform_create(self, serializer):
        convo_id = self.kwargs.get("convo_pk")
        serializer.save(convo_id=convo_id)

