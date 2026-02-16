// /assets/js/category.js
// 기능:
// 1) /category?id=3  -> /post/3.md fetch
// 2) frontmatter에서 title/categories/date/author 추출 -> #post-title, #post-category, #post-date에 삽입
// 3) frontmatter 제외한 본문 md -> HTML 변환
//
// 필요:
// - 아래 CDN을 /category 페이지에 추가해야 함
//   <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
//
// HTML 구조(필수):
// <main class="post">
//   <div id="post-title"></div>
//   <div id="post-category"></div>
//   <div id="post-date"></div>
//   <div id="post-content"></div>
// </main>

(function () {
  function getParam(name) {
    const url = new URL(location.href);
    const v = url.searchParams.get(name);
    if (v) return v;

    if (url.hash && url.hash.length > 1) {
      const hash = url.hash.slice(1);
      const params = new URLSearchParams(hash.startsWith("?") ? hash.slice(1) : hash);
      return params.get(name);
    }
    return null;
  }

  function safeId(id) {
    const v = String(id ?? "").trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(v)) return null;
    return v;
  }

  function parseFrontMatter(md) {
    const text = String(md).replace(/^\uFEFF/, "");
    if (!text.startsWith("---")) return { meta: {}, content: text };

    const lines = text.split("\n");
    let end = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "---") {
        end = i;
        break;
      }
    }
    const raw = lines.slice(1, end).join("\n");
    const content = lines.slice(end + 1).join("\n").replace(/^\s+/, "");

    const meta = {};
    raw.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;

      const idx = trimmed.indexOf(":");
      if (idx === -1) return;

      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();

      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }

      if (val.startsWith("[") && val.endsWith("]")) {
        const inner = val.slice(1, -1).trim();
        meta[key] = inner
          ? inner.split(",").map((x) => x.trim()).filter(Boolean)
          : [];
        return;
      }

      meta[key] = val;
    });

    return { meta, content };
  }

  function normalizeDate(s) {
    return String(s || "").trim();
  }

  function normalizeCategories(cats) {
    if (!cats) return [];
    if (Array.isArray(cats)) return cats.map((x) => String(x).trim()).filter(Boolean);
    const s = String(cats).trim();
    if (!s) return [];
    return s.split(",").map((x) => x.trim()).filter(Boolean);
  }

  function fixInternalLinks(container) {
    container.querySelectorAll('a[href^="?id="]').forEach((a) => {
      const href = a.getAttribute("href");
      a.setAttribute("href", `/category${href}`);
    });
  }

  function addCodeLanguageLabels(container) {
    container.querySelectorAll("pre code").forEach(code => {
      const classes = Array.from(code.classList);
      const langClass = classes.find(c => c.startsWith("language-"));
      if (!langClass) return;

      const lang = langClass.replace("language-", "");
      code.parentElement.setAttribute("data-lang", lang);
    });
  }

  async function loadPostById() {
    const id = safeId(getParam("id"));
    if (!id) return;

    const url = `/post/${encodeURIComponent(id)}.md`;

    const res = await fetch(url, { cache: "no-store" });
    const raw = await res.text();

    const { meta, content } = parseFrontMatter(raw);

    // title
    document.getElementById("post-title").textContent = meta.title || "Untitled";

    // category
    const cats = normalizeCategories(meta.categories);
    const catEl = document.getElementById("post-category");
    catEl.textContent = cats.length ? cats.join(" / ") : "";

    // date + author
    const date = normalizeDate(meta.date);
    const author = (meta.author || "").trim();
    document.getElementById("post-date").textContent =
      author ? `${date} by ${author}` : date;

    // content
    const html = window.marked.parse(content);
    const contentEl = document.getElementById("post-content");
    contentEl.innerHTML = html;
    fixInternalLinks(contentEl);

    addCodeLanguageLabels(contentEl);
    hljs.highlightAll();
    if (window.MathJax){ MathJax.typesetPromise([contentEl]); }

    if (meta.title) document.title = `${meta.title} - JWN's Blog`;
  }

  window.addEventListener("DOMContentLoaded", loadPostById);
  window.addEventListener("hashchange", loadPostById);
})();
