# upload.py
# 1) upload 폴더의 각 md 파일에서 frontmatter(meta) 읽기
# 2) categories.json 유효성 검사
# 3) 파일명 랜덤 변경 후 post 폴더 이동
# 4) posts.json 등록
# 5) categories.json count 증가

import json
import uuid
import shutil
from pathlib import Path


# 마크다운 텍스트에서 frontmatter 메타데이터를 파싱하여 dict로 반환
def parse_frontmatter(md_text: str) -> dict:
    lines = md_text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}

    end_idx = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_idx = i
            break
    if end_idx is None:
        return {}

    meta_lines = lines[1:end_idx]
    meta = {}

    for line in meta_lines:
        s = line.strip()
        if ":" not in s:
            continue
        key, value = s.split(":", 1)
        key = key.strip()
        value = value.strip()
        meta[key] = value

    return meta


# JSON 파일을 로드하여 반환하며, 없거나 오류 시 default 값을 반환
def load_json(json_path: Path, default=None):
    if not json_path.exists() or not json_path.is_file():
        return default

    try:
        return json.loads(json_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"[ERROR] JSON load failed: {json_path} -> {e}")
        return default


# dict 또는 list 형태의 데이터를 JSON 파일로 저장
def save_json(json_path: Path, data):
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )


# "[..., ...]" 형태의 categories 문자열을 list[str]로 변환
def parse_categories_strict(categories: str) -> list[str]:
    s = categories.strip()
    s = s[1:-1]
    return [c.strip().strip('"\'') for c in s.split(",") if c.strip()]


# categories.json 트리 구조에서 카테고리 경로가 유효한지 검사
def validate_categories(categories: str, categories_json) -> bool:
    if categories_json is None or not isinstance(categories_json, dict):
        return False

    if categories is None:
        return False

    cat_list = parse_categories_strict(categories)
    if not cat_list:
        return False

    node = categories_json
    for name in cat_list:
        if not isinstance(node, dict):
            return False
        if name not in node:
            return False
        node = node[name]
        if not isinstance(node, dict):
            return False

    return True


# 카테고리 경로를 따라 내려가며 각 _meta.count 값을 1씩 증가
def increase_category_count(categories_json: dict, categories: list[str]):
    node = categories_json
    for name in categories:
        if name not in node:
            print(f"[WARN] category not found while counting: {name}")
            return
        node = node[name]
        if "_meta" in node and "count" in node["_meta"]:
            node["_meta"]["count"] += 1
        else:
            print(f"[WARN] _meta.count missing in: {name}")


# posts.json에 게시글 메타데이터를 추가
def append_post_json(posts_json_path: Path, post_id: str, meta: dict):
    posts_data = load_json(posts_json_path, default=[])
    if not isinstance(posts_data, list):
        posts_data = []

    categories_list = parse_categories_strict(meta.get("categories", "[]"))

    post_obj = {
        "id": post_id,
        "title": meta.get("title", ""),
        "date": meta.get("date", ""),
        "categories": categories_list
    }

    posts_data.append(post_obj)
    save_json(posts_json_path, posts_data)


# 업로드 전체 파이프라인을 실행하는 메인 함수
def main():
    here = Path(__file__).resolve().parent

    upload_dir = here / "upload"
    post_dir = (here / "../post").resolve()
    post_dir.mkdir(parents=True, exist_ok=True)

    categories_json_path = (here / "../assets/json/categories.json").resolve()
    posts_json_path = (here / "../assets/json/posts.json").resolve()

    categories_json = load_json(categories_json_path, default=None)
    if categories_json is None or not isinstance(categories_json, dict):
        print(f"[FATAL] categories.json is missing or invalid: {categories_json_path}")
        return

    md_files = sorted(upload_dir.glob("*.md"))

    for p in md_files:
        try:
            text = p.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            text = p.read_text(encoding="utf-8-sig")

        meta = parse_frontmatter(text)
        categories = meta.get("categories", None)

        ok = validate_categories(categories, categories_json)

        if ok:
            post_id = uuid.uuid4().hex
            new_name = f"{post_id}.md"
            dest_path = post_dir / new_name

            while dest_path.exists():
                post_id = uuid.uuid4().hex
                new_name = f"{post_id}.md"
                dest_path = post_dir / new_name

            shutil.move(str(p), str(dest_path))

            append_post_json(posts_json_path, post_id, meta)

            categories_list = parse_categories_strict(categories)
            increase_category_count(categories_json, categories_list)

            save_json(categories_json_path, categories_json)

            print(f"[OK] uploaded: {new_name}")
        else:
            print(f"[SKIP] invalid categories: {p.name}")


if __name__ == "__main__":
    main()
