from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import mysql.connector
import json
from datetime import datetime
import re
import time
import hashlib
from markdownify import markdownify as md


# ==================== MySQL Config ====================
DB_HOST = "localhost"
DB_USER = "root"
DB_PASS = "3005triminh"
DB_NAME = "laws"

# ==================== Selenium Config ====================
BASE_URL = "https://luatvietnam.vn/luat-su-tu-van.html"

options = Options()
options.page_load_strategy = "eager"
# options.add_argument("--headless")  # bật nếu không cần GUI
options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=options)


# ==================== Helper Functions ====================
def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return re.sub(r"^-|-$", "", text)


def get_category_id(cursor, cat_name: str):
    """Lấy ID category có sẵn trong DB (nếu không thì return None)."""
    if not cat_name:
        return None
    slug = slugify(cat_name)
    cursor.execute("SELECT id FROM laws_lawcategory WHERE slug=%s", (slug,))
    result = cursor.fetchone()
    return result[0] if result else None


def gen_question_id(url: str) -> str:
    """Sinh ID ổn định dựa trên URL."""
    return "Q" + hashlib.md5(url.encode()).hexdigest()[:10]


# ==================== Crawl list page ====================
def crawl_consultation_list(page: int = 1):
    url = f"{BASE_URL}?page={page}"
    driver.get(url)

    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "tr"))
        )
    except Exception as e:
        print(f"Trang {page} không load được dữ liệu: {e}")
        return []

    question_links = []
    rows = driver.find_elements(By.CSS_SELECTOR, "tr")

    for q in rows:
        try:
            title_el = q.find_element(By.CSS_SELECTOR, "h3.article-hoi-dap a")
            title = title_el.text.strip()
            url_detail = title_el.get_attribute("href")

            category_el = q.find_element(By.CSS_SELECTOR, "p.meta-hoi-dap a")
            category = category_el.text.strip()

            date_el = q.find_element(By.CSS_SELECTOR, "p.tag-hoi-dap .time-date")
            date_str = date_el.text.strip()
            asked_date = None
            if date_str:
                try:
                    asked_date = datetime.strptime(date_str, "%d/%m/%Y").strftime("%Y-%m-%d")
                except Exception:
                    asked_date = None

            question_links.append({
                "title": title,
                "url_detail": url_detail,
                "category": category,
                "asked_date": asked_date
            })
        except Exception as e:
            print(" Lỗi khi đọc row:", e)
            continue

    return question_links


# ==================== Crawl detail page ====================
def crawl_consultation_detail(item: dict):
    answer = ""
    try:
        driver.get(item["url_detail"])
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.entry-hoi-dap div.the-article-body.entry"))
        )
        answer_el = driver.find_element(By.CSS_SELECTOR, "div.entry-hoi-dap div.the-article-body.entry")
        answer_html = answer_el.get_attribute("innerHTML")
        answer = md(answer_html, strip=["figure", "img"])
    except Exception as e:
        print(f"Không lấy được câu trả lời ({item['url_detail']}): {e}")

    return {
        "question_id": gen_question_id(item["url_detail"]),
        "question_title": item["title"],
        "category": item["category"],
        "question_url": item["url_detail"],
        "asked_date": item["asked_date"],
        "answer": answer
    }


# ==================== Save to MySQL ====================
def save_to_db(all_data: list):
    conn = mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME
    )
    cursor = conn.cursor()

    insert_sql = """
    INSERT INTO laws_legalconsultation
    (question_id, question_title, category_id, question_url, asked_date, answer, created_at)
    VALUES (%s, %s, %s, %s, %s, %s, NOW())
    ON DUPLICATE KEY UPDATE
        question_title=VALUES(question_title),
        category_id=VALUES(category_id),
        question_url=VALUES(question_url),
        asked_date=VALUES(asked_date),
        answer=VALUES(answer)
    """

    count = 0
    for item in all_data:
        try:
            # xử lý category_id giống news
            cat_slug = slugify(item["category"]) if item["category"] else None
            cat_id = None
            if cat_slug:
                cursor.execute("SELECT id FROM laws_lawcategory WHERE slug=%s", (cat_slug,))
                row = cursor.fetchone()
                cat_id = row[0] if row else None

            cursor.execute(insert_sql, (
                item["question_id"],
                item["question_title"],
                cat_id,
                item["question_url"],
                item["asked_date"],
                item["answer"]
            ))
            count += 1
        except Exception as e:
            conn.rollback()
            print("Lỗi khi insert DB:", e)
            continue

    conn.commit()
    cursor.close()
    conn.close()
    print(f"Đã lưu {count}/{len(all_data)} câu hỏi vào MySQL")


# ==================== Main ====================
if __name__ == "__main__":
    all_data = []

    try:
        for p in range(1, 3):  # crawl từ page 1 -> 2
            print(f"\n Đang crawl trang {p} ...")
            questions = crawl_consultation_list(p)
            print(f"   ➝ Tìm thấy {len(questions)} câu hỏi")

            for q in questions:
                detail = crawl_consultation_detail(q)
                all_data.append(detail)

                print("aaaa", detail["question_title"])
                print("   ➝ URL:", detail["question_url"])
                print("   ➝ Answer length:", len(detail["answer"]))
                print("--------------------------------------------------")

                time.sleep(0.5)  # tránh bị chặn

        # Lưu JSON tạm
        with open("consultations.json", "w", encoding="utf-8") as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)

        print(f"\nĐã lưu {len(all_data)} câu hỏi vào consultations.json")

        # Lưu vào DB
        if all_data:
            save_to_db(all_data)

    finally:
        driver.quit()
