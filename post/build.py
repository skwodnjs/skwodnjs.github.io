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
            return frontmatter, "\n".join(lines[i + 1:]).strip()

        if ":" in line:
            key, value = line.split(":", 1)
            frontmatter[key.strip()] = value.strip()

    raise ValueError(f"{path}: unclosed front matter")


def make_description(body, length=200):
    math = []

    def protect_math(match):
        content = match.group(1) if match.group(1) is not None else match.group(2)
        token = f"@@MATH{len(math)}@@"
        math.append(content.strip())
        return token

    text = re.sub(r"\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$", protect_math, body)
    text = re.sub(r"\x60{3}[\s\S]*?\x60{3}", " ", text)
    text = re.sub(r"!\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"(?m)^\s{0,3}#{1,6}\s*", "", text)
    text = re.sub(r"(?m)^\s*>\s?", "", text)
    text = re.sub(r"(?m)^\s*(?:[-+*]|\d+\.)\s+", "", text)
    text = re.sub(r"(?m)^\s*[-*_]{3,}\s*$", " ", text)
    text = re.sub(r"[\x60*_~]", "", text)

    for i, content in enumerate(math):
        text = text.replace(f"@@MATH{i}@@", content)

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
            "description": make_description(body),
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
