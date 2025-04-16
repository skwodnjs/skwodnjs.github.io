import os
from pathlib import Path

from tex2md import *

def find_all_tex_files(root_dir):
  tex_files = []
  for path in Path(root_dir).rglob("*.tex"):
    if path.is_file():
      tex_files.append(path)
  return tex_files

def write_markdown_file(posts_dir, filename, markdown_content):
    """
    posts 디렉터리에 주어진 markdown_content를 가진 파일을 저장합니다.

    :param posts_dir: 파일을 저장할 디렉터리 경로 (str)
    :param filename: 저장할 파일 이름 (str, 예: '2025-04-16-example.md')
    :param markdown_content: 마크다운 문자열 내용
    """
    os.makedirs(posts_dir, exist_ok=True)
    filepath = os.path.join(posts_dir, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(markdown_content)


if __name__ == "__main__":
  tex_root = "../../_tex"
  posts_root = "../../_posts"
  tex_files = find_all_tex_files(tex_root)
  print(tex_files)
  for tex_file in tex_files:
    file_path = Path(tex_file).resolve()
    root_path = Path(tex_root).resolve()
    relative_path = file_path.relative_to(root_path)

    tex = read_tex_files_content(tex_file)
    header = get_markdown_header(relative_path, tex)
    body = get_markdown_body(tex)
    markdown = header + "\n\n" + body

    filename = get_filename(relative_path, tex)
    write_markdown_file(posts_root, filename, markdown)
