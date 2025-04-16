import os
from pathlib import Path

from tex2md import *

def find_all_tex_files(root_dir):
  tex_files = []
  for path in Path(root_dir).rglob("*.tex"):
    if path.is_file():
      tex_files.append(path)
  return tex_files

def write_markdown_file(posts_dir, filename, markdown):
  """
  posts 디렉토리에 마크다운 파일을 저장한다.
  """
  import os
  from pathlib import Path

  path = Path(posts_dir) / filename
  os.makedirs(path.parent, exist_ok=True)
  with open(path, 'w', encoding='utf-8') as f:
    f.write(markdown)

  print(f"[✓] 변환 완료 → {filename}")

if __name__ == "__main__":
  tex_root = "../../_tex"
  posts_root = "../../_posts"
  tex_files = find_all_tex_files(tex_root)
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
