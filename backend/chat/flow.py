from langchain.prompts import PromptTemplate
from laws.services import get_law_detail
import json
import re

# Prompt để phân tích câu hỏi người dùng
analyze_prompt = PromptTemplate.from_template("""
Bạn là luật sư ảo. Xác định mục đích chính của người dùng và đề xuất 3 nội dung tra cứu liên quan (title, url).
Trả JSON: {{"intent": "...", "suggestions": [{{"title": "...", "id": 1}}]}}
Câu hỏi: "{query}"
""")

def next_step(convo_state, user_text, llm):
    """
    Xử lý bước tiếp theo trong flow chat.
    
    convo_state: init, suggest, branch, advise, done
    user_text: input từ người dùng
    llm: instance LLM hoặc chatbot backend
    
    return dict: { state, reply, meta }
    """
    try:
        # ===== STATE INIT =====
        if convo_state == "init":
            resp = llm.invoke(analyze_prompt.format(query=user_text))
            content = getattr(resp, "content", None)

            if not content:
                return {
                    "state": "init",
                    "reply": "Hệ thống AI tạm thời không khả dụng. Vui lòng thử lại sau.",
                    "meta": {}
                }

            # ==== CLEANUP CONTENT ====
            # Loại bỏ code block markdown ```json hoặc ```
            content_clean = re.sub(r"^```(?:json)?", "", content.strip())
            content_clean = re.sub(r"```$", "", content_clean.strip())

            # Cố gắng parse JSON
            try:
                parsed = json.loads(content_clean)
            except (json.JSONDecodeError, TypeError) as e:
                print("JSON decode error:", e, "resp.content:", content)
                return {
                    "state": "init",
                    "reply": "Hệ thống AI gặp sự cố khi phân tích câu hỏi. Vui lòng thử lại.",
                    "meta": {}
                }

            return {
                "state": "suggest",
                "reply": f"Tôi thấy bạn quan tâm '{parsed.get('intent', 'khác')}'. "
                         f"Tôi gợi ý {len(parsed.get('suggestions', []))} văn bản để bạn tham khảo.",
                "meta": parsed
            }

        # ===== STATE SUGGEST =====
        elif convo_state == "suggest":
            # user chọn một suggestion hoặc nhập trực tiếp
            return {
                "state": "branch",
                "reply": f"Bạn muốn xem chi tiết '{user_text}' phải không?",
                "meta": {}
            }

        # ===== STATE BRANCH =====
        elif convo_state == "branch":
            try:
                details = get_law_detail(user_text)
                if not details:
                    details = "Không tìm thấy thông tin chi tiết cho văn bản này."
            except Exception as e:
                print("get_law_detail error:", e)
                details = "Hệ thống gặp lỗi khi truy xuất văn bản. Vui lòng thử lại."

            return {
                "state": "advise",
                "reply": f"Đây là tóm tắt văn bản: {details}",
                "meta": {}
            }

        # ===== STATE ADVISE =====
        elif convo_state == "advise":
            return {
                "state": "done",
                "reply": "Cảm ơn bạn đã sử dụng dịch vụ. Nếu cần thêm tư vấn pháp luật, hãy liên hệ luật sư.",
                "meta": {}
            }

        # ===== STATE DONE =====
        else:
            return {
                "state": "done",
                "reply": "Cuộc trò chuyện đã kết thúc. Hãy bắt đầu cuộc trò chuyện mới nếu cần.",
                "meta": {}
            }

    except Exception as e:
        print("Unexpected error in next_step:", e)
        return {
            "state": convo_state,
            "reply": "Hệ thống AI gặp sự cố. Vui lòng thử lại sau.",
            "meta": {}
        }
