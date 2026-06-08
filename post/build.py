from pathlib import Path
import re
import json
import uuid
import shutil

save_dir = Path("post/save")
articles_dir = Path("post/articles")
json_path = Path("posts/posts.json")

articles_dir.mkdir(parents=True, exist_ok=True)

build_pattern = re.compile(r"^build-(\d+)\.md$")


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

    body = "\n".join(lines[end_index + 1:])
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


if json_path.exists():
    with json_path.open("r", encoding="utf-8") as f:
        posts = json.load(f)
else:
    posts = []


build_files = sorted(
    (
        (int(match.group(1)), file)
        for file in save_dir.iterdir()
        if file.is_file()
        and (match := build_pattern.match(file.name))
    ),
    key=lambda x: x[0]
)


for _, file in build_files:
    text = file.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter_and_body(text)

    post_id = str(uuid.uuid4())

    new_post = {
        "id": post_id,
        "title": frontmatter.get("title", ""),
        "description": body[:200],
        "date": frontmatter.get("date", ""),
        "tags": parse_tags(frontmatter.get("tags", "[]")),
    }

    posts.append(new_post)

    target_path = articles_dir / f"{post_id}.md"
    shutil.move(str(file), str(target_path))


with json_path.open("w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)