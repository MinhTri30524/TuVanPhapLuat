import json

# Map JSON category string -> category_id trong DB
CATEGORY_MAP = {
    "Dân sự": 1,
    "Hình sự": 2,
    "Lao động-Việc làm": 3,
    "Đất đai-Nhà ở": 4,
    "Hôn nhân-Gia đình": 5,
    "Giao thông-Vận tải": 6,
    "Thương mại-Kinh doanh": 7,
    "Thuế - Tài chính": 8,
    "Môi trường": 9,
    "Công nghệ thông tin": 10,
    "Nông nghiệp": 11,
    "Cơ cấu tổ chức": 12,
    "Hành chính": 13,
    "Thông tin": 14,
    "Chính sách": 15,
    "Đầu tư": 16,
    "Vi phạm hành chính": 17,
    "Xây dựng": 18,
    "Giáo dục": 19,
    "Khoa học": 20,
    "Y tế": 21,
    "Cán bộ-Công chức": 22,
    "Bảo hiểm": 23,
    "Biểu mẫu": 24,
    "Doanh nghiệp": 25,
}

with open("consultations.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("insert_questions.sql", "w", encoding="utf-8") as out:
    for item in data:
        cat_name = item["category"]
        cat_id = CATEGORY_MAP.get(cat_name, "NULL")  # fallback NULL nếu chưa map

        sql = f"""
        INSERT INTO laws.laws_legalconsultation
        (question_id, question_title, category_id, question_url, asked_date, answer, created_at)
        VALUES
        (
          '{item["question_id"]}',
          '{item["question_title"].replace("'", "''")}',
          {cat_id},
          '{item["question_url"]}',
          '{item["asked_date"]}',
          '{(item["answer"] or "").replace("'", "''")}',
          NOW()
        );
        """.strip() + "\n\n"

        out.write(sql)
