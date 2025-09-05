import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from markdownify import markdownify as md
from langchain.text_splitter import RecursiveCharacterTextSplitter


# Load biến môi trường từ .env
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def md_to_plain(md_text: str) -> str:
    return md(md_text)

# =============== 1. Load LLM (OpenAI) ===============
llm = ChatOpenAI(
    model="gpt-4o-mini",    # hoặc "gpt-3.5-turbo"
    api_key=OPENAI_API_KEY,
    temperature=0,
)

# =============== 2. Load FAISS Vectorstore (nếu có) ===============
try:
    embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
    vectorstore = FAISS.load_local(
        "backend/vectorstores/news_faiss",  # path FAISS đã build
        embeddings,
        allow_dangerous_deserialization=True
    )
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
except Exception as e:
    retriever = None
    print("Không tìm thấy FAISS index, chatbot sẽ chỉ dùng LLM:", e)

# =============== 3. Prompt Template ===============
prompt_template = """
Bạn là một chuyên gia tư vấn pháp luật Việt Nam. 
Hãy dựa vào dữ liệu sau để trả lời cho người dùng:
{context}

Câu hỏi: {question}

Trả lời một cách ngắn gọn, dễ hiểu, chính xác, và bằng tiếng Việt.
"""
prompt = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

# =============== 4. Xây dựng Retrieval QA Chain ===============
if retriever:
    qa = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        chain_type="stuff",
        chain_type_kwargs={"prompt": prompt}
    )
else:
    qa = None


# =============== 5. API Chatbot ===============
@method_decorator(csrf_exempt, name="dispatch")
class ChatbotView(View):
    def post(self, request):
        try:
            data = json.loads(request.body)
            query = data.get("query", "")

            if not query:
                return JsonResponse({"error": "Chưa nhập câu hỏi"}, status=400)

            if qa:
                result = qa.invoke(query)
                answer = result.get("result", "Xin lỗi, tôi chưa có câu trả lời.")
            else:
                resp = llm.invoke(query)
                answer = resp.content

            return JsonResponse({"query": query, "answer": answer})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


# =============== 6. API Test OpenAI ===============
@method_decorator(csrf_exempt, name="dispatch")
class TestOpenAI(View):
    def get(self, request):
        try:
            resp = llm.invoke("Xin chào, bạn khỏe không?")
            return JsonResponse({"test_answer": resp.content})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
        
# =============== 6. Upsert bài ===============
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
        "url": getattr(news_obj, "source_url", "") or "",
        "source": getattr(news_obj, "source", "") or "",
        "publish_date": str(getattr(news_obj, "publish_date", "") or ""),
        "category": news_obj.category.name if getattr(news_obj, "category", None) else "Khác",
    }

    splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
    docs = splitter.split_documents([Document(page_content=text, metadata=meta)])

    # dùng vectorstore đã load ở trên
    vectorstore.add_documents(docs)     
    vectorstore.save_local("backend/vectorstores/news_faiss")  

    return True

