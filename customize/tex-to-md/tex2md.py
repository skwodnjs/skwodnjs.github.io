import re
from datetime import datetime

### ### ### ### ### ### PREPROCESS ### ### ### ### ### ### ###

def read_tex_files_content(tex_file):
  """
  file 형태의 .tex 파일을 string 형태로 반환한다.

  :param tex_file:
  :return: content (str)
  """
  content = ""
  with open(tex_file, 'r', encoding='utf-8') as f:
    for line in f:
      content += line
  return content

def extract_newcommands(tex):
  r"""
  string 형태의 tex 로부터 newcommand 또는 renewcommand 를 꺼내온다.
  허용된 명령어 이름: \foo, \bar, \(, \), \[, \]
  \newcommand, \renewcommand 는 무조건 한 줄에 있다고 가정한다.
  \newcommand, \renewcommand 뒤에 주석이 붙어도 안된다.

  :param tex:
  :return: commands[name] = (n_args, default, body)
  """
  commands = {}
  for line in tex.splitlines():
    line = line.strip()
    if not (line.startswith(r'\newcommand') or line.startswith(r'\renewcommand')):
      continue

    match = re.match(
      r'\\(?:re)?newcommand\s*\*?\s*\{\\([a-zA-Z@]+|\(|\)|\[|\])\}'  # 이름 조건
      r'(?:\[(\d+)\])?'     # [n] : 인자 수
      r'(?:\[(.*?)\])?'     # [default] : 선택 인자 기본값
      r'\{(.*)\}',          # {definition body}
      line
    )

    if match:
      name = '\\' + match.group(1)
      n_args = int(match.group(2)) if match.group(2) else 0
      default = match.group(3) if match.group(3) else None
      body = match.group(4).strip()
      commands[name] = (n_args, default, body)

  return commands

def extract_document(tex):
  r"""
  string 형태의 tex 로부터 document 부분만 꺼내온다.
  주석을 자동으로 제거한다. \%를 제외한 모든 %는 주석으로 간주한다.

  :param tex:
  :return: document
  """
  def clean_tex_lines(tex):
    lines = tex.splitlines()
    cleaned = []
    for line in lines:
      # \%는 살리고, 주석 제거
      line = re.sub(r'(?<!\\)%.*', '', line)
      cleaned.append(line.strip())

    return '\n'.join(cleaned)

  begin_tag = r'\begin{document}'
  end_tag = r'\end{document}'

  begin_index = tex.find(begin_tag)
  end_index = tex.find(end_tag)

  if begin_index == -1 or end_index == -1:
    return ""

  begin_index += len(begin_tag)
  content = tex[begin_index:end_index]
  return clean_tex_lines(content)

def extract_title(tex):
  """
  string 형태의 tex 로부터 title 을 꺼내온다.
  title은 본문에 정의되어 있어야 한다.

  :param tex:
  :return: title
  """
  document = extract_document(tex)
  matches = list(re.finditer(r'\\title\s*(?:\[[^\]]*\]\s*)?\{', document))
  if not matches:
    return None

  last_match = matches[-1]
  start = last_match.end()  # 여는 { 다음 위치
  brace_count = 1
  i = start
  while i < len(document) and brace_count > 0:
    if document[i] == '{':
      brace_count += 1
    elif document[i] == '}':
      brace_count -= 1
    i += 1

  return document[start:i - 1].strip() if brace_count == 0 else None

