from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
from datetime import datetime
from .models import LegalNews

def crawl_legal_news():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = webdriver.Chrome(options=options)
    driver.get("https://luatvietnam.vn/tin-phap-luat.html")

    time.sleep(5)  # chờ load trang

    # Tin lớn
    for el in driver.find_elements(By.CSS_SELECTOR, "article.article-news"):
        save_news(
            title = el.find_element(By.CSS_SELECTOR, "h2.article-title a").text.strip(),
            summary = try_get(el, ".article-summary"),
            link = el.find_element(By.CSS_SELECTOR, "h2.article-title a").get_attribute("href"),
            image = try_get_img(el),
            ngay = try_get(el, ".article-meta .time-date"),
        )

    # Tin nhỏ 3 cột
    for el in driver.find_elements(By.CSS_SELECTOR, "article.article-news3"):
        save_news(
            title = el.find_element(By.CSS_SELECTOR, "h3.article-title a").text.strip(),
            summary = "",
            link = el.find_element(By.CSS_SELECTOR, "h3.article-title a").get_attribute("href"),
            image = try_get_img(el),
            ngay = try_get(el, ".article-meta .time-date"),
        )

    # Tin cột phải
    for el in driver.find_elements(By.CSS_SELECTOR, "article.art-news"):
        save_news(
            title = el.find_element(By.CSS_SELECTOR, "h3.article-title a").text.strip(),
            summary = "",
            link = el.find_element(By.CSS_SELECTOR, "h3.article-title a").get_attribute("href"),
            image = "",
            ngay = try_get(el, ".article-meta .time-date"),
        )

    driver.quit()

def try_get(el, selector):
    try:
        return el.find_element(By.CSS_SELECTOR, selector).text.strip()
    except:
        return ""

def try_get_img(el):
    try:
        img = el.find_element(By.CSS_SELECTOR, "figure img")
        return img.get_attribute("src") or img.get_attribute("data-src")
    except:
        return ""

def save_news(title, summary, link, image, ngay):
    try:
        publish_date = datetime.strptime(ngay, "%d/%m/%Y").date() if ngay else None
    except:
        publish_date = None

    LegalNews.objects.update_or_create(
        source_url=link,
        defaults={
            "title": title,
            "content": summary,
            "publish_date": publish_date,
            "source": "LuatVietnam",
        },
    )
