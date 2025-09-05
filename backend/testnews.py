from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time
from datetime import datetime
from markdownify import markdownify as md

# ================== 1. Selenium ==================
options = Options()
options.add_argument("--start-maximized")
driver = webdriver.Chrome(options=options)

url = "https://luatvietnam.vn/tin-phap-luat.html"
driver.get(url)

WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.CSS_SELECTOR, "section.section"))
)
time.sleep(5)

# ================== 2. Crawl danh sách ==================
news_list = []

def crawl_list():
    # 1. Tin lớn
    for el in driver.find_elements(By.CSS_SELECTOR, "article.article-news"):
        try:
            title = el.find_element(By.CSS_SELECTOR, "h2.article-title a").text.strip()
            link = el.find_element(By.CSS_SELECTOR, "h2.article-title a").get_attribute("href")
            try:
                summary = el.find_element(By.CSS_SELECTOR, ".article-summary.clamp5").text.strip()
            except:
                try:
                    summary = el.find_element(By.CSS_SELECTOR, ".article-summary").text.strip()
                except:
                    summary = ""
            try:
                image = el.find_element(By.CSS_SELECTOR, "figure img").get_attribute("src")
            except:
                image = ""
            try:
                ngay = el.find_element(By.CSS_SELECTOR, ".article-meta .time-date").text.strip()
            except:
                ngay = ""
            news_list.append({
                "title": title,
                "summary": summary,
                "link": link,
                "image": image,
                "ngay": ngay
            })
        except Exception as e:
            print("Lỗi article-news:", e)

    # 2. Tin nhỏ 3 cột
    for el in driver.find_elements(By.CSS_SELECTOR, "article.article-news3"):
        try:
            title = el.find_element(By.CSS_SELECTOR, "h3.article-title a").text.strip()
            link = el.find_element(By.CSS_SELECTOR, "h3.article-title a").get_attribute("href")
            try:
                image = el.find_element(By.CSS_SELECTOR, "figure img").get_attribute("src")
            except:
                image = ""
            try:
                ngay = el.find_element(By.CSS_SELECTOR, ".article-meta .time-date").text.strip()
            except:
                ngay = ""
            news_list.append({
                "title": title,
                "summary": "",
                "link": link,
                "image": image,
                "ngay": ngay
            })
        except Exception as e:
            print("Lỗi article-news3:", e)

    # 3. Tin cột phải
    for el in driver.find_elements(By.CSS_SELECTOR, "article.art-news"):
        try:
            title = el.find_element(By.CSS_SELECTOR, "h3.article-title a").text.strip()
            link = el.find_element(By.CSS_SELECTOR, "h3.article-title a").get_attribute("href")
            try:
                ngay = el.find_element(By.CSS_SELECTOR, ".article-meta .time-date").text.strip()
            except:
                ngay = ""
            news_list.append({
                "title": title,
                "summary": "",
                "link": link,
                "image": "",
                "ngay": ngay
            })
        except Exception as e:
            print("Lỗi art-news:", e)

crawl_list()
driver.quit()
print(f"✅ Đã crawl danh sách {len(news_list)} bài")

# ================== 3. Crawl chi tiết ==================
options2 = Options()
options2.add_argument("--start-maximized")
driver2 = webdriver.Chrome(options=options2)

data = []

def crawl_detail(link):
    detail_content = ""
    try:
        driver2.get(link)
        time.sleep(3)
        WebDriverWait(driver2, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "#article-content"))
        )
        detail_el = driver2.find_element(By.CSS_SELECTOR, "#article-content")
        html_content = detail_el.get_attribute("innerHTML").strip()
        detail_content = md(html_content, heading_style="ATX", bullets='-')
    except Exception as e:
        print(" Lỗi crawl chi tiết:", link, e)
    return detail_content

for item in news_list:
    publish_date = None
    if item['ngay']:
        try:
            publish_date = datetime.strptime(item['ngay'], "%d/%m/%Y").strftime("%Y-%m-%d")
        except:
            publish_date = None

    detail = crawl_detail(item['link'])
    data.append({
        "title": item['title'],
        "content": item['summary'],
        "detail": detail,
        "source": "LuatVietnam",
        "publish_date": publish_date,
        "source_url": item['link'],
        "thumbnail": item['image']
    })
    time.sleep(1)

driver2.quit()

# ================== 4. Ghi file JSON ==================
with open("legal_news.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("🎉 Crawl xong, đã lưu vào legal_news.json.")