def apply_newcommands_to_document(document, commands):
  r"""
  커스텀 commands 로부터 document를 원상복귀시킨다.
  허용된 명령어 이름: \foo, \bar, \(, \), \[, \]
  명령어와 인자 전체를 치환하고, 인자 처리 후 남은 인자들은 버림.
  """

  def parse_brace_content(text, start):
    if text[start] != '{':
      return None, start
    depth = 1
    i = start + 1
    while i < len(text) and depth > 0:
      if text[i] == '{':
        depth += 1
      elif text[i] == '}':
        depth -= 1
      i += 1
    if depth == 0:
      return text[start+1:i-1], i
    else:
      return None, start

  i = 0
  result = ""
  while i < len(document):
    if document[i] == '\\':
      match = re.match(r'\\([a-zA-Z]+|\(|\)|\[|\])', document[i:])
      if match:
        name = match.group(1)
        full_cmd = '\\' + name
        if name in ('tags', 'subheading') or full_cmd not in commands:
          result += match.group(0)
          i += len(match.group(0))
          continue

        n_args, default, body = commands[full_cmd]
        i += len(match.group(0))
        args = []

        for _ in range(n_args):
          while i < len(document) and document[i].isspace():
            i += 1
          if i < len(document) and document[i] == '{':
            content, new_i = parse_brace_content(document, i)
            if content is None:
              break
            args.append(content)
            i = new_i
          else:
            break

        if len(args) == n_args - 1 and default is not None:
          args.insert(0, default)

        if len(args) == n_args:
          replaced = body
          for j, arg in enumerate(args):
            replaced = replaced.replace(f'#{j+1}', arg)
          result += replaced
        else:
          result += full_cmd  # fallback if 인자 부족
      else:
        result += document[i]
        i += 1
    else:
      result += document[i]
      i += 1

  return result

### ### ### ### ### ### MARKDOWN ### ### ### ### ### ### ###

def get_categories_from_path(relative_path):
  """
  relative_path 를 categories 형식에 맞게 변환한다.

  :param relative_path:
  :return: categories
  """
  categories = list(relative_path.parts[:-1])
  return '[' + ', '.join(categories) + ']'

def extract_date(tex):
  """
  string 형태의 tex 로부터 date 를 꺼내온다.
  시간은 코드를 실행한 시간으로 맞춘다.

  :param document:
  :return: date
  """
  document = extract_document(tex)
  matches = list(re.finditer(r'\\date\s*\{', document))
  if not matches:
    return None

  last_match = matches[-1]
  start = last_match.end()
  brace_count = 1
  i = start
  while i < len(document) and brace_count > 0:
    if document[i] == '{':
      brace_count += 1
    elif document[i] == '}':
      brace_count -= 1
    i += 1

  if brace_count != 0:
    return None

  # 현재 시간 기준으로 포맷
  now = datetime.now().astimezone()
  formatted = now.strftime("%Y-%m-%d %H:%M:%S %z")
  return formatted

def extract_tags(tex):
  """
  string 형태의 tex 로부터 tags 를 꺼내온다.
  tags는 본운에 \tags{ ... } 형태로 정의되어 있다고 가정한다.

  :param tex:
  :return: tags
  """
  document = extract_document(tex)
  match = re.search(r'\\tags\s*\{', document)
  if not match:
    return None

  start = match.end()  # 여는 { 다음 위치
  brace_count = 1
  i = start
  while i < len(document) and brace_count > 0:
    if document[i] == '{':
      brace_count += 1
    elif document[i] == '}':
      brace_count -= 1
    i += 1

  return "[" + document[start:i - 1].strip().replace('\n', ' ') + "]" if brace_count == 0 else None

def extract_author(tex):
  """
  string 형태의 tex 로부터 author 를 꺼내온다.
  \author{...} 의 마지막 항목을 가져오며, 없거나 비어 있으면 None을 반환한다.

  :param tex:
  :return: author (str) 또는 None
  """
  document = extract_document(tex)
  matches = list(re.finditer(r'\\author\s*\{', document))
  if not matches:
    return None

  last_match = matches[-1]
  start = last_match.end()
  brace_count = 1
  i = start
  while i < len(document) and brace_count > 0:
    if document[i] == '{':
      brace_count += 1
    elif document[i] == '}':
      brace_count -= 1
    i += 1

  content = document[start:i - 1].strip()
  return content if content else None

def get_markdown_header(relative_path, tex):
  title = extract_title(tex) or "Untitled"
  date = extract_date(tex) or datetime.now().astimezone().strftime("%Y-%m-%d %H:%M:%S %z")
  categories = get_categories_from_path(relative_path)
  tags = extract_tags(tex) or "[]"
  auther = extract_author(tex) or "skwodnjs"

  header = "---\n"
  header += f"title: {title}\n"
  header += f"date: {date}\n"
  header += f"categories: {categories}\n"
  header += f"tags: {tags}\n"
  header += f"author: {auther}\n"
  header += "math: true\n"
  header += "---"

  return header

