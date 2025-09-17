import json
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# ================== Hàm xử lý ngày ==================
def parse_date(date_str):
    if not date_str or date_str in ["N/A", "Chưa rõ"]:
        return None
    try:
        return datetime.strptime(date_str, "%d/%m/%Y").strftime("%Y-%m-%d")
    except:
        return None

# ================== Map danh mục ==================
CATEGORY_MAP = {
    "dan-su": 1,
    "hinh-su": 2,
    "lao-dong": 3,
    "dat-dai": 4,
    "hon-nhan-gia-dinh": 5,
    "giao-thong": 6,
    "thuong-mai": 7,
    "thue": 8,
    "moi-truong": 9,
    "cong-nghe-thong-tin": 10,
    "nong-nghiep": 11,
    "co-cau-to-chuc": 12,
    "hanh-chinh": 13,
    "thong-tin": 14,
    "chinh-sach": 15,
    "dau-tu": 16,
    "vi-pham-hanh-chinh": 17,
    "xay-dung": 18,
    "giao-duc": 19,
    "khoa-hoc": 20,
    "y-te": 21,
    "can-bo-cong-chuc": 22,
    "bao-hiem": 23,
    "bieu-mau": 24,
}

def detect_category_id(link, title):
    for slug, cid in CATEGORY_MAP.items():
        if slug in link or slug in title.lower():
            return cid
    return 1

# ================== Selenium setup ==================
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=options)

# ================== Login ==================
driver.get("https://luatvietnam.vn/account/login")
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "LoginCustomerName"))).send_keys("sinhvienluat")
time.sleep(2)
driver.find_element(By.ID, "LoginCustomerPass").send_keys("luatdhm")
time.sleep(2)
driver.find_element(By.CSS_SELECTOR, "button.btn-user1").click()
time.sleep(5)
print("Đăng nhập thành công!")

# ================== Crawl danh sách văn bản ==================
driver.get("https://luatvietnam.vn/van-ban-moi.html")
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
time.sleep(5)

vb_elements = WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.CSS_SELECTOR, "article.doc-article"))
)
print(f"Tìm thấy {len(vb_elements)} văn bản")

documents = []

for el in vb_elements:
    try:
        title = el.find_element(By.CSS_SELECTOR, ".doc-title a").text.strip()
        link = el.find_element(By.CSS_SELECTOR, ".doc-title a").get_attribute("href")
        code = "N/A"
        try:
            code = el.find_element(By.CSS_SELECTOR, ".doc-number").text.strip()
        except:
            pass

        # Crawl thông tin phụ
        info_map = {}
        try:
            info_container = el.find_element(By.CSS_SELECTOR, ".post-meta-doc")
            rows = info_container.find_elements(By.CSS_SELECTOR, ".doc-dmy, .doc-dmy.m-hide")
            for row in rows:
                spans = row.find_elements(By.CSS_SELECTOR, "span")
                if len(spans) >= 2:
                    label = spans[0].text.strip().rstrip(":")
                    value = driver.execute_script("return arguments[0].textContent;", spans[1]).strip()
                    info_map[label] = value
        except:
            pass

        issued_by = info_map.get("Cơ quan ban hành", "Chưa rõ")
        issued_date = parse_date(info_map.get("Ban hành", None))
        applied_date = parse_date(info_map.get("Áp dụng", None))
        status = info_map.get("Hiệu lực", None)
        updated_date = parse_date(info_map.get("Cập nhật", None))
        category_id = detect_category_id(link, title)

        # ================== Crawl chi tiết văn bản ==================
        pdf_url, signer = None, None
        try:
            driver.execute_script("window.open(arguments[0]);", link)
            driver.switch_to.window(driver.window_handles[-1])
            time.sleep(3)

            # lấy link PDF trong iframe
            try:
                iframe = WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div.embedContent2 iframe"))
                )
                pdf_url = iframe.get_attribute("src")
            except:
                pdf_url = None

            # lấy tên người ký (signer) trong link tác giả
            try:
                signer_el = driver.find_element(By.CSS_SELECTOR, "a[title]")
                signer = signer_el.get_attribute("title").strip()
            except:
                signer = None

            driver.close()
            driver.switch_to.window(driver.window_handles[0])
        except Exception as e:
            print(f" Lỗi crawl chi tiết {title}: {e}")
            try:
                driver.close()
                driver.switch_to.window(driver.window_handles[0])
            except:
                pass


        # ================== Lưu vào list ==================
        doc = {
            "title": title,
            "code": code,
            "issued_by": issued_by,
            "issued_date": issued_date,
            "applied_date": applied_date,
            "status": status,
            "updated_date": updated_date,
            "summary": "Không có tóm tắt",
            "source_url": link,
            "category_id": category_id,
            "pdf_url": pdf_url,
            "signer": signer,
        }
        documents.append(doc)
        print(f"Đã crawl: {title}")

    except Exception as e:
        print(" Lỗi:", e)
        continue

# ================== Xuất JSON ==================
with open("law_documents.json", "w", encoding="utf-8") as f:
    json.dump(documents, f, ensure_ascii=False, indent=2)

print("Đã lưu dữ liệu vào law_documents.json")

driver.quit()
