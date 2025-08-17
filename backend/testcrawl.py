from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time

# Cấu hình Chrome
options = Options()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)

# Mở trang login trực tiếp
driver.get("https://luatvietnam.vn/account/login")

# Nhập email
WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "LoginCustomerName"))).send_keys("sinhvienluat")

# Nhập mật khẩu
driver.find_element(By.ID, "LoginCustomerPass").send_keys("luatdhm")

# Click nút đăng nhập
driver.find_element(By.CSS_SELECTOR, "button.btn-user1").click()

# # Chờ đăng nhập xong
# WebDriverWait(driver, 10).until(EC.url_contains("luatvietnam.vn"))
time.sleep(5)

print("Đăng nhập thành công!")

# Mở trang
driver.get("https://luatvietnam.vn/")

# Cuộn xuống để load nội dung
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
time.sleep(3)  # chờ load JS

# Chờ phần tử xuất hiện (tối đa 10 giây)
try:
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "div.post-doc"))
    )
except:
    print("Không tìm thấy div.post-doc sau khi cuộn trang")
    driver.quit()
    exit()

# Tìm tất cả văn bản mới
vb_elements = driver.find_elements(By.CSS_SELECTOR, "div.post-doc")

print(f"Đã tìm thấy {len(vb_elements)} văn bản.")

# Lưu ra file JSON
data = []
for el in vb_elements:
    try:
        title = el.find_element(By.CSS_SELECTOR, ".doc-title a").text.strip()
        
        link = el.find_element(By.CSS_SELECTOR, ".doc-title a").get_attribute("href")
        #so_hieu = el.find_element(By.CSS_SELECTOR, ".doc-code").text.strip()

        # Các thông tin phụ
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

        data.append({
            "title": title,
            "ngay_ban_hanh": info_map.get("Ban hành", ""),
            "ngay_ap_dung": info_map.get("Áp dụng", ""),
            "ngay_het_hieu_luc": info_map.get("Hiệu lực", ""),
            "ngay_cap_nhat": info_map.get("Cập nhật", ""),
            "link": link
        })



    except Exception as e:
        print("Lỗi:", e)
        continue

with open("vanban_moi.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Đã lưu xong vào vanban_moi.json")

driver.quit()
