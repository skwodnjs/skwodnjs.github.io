import os
import json
from bs4 import BeautifulSoup

def generate_post_data():
    post_list = []
    path = "./pages"
    
    for filename in os.listdir(path):
        if filename.endswith(".html"):
            with open(os.path.join(path, filename), 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, 'html.parser')
                
                # HTML 구조에 맞춰 데이터 추출
                title = soup.find('h1', class_='header-title').text
                # 예: "by JWN :: 2025. 12. 27." 에서 날짜만 추출
                date_text = soup.find('div', class_='date').text.split('::')[1].strip()
                preview = soup.find('main').get_text()[:600] # 앞부분 600자
                categories = [el.get_text(strip=True) for el in soup.select('.header-menu .category.link')]
                
                post_list.append({
                    "title": title,
                    "date": date_text,
                    "preview": preview,
                    "categories": categories,
                    "url": f"./pages/{filename}"
                })
                
                print(date_text, title)
    
    # 최신순 정렬
    post_list.sort(key=lambda x: x['date'], reverse=True)
    
    with open('./assets/posts.json', 'w', encoding='utf-8') as f:
        json.dump(post_list, f, ensure_ascii=False, indent=4)

print("BUILD START")
print("============")
generate_post_data()
print("============")
print("DONE")