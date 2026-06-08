// /assets/js/post.js

(function () {
    function getParam(name) {
        return new URL(location.href).searchParams.get(name);
    }

    function safeId(id) {
        const v = String(id ?? "").trim();
        return /^[a-zA-Z0-9_-]+$/.test(v) ? v : null;
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

    function normalizeTags(value) {
        if (!value) return [];

        if (Array.isArray(value)) {
            return value.map(v => String(v).trim()).filter(Boolean);
        }

        return String(value)
            .split(",")
            .map(v => v.trim())
            .filter(Boolean);
    }

    function escapeHtml(str) {
        return String(str)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function protectMath(md) {
        const mathBlocks = [];

        const replaced = md.replace(
            /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]+\$)/g,
            match => {
                const key = `@@MATH_BLOCK_${mathBlocks.length}@@`;
                mathBlocks.push(match);
                return key;
            }
        );

        return { replaced, mathBlocks };
    }

    function restoreMath(html, mathBlocks) {
        return html.replace(/@@MATH_BLOCK_(\d+)@@/g, (_, i) => {
            return mathBlocks[Number(i)] ?? "";
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

    function wrapTables(container) {
        container.querySelectorAll("table").forEach(table => {
            if (table.parentElement?.classList.contains("table-wrapper")) return;

            const wrapper = document.createElement("div");
            wrapper.className = "table-wrapper";

            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        });
    }

    function wrapImages(container) {
        container.querySelectorAll("img").forEach(img => {
            if (img.closest(".image-wrapper")) return;
            if (img.closest("mjx-container")) return;

            const wrapper = document.createElement("div");
            wrapper.className = "image-wrapper";

            const parent = img.parentNode;

            parent.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            if (
                parent.tagName === "P" &&
                parent.childNodes.length === 0
            ) {
                parent.remove();
            }
        });
    }

    function prepareContent(container) {
        addCodeLanguageLabels(container);
        wrapTables(container);
        wrapImages(container);
    }

    function renderNotFound() {
        const postTitle = document.querySelector(".post-title");
        const postTags = document.querySelector(".post-tags");
        const postDate = document.querySelector(".post-date");
        const postContent = document.querySelector(".post-content");

        if (postTitle) postTitle.textContent = "글을 찾을 수 없습니다";
        if (postTags) postTags.innerHTML = "";
        if (postDate) postDate.textContent = "";

        if (postContent) {
            postContent.innerHTML = `
                <p>요청한 게시글이 존재하지 않거나, Markdown 파일을 불러오지 못했습니다.</p>

                <a href="/posts">
                    <button class="back-btn">
                        전체 글로 돌아가기
                    </button>
                </a>
            `;
        }

        document.title = "글을 찾을 수 없습니다";
    }

    async function loadPost() {
        const id = safeId(getParam("id"));

        if (!id) {
            renderNotFound();
            return;
        }

        const postTitle = document.querySelector(".post-title");
        const postTags = document.querySelector(".post-tags");
        const postDate = document.querySelector(".post-date");
        const postContent = document.querySelector(".post-content");

        if (!postContent) {
            console.error(".post-content element not found");
            return;
        }

        try {
            const folder = /^save-\d+$/.test(id)
                ? "save"
                : "articles";

            const res = await fetch(`/post/${folder}/${id}.md`, {
                cache: "no-store"
            });

            if (!res.ok) {
                renderNotFound();
                return;
            }

            const raw = await res.text();
            const { meta, content } = parseFrontMatter(raw);

            if (postTitle) {
                postTitle.textContent = meta.title || "Untitled";
            }

            if (postTags) {
                const tags = normalizeTags(meta.tags || meta.tag);

                postTags.innerHTML = tags
                    .map(tag => `
                        <a
                            class="post-tag"
                            href="/posts/?tag=${encodeURIComponent(tag)}"
                        >
                            ${escapeHtml(tag)}
                        </a>
                    `)
                    .join('<span class="tag-separator">·</span>');
            }

            if (postDate) {
                postDate.textContent = meta.date || "";
            }

            const { replaced, mathBlocks } = protectMath(content);

            let html = window.marked
                ? marked.parse(replaced)
                : replaced;

            html = restoreMath(html, mathBlocks);

            postContent.innerHTML = `
                ${html}

                <a href="/posts">
                    <button class="back-btn">
                        전체 글로 돌아가기
                    </button>
                </a>
            `;

            prepareContent(postContent);

            if (window.hljs) {
                hljs.highlightAll();
            }

            if (window.MathJax) {
                if (MathJax.typesetPromise) {
                    MathJax.typesetPromise([postContent]);
                } else if (MathJax.typeset) {
                    MathJax.typeset([postContent]);
                }
            }

            if (meta.title) {
                document.title = meta.title;
            }

        } catch (e) {
            console.error(e);
            renderNotFound();
        }
    }

    window.addEventListener("DOMContentLoaded", loadPost);

    const scrollBottomBtn = document.querySelector(".scroll-bottom-btn");

    scrollBottomBtn?.addEventListener("click", () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", () => {
        const remain =
            document.documentElement.scrollHeight -
            window.innerHeight -
            window.scrollY;

        scrollBottomBtn?.classList.toggle("hidden", remain < 200);
    });
})();