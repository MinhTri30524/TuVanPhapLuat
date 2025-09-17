from .models import LawDocument

def get_law_detail(query_or_id: str) -> str:
    """
    Tìm và trả về nội dung tóm tắt văn bản luật
    query_or_id: có thể là id hoặc tiêu đề mà user chọn
    """
    try:
        # Nếu user gửi id
        if query_or_id.isdigit():
            law = LawDocument.objects.get(pk=int(query_or_id))
        else:
            law = LawDocument.objects.filter(title__icontains=query_or_id).first()

        if not law:
            return "Không tìm thấy văn bản phù hợp."

        # Tùy ý tóm tắt gọn nội dung
        return f"{law.title}\nTrích yếu: {law.summary}\nHiệu lực từ: {law.effective_date}"
    except Exception:
        return "Có lỗi khi lấy dữ liệu văn bản."