def get_markdown_body(tex):
  r"""
  LaTeX 문서 본문을 Markdown 형식으로 변환한다.

  1. 메타 및 문서 구조 관련 LaTeX 명령어 제거
  2. \section → # ..., \subsection → ## ..., \subsubsection → ###
  3. equation, align 환경을 $$로 감싸기
  4. $...$ 내부의 | 와 \| 를 각각 \vert 와 \Vert 로 변환
  5. $...$ 내부의 _ 를 \_ 로 변환
  6. \begin{text-box} 정리하고 {: .text-box} 붙이기
  7. \subheading{...} → Markdown 스타일로 변환
  8. 줄 단위 공백 정리 및 연속 빈 줄 하나로 축소
  """

  document = extract_document(tex)
  command = extract_newcommands(tex)
  document = apply_newcommands_to_document(document, command)

  # 1. 메타 및 문서 구조 관련 LaTeX 명령어 제거
  document = re.sub(r'\\title(?:\[[^\]]*\])?\s*\{.*?\}', '', document)
  document = re.sub(r'\\author\s*\{.*?\}', '', document)
  document = re.sub(r'\\date\s*\{.*?\}', '', document)
  document = re.sub(r'\\thanks\s*\{.*?\}', '', document)
  document = re.sub(r'\\maketitle', '', document)
  document = re.sub(r'\\tags\s*\{.*?\}', '', document, flags=re.DOTALL)
  document = re.sub(r'\\tableofcontents', '', document)
  document = re.sub(r'\\documentclass\s*\{.*?\}', '', document)
  document = re.sub(r'\\usepackage\s*(\[[^\]]*\])?\s*\{.*?\}', '', document)
  document = re.sub(r'\\begin\{document\}', '', document)
  document = re.sub(r'\\end\{document\}', '', document)
  document = document.strip()

  # 2. \section → # ..., \subsection → ## ..., \subsubsection → ###
  document = re.sub(r'\\section\*?\{(.*?)\}', r'\n\n# \1\n\n', document)
  document = re.sub(r'\\subsection\*?\{(.*?)\}', r'\n\n## \1\n\n', document)
  document = re.sub(r'\\subsubsection\*?\{(.*?)\}', r'\n\n### \1\n\n', document)

  # 3. equation, align 환경을 $$로 감싸기
  def wrap_math_env(match):
    return f"\n\n$$\n{match.group(0)}\n$$\n\n"

  math_envs = ['equation', 'equation\\*', 'align', 'align\\*']
  for env in math_envs:
    pattern = re.compile(rf'\\begin\{{{env}\}}.*?\\end\{{{env}\}}', re.DOTALL)
    document = pattern.sub(wrap_math_env, document)

  # 4. $...$ 내부의 | 와 \| 를 각각 \vert 와 \Vert 로 변환
  def replace_bars(match):
    content = match.group(1)
    content = content.replace(r'\|', r'\Vert ')
    content = content.replace('|', r'\vert ')
    return f"${content}$"

  document = re.sub(r'\$(.*?)\$', replace_bars, document)

  # 5. $...$ 내부의 _ 를 \_ 로 변환
  def escape_underscore(match):
    content = match.group(1)
    content = content.replace('_', r'\_')
    return f"${content}$"

  document = re.sub(r'\$(.*?)\$', escape_underscore, document)

  # 6. \begin{text-box} 정리하고 {: .text-box} 붙이기
  def process_textbox(match):
    content = match.group(1)
    lines = [line.strip() for line in content.strip().splitlines() if line.strip()]
    processed = []

    in_math_block = False
    i = 0
    while i < len(lines):
        line = lines[i]

        # 수식 블록 토글
        if line == '$$':
            processed.append(line)
            in_math_block = not in_math_block

            # 수식이 끝났고 다음 줄이 평문이면 \\ 추가
            if not in_math_block:
                if i + 1 < len(lines):
                    next_line = lines[i + 1]
                    if next_line != '$$':  # 다음 줄이 또 $$이면 붙이지 않음
                        processed[-1] += r' \\'
            i += 1
            continue

        if in_math_block or i == len(lines) - 1:
            processed.append(line)
        else:
            if line.endswith(r'\\'):
                processed.append(line)
            else:
                processed.append(line + r' \\')
        i += 1

    return '\n'.join(processed) + '\n{: .text-box}'

  document = re.sub(
    r'\\begin\{text-box\}(.*?)\\end\{text-box\}',
    process_textbox,
    document,
    flags=re.DOTALL
  )

  # 7. \subheading{...} → Markdown 스타일로 변환
  document = re.sub(
    r'\\subheading\s*\{(.*?)\}',
    lambda m: f"{m.group(1).strip()}\n{{: .subheading}}",
    document,
    flags=re.DOTALL
  )

  # 8. 줄 단위 공백 정리 및 연속 빈 줄 하나로 축소
  lines = [line.strip() for line in document.splitlines()]
  cleaned = []
  blank = False
  for line in lines:
    if line == '':
      if not blank:
        cleaned.append('')
        blank = True
    else:
      cleaned.append(line)
      blank = False

  return '\n'.join(cleaned).strip()

