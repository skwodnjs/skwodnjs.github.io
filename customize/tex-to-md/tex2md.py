import re


def document_of_tex(tex):
  begin_tag = r'\begin{document}'
  end_tag = r'\end{document}'

  begin_index = tex.find(begin_tag)
  end_index = tex.find(end_tag)

  if begin_index == -1 or end_index == -1:
    return None

  begin_index += len(begin_tag)
  content = tex[begin_index:end_index]
  return strip_comments_and_flatten(content)

def strip_comments_and_flatten(tex):
    lines = tex.splitlines()
    cleaned = []
    for line in lines:
        # \%는 살리고, 주석만 제거
        line = re.sub(r'(?<!\\)%.*', '', line)
        if line.strip():
            cleaned.append(line.strip())
    return ' '.join(cleaned)

def get_title(tex_oneline):
    # tex는 strip_comments_and_flatten()으로 이미 한 줄로 처리된 문자열이라고 가정
    matches = list(re.finditer(r'\\title\s*(?:\[[^\]]*\]\s*)?\{', tex_oneline))
    if not matches:
      print("oh")
      return None

    last_match = matches[-1]
    start = last_match.end()  # 여는 { 다음 위치
    brace_count = 1
    i = start
    while i < len(tex_oneline) and brace_count > 0:
        if tex_oneline[i] == '{':
            brace_count += 1
        elif tex_oneline[i] == '}':
            brace_count -= 1
        i += 1

    return tex_oneline[start:i - 1].strip() if brace_count == 0 else None

