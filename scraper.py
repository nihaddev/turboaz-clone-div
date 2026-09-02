import requests
import json
import time
from bs4 import BeautifulSoup

def scrape_turbo_az(start_cursor, max_pages=5):
    base_url = "https://turbo.az/home/lazy_sections/featured"
    cursor = start_cursor
    all_cars = []
    
    # Headerleri əlavə edirik ki, sayt bizi bot kimi bloklamasın
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
    }

    print("Scraping başladı...")

    for page in range(max_pages):
        if not cursor:
            break
            
        print(f"Səhifə {page + 1} çəkilir (cursor: {cursor})...")
        
        try:
            response = requests.get(base_url, params={"cursor": cursor}, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            section = data.get("section", {})
            html_content = section.get("data", "")
            cursor = section.get("cursor")
            last_data = section.get("last_data", True)
            
            if not html_content:
                break
                
           
            soup = BeautifulSoup(html_content, "html.parser")
            product_items = soup.find_all("div", class_="products-i")
            
            for item in product_items:
                car = {}
                
                # Link
                link_tag = item.find("a", class_="products-i__link")
                if link_tag and link_tag.get("href"):
                    car["link"] = "https://turbo.az" + link_tag["href"]
                
                # Şəkil
                img_tag = item.find("img")
                if img_tag and img_tag.get("src"):
                    car["image_url"] = img_tag["src"]
                
                # Qiymət
                price_tag = item.find("div", class_="products-i__price")
                if price_tag:
                    car["price"] = price_tag.text.strip()
                    
                # Model Adı
                name_tag = item.find("div", class_="products-i__name")
                if name_tag:
                    car["name"] = name_tag.text.strip()
                    
                # Xüsusiyyətlər (İl, Mühərrik, Yürüş)
                attr_tag = item.find("div", class_="products-i__attributes")
                if attr_tag:
                    attrs_text = attr_tag.text.strip()
                    attrs_list = [a.strip() for a in attrs_text.split(",")]
                    
                    properties = {}
                    if len(attrs_list) >= 1:
                        properties["year"] = attrs_list[0]
                    if len(attrs_list) >= 2:
                        properties["engine"] = attrs_list[1]
                    if len(attrs_list) >= 3:
                        properties["km"] = attrs_list[2]
                        
                    car["properties"] = properties
                    
                # Tarix və Məkan
                datetime_tag = item.find("div", class_="products-i__datetime")
                if datetime_tag:
                    car["datetime"] = datetime_tag.text.strip()
                
                all_cars.append(car)
                
            if last_data:
                print("Son məlumatlara çatdıq.")
                break
                
            # Serveri çox yormamaq üçün bir az gözləyirik
            time.sleep(1.5)
            
        except Exception as e:
            print(f"Xəta baş verdi: {e}")
            break
            
    # Məlumatları JSON olaraq yadda saxlayırıq
    output_file = "turbo_az_cars.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(all_cars, f, ensure_ascii=False, indent=4)
        
    print(f"Ümumilikdə {len(all_cars)} maşın məlumatı uğurla çəkildi!")
    print(f"Məlumatlar '{output_file}' faylına yadda saxlanıldı.")

if __name__ == "__main__":
    # İlk cursor olaraq verdiyin nümunəni istifadə edirik
    start_cursor = "1788207606.469858_10034165"
    
    # Neçə dəfə aşağı kaydırma simulyasiya edəcəyimizi burada seçirik (məsələn, 3 dəfə)
    scrape_turbo_az(start_cursor, max_pages=3)
