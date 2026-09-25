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

            meta[key] = value;
        });

        return { meta, content };
    }

    function categoryInfo(value) {
        const category = String(value || "").trim().toLowerCase();

        if (category === "mathematics") {
            return { label: "Mathematics", href: "/mathematics/" };
        }

        if (category === "research") {
            return { label: "Research", href: "/research/" };
        }

        return null;
    }

    function pageInfo(meta) {
        const label = document.body.dataset.metaLabel;
        const href = document.body.dataset.metaHref;

        if (label && href) {
            return { label, href };
        }

        return categoryInfo(meta.category);
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

            if (parent.tagName === "P" && parent.childNodes.length === 0) {
                parent.remove();
            }
        });
    }

    function prepareContent(container) {
        addCodeLanguageLabels(container);
        wrapTables(container);
        wrapImages(container);
    }

    function makeBackLink(info) {
        const href = info?.href || "/";
        const label = info ? `${info.label}로 돌아가기` : "Home으로 돌아가기";

        return `
            <a href="${href}">
                <button class="back-btn">${label}</button>
            </a>
        `;
    }

    function renderNotFound() {
        const postTitle = document.querySelector(".post-title");
        const postCategory = document.querySelector(".post-category");
        const postDate = document.querySelector(".post-date");
        const postContent = document.querySelector(".post-content");

        if (postTitle) postTitle.textContent = "글을 찾을 수 없습니다";
        if (postCategory) postCategory.innerHTML = "";
        if (postDate) postDate.textContent = "";

        if (postContent) {
            postContent.innerHTML = `
                <p>요청한 게시글이 존재하지 않거나, Markdown 파일을 불러오지 못했습니다.</p>
                ${makeBackLink(null)}
            `;
        }

        document.title = "글을 찾을 수 없습니다";
    }

    async function loadPost() {
        const source = document.body.dataset.source || "";
        const id = source ? null : safeId(getParam("id"));

        if (!source && !id) {
            renderNotFound();
            return;
        }

        const postTitle = document.querySelector(".post-title");
        const postCategory = document.querySelector(".post-category");
        const postDate = document.querySelector(".post-date");
        const postContent = document.querySelector(".post-content");

        if (!postContent) return;

        try {
            const url = source || `/post/articles/${id}.md`;
            const res = await fetch(url, {
                cache: "no-store"
            });

            if (!res.ok) {
                renderNotFound();
                return;
            }

            const raw = await res.text();
            const { meta, content } = parseFrontMatter(raw);
            const info = pageInfo(meta);

            if (postTitle) {
                postTitle.textContent = meta.title || "Untitled";
            }

            if (postCategory) {
                postCategory.innerHTML = info
                    ? `<a class="post-category-link" href="${info.href}">${info.label}</a>`
                    : "";
            }

            if (postDate) {
                postDate.textContent = meta.date || "";
            }

            const { replaced, mathBlocks } = protectMath(content);

            let rendered = window.marked
                ? marked.parse(replaced)
                : replaced;

            rendered = restoreMath(rendered, mathBlocks);

            postContent.innerHTML = `
                ${rendered}
                ${makeBackLink(info)}
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
                document.title = `${meta.title} | JWN`;
            }
        } catch (error) {
            console.error(error);
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