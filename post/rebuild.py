from pathlib import Path
import json
import re

articles_dir = Path("post/articles")
json_path = Path("posts/posts.json")


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


def parse_tags(value):
    value = value.strip()

    if value.startswith("[") and value.endswith("]"):
        return [
            tag.strip()
            for tag in value[1:-1].split(",")
            if tag.strip()
        ]

    return []


def make_description(body, length=200):
    body = re.sub(r"\s+", " ", body).strip()
    return body[:length]


posts = []

article_files = sorted(
    articles_dir.glob("*.md"),
    key=lambda file: file.name
)

for file in article_files:
    text = file.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter_and_body(text)

    post_id = file.stem

    posts.append({
        "id": post_id,
        "title": frontmatter.get("title", ""),
        "description": make_description(body),
        "date": frontmatter.get("date", ""),
        "tags": parse_tags(frontmatter.get("tags", "[]")),
    })


json_path.parent.mkdir(parents=True, exist_ok=True)

with json_path.open("w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)