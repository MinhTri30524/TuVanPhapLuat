from langchain.prompts import PromptTemplate
from laws.services import get_law_detail
import json

analyze_prompt = PromptTemplate.from_template("""
Bạn là luật sư ảo. Xác định mục đích chính của người dùng và đề xuất 3 nội dung tra cứu liên quan (title, url).
Trả JSON: {{"intent": "...", "suggestions": [{{"title": "...", "id": 1}}]}}
Câu hỏi: "{query}"
""")

def next_step(convo_state, user_text, llm):
    """
    convo_state: init, suggest, branch...
    return dict { state, reply, meta }
    """
    if convo_state == "init":
        resp = llm.invoke(analyze_prompt.format(query=user_text))
        parsed = json.loads(resp.content)
        return {
            "state": "suggest",
            "reply": f"Tôi thấy bạn quan tâm {parsed['intent']}. Tôi gợi ý {len(parsed['suggestions'])} văn bản...",
            "meta": parsed
        }

    elif convo_state == "suggest":
        # nếu user chọn văn bản
        return {
            "state": "branch",
            "reply": f"Bạn muốn xem chi tiết {user_text} phải không?",
            "meta": {}
        }

    elif convo_state == "branch":
        details = get_law_detail(user_text)
        return {
            "state": "advise",
            "reply": f"Đây là tóm tắt văn bản: {details}",
            "meta": {}
        }

    else:
        return {
            "state": "done",
            "reply": "Cảm ơn bạn. Tôi khuyến nghị liên hệ luật sư nếu cần thêm tư vấn.",
            "meta": {}
        }
