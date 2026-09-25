from pathlib import Path
import json
import re

ARTICLES_DIR = Path("post/articles")
INDEX_PATH = Path("data/posts.json")
ALLOWED_CATEGORIES = {"mathematics", "research"}


def parse_frontmatter(text, path):
    text = text.lstrip("\ufeff")
    lines = text.splitlines()

    if not lines or lines[0].strip() != "---":
        return {}, text

    frontmatter = {}

    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            body = "\n".join(lines[i + 1:]).strip()
            return frontmatter, body

        if ":" not in line:
            continue

        key, value = line.split(":", 1)
        key, value = key.strip(), value.strip()

        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]

        frontmatter[key] = value

    raise ValueError(f"{path}: unclosed front matter")


def make_description(body, length=200):
    text = re.sub(r"```[\s\S]*?```", " ", body)
    text = re.sub(r"\$\$[\s\S]*?\$\$", " ", text)
    text = re.sub(r"\$[^$\n]+\$", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"(?m)^\s{0,3}#{1,6}\s*", "", text)
    text = re.sub(r"(?m)^\s*>\s?", "", text)
    text = re.sub(r"(?m)^\s*(?:[-+*]|\d+\.)\s+", "", text)
    text = re.sub(r"(?m)^\s*[-*_]{3,}\s*$", " ", text)
    text = re.sub(r"[`*_~]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:length]


def build_index():
    posts = []

    for path in sorted(ARTICLES_DIR.glob("*.md")):
        frontmatter, body = parse_frontmatter(path.read_text(encoding="utf-8"), path)
        category = frontmatter.get("category", "").strip().lower()

        if not category:
            continue

        if category not in ALLOWED_CATEGORIES:
            raise ValueError(f"{path}: unknown category '{category}'")

        title = frontmatter.get("title", "").strip()
        date = frontmatter.get("date", "").strip()

        if not title or not date:
            raise ValueError(f"{path}: published posts require title and date")

        posts.append({
            "id": path.stem,
            "title": title,
            "description": frontmatter.get("description", "").strip() or make_description(body),
            "date": date,
            "category": category,
        })

    output = json.dumps(posts, ensure_ascii=False, indent=2) + "\n"
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)

    if INDEX_PATH.exists() and INDEX_PATH.read_text(encoding="utf-8") == output:
        return

    INDEX_PATH.write_text(output, encoding="utf-8")


if __name__ == "__main__":
    build_index()
