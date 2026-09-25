from pathlib import Path
import json
import re

post_dir = Path("post")
json_path = Path("data/posts.json")
allowed_categories = {"mathematics", "research"}


def parse_frontmatter_and_body(text):
    lines = text.splitlines()

    if not lines or lines[0].strip() != "---":
        return {}, text

    frontmatter = {}
    end_index = None

    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end_index = i
            break

        if ":" in lines[i]:
            key, value = lines[i].split(":", 1)
            frontmatter[key.strip()] = value.strip()

    if end_index is None:
        return {}, text

    body = "\n".join(lines[end_index + 1:]).strip()
    return frontmatter, body


def make_description(body, length=200):
    body = re.sub(r"\s+", " ", body).strip()
    return body[:length]


posts = []

for file in sorted(post_dir.glob("*.md"), key=lambda file: file.name):
    text = file.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter_and_body(text)

    category = frontmatter.get("category", "").strip().lower()

    if not category:
        continue

    if category not in allowed_categories:
        raise ValueError(f"{file}: unknown category '{category}'")

    title = frontmatter.get("title", "").strip()
    date = frontmatter.get("date", "").strip()

    if not title or not date:
        raise ValueError(f"{file}: published posts require title and date")

    posts.append({
        "id": file.stem,
        "title": title,
        "description": make_description(body),
        "date": date,
        "category": category,
    })


json_path.parent.mkdir(parents=True, exist_ok=True)

with json_path.open("w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)
    f.write("\n")
