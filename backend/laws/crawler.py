from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def crawl_document_detail(url):
    print("url", url)
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    driver = None
    try:
        driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=options
        )
        driver.set_page_load_timeout(15)   # timeout 15s
        

        driver.get(url)
        time.sleep(2)

        title = driver.title or ""
        try:
            pdf_element = driver.find_element(By.CSS_SELECTOR, "a.pdf-link")
            pdf_url = pdf_element.get_attribute("href")
        except:
            pdf_url = None

        return {
            "success": True,
            "title": title,
            "pdf_url": pdf_url
        }

    except Exception as e:
        # luôn return JSON để không 502
        return {
            "success": False,
            "error": str(e),
            "title": "",
            "pdf_url": None
        }

    finally:
        if driver:
            driver.quit()
