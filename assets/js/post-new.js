// /assets/js/post-new.js

(function () {

    function getParam(name) {
        const url = new URL(location.href);
        return url.searchParams.get(name);
    }

    function safeId(id) {
        const v = String(id ?? "").trim();
        if (!/^[a-zA-Z0-9_-]+$/.test(v)) return null;
        return v;
    }

    function parseFrontMatter(md) {
        const text = String(md).replace(/^\uFEFF/, "");

        if (!text.startsWith("---")) {
            return { meta: {}, content: text };
        }

        const lines = text.split("\n");
        let end = -1;

        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === "---") {
                end = i;
                break;
            }
        }

        if (end === -1) {
            return { meta: {}, content: text };
        }

        const rawMeta = lines.slice(1, end).join("\n");
        const content = lines.slice(end + 1).join("\n").replace(/^\s+/, "");

        const meta = {};

        rawMeta.split("\n").forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) return;

            const idx = trimmed.indexOf(":");
            if (idx === -1) return;

            const key = trimmed.slice(0, idx).trim();
            let value = trimmed.slice(idx + 1).trim();

            if (
                (value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))
            ) {
                value = value.slice(1, -1);
            }

            if (value.startsWith("[") && value.endsWith("]")) {
                const inner = value.slice(1, -1).trim();
                meta[key] = inner
                    ? inner.split(",").map(v => v.trim()).filter(Boolean)
                    : [];
                return;
            }

            meta[key] = value;
        });

        return { meta, content };
    }

    function normalizeCategories(categories) {
        if (!categories) return "";

        if (Array.isArray(categories)) {
            return categories.map(v => String(v).trim()).filter(Boolean).join(", ");
        }

        return String(categories).trim();
    }

    function fixInternalLinks(container) {
        container.querySelectorAll('a[href^="?id="]').forEach(a => {
            const href = a.getAttribute("href");
            a.setAttribute("href", `/post/${href}`);
        });
    }

    async function loadPost() {
        const id = safeId(getParam("id"));
        if (!id) return;

        const postTitle = document.querySelector(".post-title");
        const postCategory = document.querySelector(".post-category");
        const postAuthor = document.querySelector(".post-auther");
        const postDate = document.querySelector(".post-date");
        const postContents = document.querySelector(".post-contents");

        try {
            const res = await fetch(`/post/${id}.md`, {
                cache: "no-store"
            });

            if (!res.ok) throw new Error("404");

            const raw = await res.text();
            const { meta, content } = parseFrontMatter(raw);

            postTitle.textContent = meta.title || "Untitled";
            postCategory.textContent = normalizeCategories(meta.categories);
            postAuthor.textContent = meta.author || "";
            postDate.textContent = meta.date || "";

            postContents.innerHTML = window.marked
                ? marked.parse(content)
                : content;

            fixInternalLinks(postContents);

            if (window.hljs) hljs.highlightAll();

            if (window.MathJax) {
                if (MathJax.typesetPromise) {
                    MathJax.typesetPromise([postContents]);
                } else if (MathJax.typeset) {
                    MathJax.typeset([postContents]);
                }
            }

            if (meta.title) {
                document.title = `${meta.title} : JWN's Blog`;
            }

        } catch (e) {
            console.error(e);

            postTitle.textContent = "404 Not Found";
            postCategory.textContent = "";
            postAuthor.textContent = "";
            postDate.textContent = "";
            postContents.innerHTML = "<p>게시글을 불러올 수 없습니다.</p>";
        }
    }

    window.addEventListener("DOMContentLoaded", loadPost);
})();