def get_filename(relative_path, tex):
  """
  상대경로와 tex로부터 파일명을 생성한다.
  예: 2025-04-16-tlfgotjrgkr-week01.md

  :param relative_path: pathlib.Path 객체 (예: test-tex/test-tex-1/test.tex)
  :param tex: string 형태의 .tex 전체 내용
  :return: 파일명 (str)
  """

  # 한글을 두벌식 키보드 기준으로 영문 치환
  def hangul_to_keyboard_roman(text):
    table = {
      'ㄱ': 'r', 'ㄲ': 'R', 'ㄴ': 's', 'ㄷ': 'e', 'ㄸ': 'E',
      'ㄹ': 'f', 'ㅁ': 'a', 'ㅂ': 'q', 'ㅃ': 'Q', 'ㅅ': 't',
      'ㅆ': 'T', 'ㅇ': 'd', 'ㅈ': 'w', 'ㅉ': 'W', 'ㅊ': 'c',
      'ㅋ': 'z', 'ㅌ': 'x', 'ㅍ': 'v', 'ㅎ': 'g',
      'ㅏ': 'k', 'ㅐ': 'o', 'ㅑ': 'i', 'ㅒ': 'O', 'ㅓ': 'j',
      'ㅔ': 'p', 'ㅕ': 'u', 'ㅖ': 'P', 'ㅗ': 'h', 'ㅘ': 'hk',
      'ㅙ': 'ho', 'ㅚ': 'hl', 'ㅛ': 'y', 'ㅜ': 'n', 'ㅝ': 'nj',
      'ㅞ': 'np', 'ㅟ': 'nl', 'ㅠ': 'b', 'ㅡ': 'm', 'ㅢ': 'ml',
      'ㅣ': 'l'
    }

    import jamo
    result = []
    for ch in text:
      if '\uac00' <= ch <= '\ud7a3':  # 한글 음절이면
        j1 = jamo.j2hcj(jamo.h2j(ch))  # 자모 문자열로 (초중종 포함)
        for j in j1:
          result.append(table.get(j, ''))
      else:
        result.append(ch)
    return ''.join(result)

  # 날짜
  date = datetime.now().strftime("%Y-%m-%d")

  # 카테고리 경로를 한글 처리 포함해 정제
  categories = '-'.join(hangul_to_keyboard_roman(part) for part in relative_path.parts[:-1])

  # 제목
  title = extract_title(tex)
  if not title:
    title = 'untitled'
  else:
    title = hangul_to_keyboard_roman(title)
    title = title.strip().lower().replace(' ', '')
    title = re.sub(r'[^\w\-]', '-', title)

  filename = f"{date}-{categories}-{title}.md"
  return filename
