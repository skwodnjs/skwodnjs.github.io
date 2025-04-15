from pathlib import Path

def find_all_tex_files(root_dir):
  tex_files = []
  for path in Path(root_dir).rglob("*.tex"):
    if path.is_file():
      tex_files.append(path)
  return tex_files


def read_tex_files_content(tex_file):
  content = ""
  with open(tex_file, 'r', encoding='utf-8') as f:
    for line in f:
      content += line
  return content


if __name__ == "__main__":
  root = "test-tex"
  tex_files = find_all_tex_files(root)
  print(tex_files)
  for tex_file in tex_files:
    print(read_tex_files_content(tex_file))
