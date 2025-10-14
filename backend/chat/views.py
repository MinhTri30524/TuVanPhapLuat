import os
import re
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
Bạn là chuyên gia tư vấn pháp luật Việt Nam. 
Nhiệm vụ:
1. Trả lời ngắn gọn, rõ ràng, đúng luật, dễ hiểu.
2. Sau câu trả lời, bạn **luôn tạo ra 1-3 gợi ý rẽ nhánh** giúp người dùng hỏi tiếp sâu hơn.
- Gợi ý ngắn gọn, thân thiện, không quá 15 từ.
- Trả về JSON dạng:
{
    "answer": "...",
    "suggestions": ["...", "...", "..."]
}

Câu hỏi: {question}
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


# ================== Helper: safe JSON parse ==================
def safe_json_parse(raw: str, fallback: dict = None) -> dict:
    """Parse JSON an toàn, loại bỏ ```json ... ``` và lỗi format"""
    if fallback is None:
        fallback = {}
    raw = (raw or "").strip()
    if raw.startswith("```"):
        raw = re.sub(r"```(json)?", "", raw).strip("` \n")
    try:
        return json.loads(raw)
    except Exception as e:
        print("JSON parse fail:", e, "| RAW:", repr(raw))
        return fallback


# ================== API Chatbot ==================
@method_decorator(csrf_exempt, name="dispatch")
class ChatbotView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            query = data.get("query", "")
            conversation_id = data.get("conversation_id")

            if not query:
                return JsonResponse({"error": "Chưa nhập câu hỏi"}, status=400)

            # Lấy conversation
            try:
                conversation = Conversation.objects.get(id=conversation_id)
            except Conversation.DoesNotExist:
                return JsonResponse({"error": "Conversation không tồn tại"}, status=404)

            # Lưu user turn
            ChatTurn.objects.create(convo=conversation, sender="user", text=query)

            # === Phân loại intent ===
            intent_prompt_filled = intent_prompt.format(user_input=query)
            intent_resp = llm.invoke(intent_prompt_filled)
            parsed_intent = safe_json_parse(intent_resp.content, {
                "intent": "khac", "entities": "", "explanation": ""
            })
            intent = parsed_intent.get("intent", "khac")

            # === Trả lời dựa vào intent ===
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

            # === Sinh câu gợi ý (suggestions) ===
            suggest_prompt = f"""
Người dùng vừa hỏi: "{query}"
Với câu trả lời: "{answer}"
Hãy tạo ra 3 câu hỏi gợi ý liên quan mà người dùng có thể muốn hỏi tiếp theo.
Trả về JSON: {{"suggestions": ["...", "...", "..."]}}
"""
            suggest_resp = llm.invoke(suggest_prompt)
            parsed_suggest = safe_json_parse(suggest_resp.content, {"suggestions": []})
            suggestions = parsed_suggest.get("suggestions", [])

            # Lưu bot turn
            ChatTurn.objects.create(
                convo=conversation,
                sender="bot",
                text=answer,
                meta={
                    "intent": intent,
                    "entities": parsed_intent.get("entities", ""),
                    "explanation": parsed_intent.get("explanation", ""),
                    "suggestions": suggestions
                }
            )

            return JsonResponse({
                "query": query,
                "answer": answer,
                "intent": intent,
                "entities": parsed_intent.get("entities", ""),
                "explanation": parsed_intent.get("explanation", ""),
                "suggestions": suggestions
            })

        except Exception as e:
            print("Lỗi ChatbotView:", str(e))
            traceback.print_exc()
            return JsonResponse({"error": str(e)}, status=500)


# ================== Ý định riêng ==================
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
            parsed = safe_json_parse(resp.content, {"intent": "khac"})
            return JsonResponse(parsed)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# ================== Nội dung hội thoại ==================
@method_decorator(csrf_exempt, name="dispatch")
class ConversationView(View):
    def post(self, request, convo_id=None):
        data = json.loads(request.body)
        user_text = data.get("query")

        # Lấy hoặc tạo conversation
        convo = Conversation.objects.get(pk=convo_id) if convo_id else Conversation.objects.create(user=request.user)

        # Gọi logic AI
        step = next_step(convo.state, user_text, llm)
        convo.state = step["state"]
        convo.save()

        # Lưu tin nhắn user & bot
        ChatTurn.objects.create(convo=convo, sender="user", text=user_text)
        ChatTurn.objects.create(convo=convo, sender="bot", text=step["reply"], meta=step["meta"])

        # Lấy tất cả chatturn của convo để frontend hiển thị
        chatturns = ChatTurn.objects.filter(convo=convo).order_by("created_at")
        messages = [
            {"sender": ct.sender, "text": ct.text, "meta": getattr(ct, "meta", None)}
            for ct in chatturns
        ]

        return JsonResponse({
            "convo_id": convo.id,
            "state": convo.state,
            "messages": messages
        })


class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        print("User in request:", self.request.user)
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
