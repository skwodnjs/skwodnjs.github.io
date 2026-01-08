import markdown
import yaml
from bs4 import BeautifulSoup
import os
import shutil
import json

def parse_markdown_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        raw_text = f.read()
    parts = raw_text.split('---', 2)
    
    if len(parts) >= 3:
        metadata = yaml.safe_load(parts[1])
        
        body_html = markdown.markdown(parts[2].strip(), extensions=['fenced_code', 'tables'])

        soup = BeautifulSoup(body_html, 'html.parser')
        plain_text = soup.get_text(separator=' ', strip=True)
        preview = plain_text[:600]
        return metadata, preview
    else:
        return {}, markdown.markdown(raw_text)

post_list = []
base_path = "./build/build"
target_path = "./posts"

if not os.path.exists(target_path):
    os.makedirs(target_path)
    
for filename in os.listdir(base_path):
    if filename.endswith(".md"):
        full_path = os.path.join(base_path, filename)
        meta, preview = parse_markdown_file(full_path)

        if not meta:
            continue

        post_id = str(meta.get('id', filename.replace('.md', '')))
        new_filename = f"{post_id}.md"
        new_path = os.path.join(target_path, new_filename)

        if os.path.exists(new_path):
            print(f"⚠️  중복 발생: '{new_filename}'이 이미 존재합니다.")
            continue

        shutil.move(full_path, new_path)

for filename in os.listdir(target_path):
    if filename.endswith(".md"):
        full_path = os.path.join(target_path, filename)
        meta, preview = parse_markdown_file(full_path)

        if not meta:
            continue

        post_id = str(meta.get('id', filename.replace('.md', '')))
        post_list.append({
            "id": post_id,
            "title": meta.get('title', '제목 없음'),
            "date": meta.get('date', '2000. 00. 00.'),
            "categories": meta.get('categories', []),
            "url": f"./post.html?id={post_id}",
            "preview": preview
        })
        print(f"[{post_id}] {meta.get('date', '2000. 00. 00.')} {meta.get('title', '제목 없음')}")

post_list.sort(key=lambda x: x['date'], reverse=True)

with open('./assets/posts.json', 'w', encoding='utf-8') as f:
    json.dump(post_list, f, ensure_ascii=False, indent=4)

print(f"\n성공: {len(post_list)}개의 포스트 처리 완료.")