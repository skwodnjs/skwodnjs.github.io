function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "copy-toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 250);
    }, 1250);
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

function createPostCard(post, postsGrid) {
    const tags = normalizeTags(post.tags || post.tag);

    const tagsHtml = tags
        .map(tag => {
            const tagParams = new URLSearchParams(location.search);
            const currentTags = tagParams.getAll("tag");

            if (!currentTags.includes(tag)) {
                tagParams.append("tag", tag);
            }

            return `
                <a class="post-tag" href="?${tagParams.toString()}">
                    ${tag}
                </a>
            `;
        })
        .join("");

    const article = document.createElement("article");
    article.className = "post-item";

    article.innerHTML = `
        <div class="post-meta">
            ${tagsHtml}
            <div class="post-date">${post.date || ""}</div>
        </div>

        <div class="post-title" data-id="${post.id}">
            ${post.title || "Untitled"}
        </div>

        <div class="post-description">
            ${post.description || ""}
        </div>

        <a href="../post/?id=${post.id}">
            <button class="read-btn">
                글 읽기
            </button>
        </a>
    `;

    const title = article.querySelector(".post-title");

    title.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(post.id);
            showToast("ID가 복사되었습니다.");
        } catch (error) {
            console.error("클립보드 복사 실패:", error);
            showToast("ID 복사에 실패했습니다.");
        }
    });

    postsGrid.appendChild(article);
}

async function loadSaveMetaLogs(postsGrid) {
    for (let i = 1; i <= 100; i++) {
        const filename = `save-${i}.md`;

        const res = await fetch(`/post/save/${filename}`, {
            cache: "no-store"
        });

        if (!res.ok) {
            break;
        }

        const raw = await res.text();
        const { meta } = parseFrontMatter(raw);

        createPostCard({
            id: `save-${i}`,
            title: meta.title || filename,
            description: meta.description || "",
            date: meta.date || "",
            tags: meta.tags || meta.tag || ["save"]
        }, postsGrid);
    }
}

async function loadPosts() {
    const postsGrid = document.getElementById("posts-grid");

    if (!postsGrid) {
        console.error("posts-grid 요소를 찾을 수 없습니다.");
        return;
    }

    try {
        const response = await fetch("/posts/posts.json");
        let posts = await response.json();

        const params = new URLSearchParams(location.search);
        const selectedTags = params.getAll("tag");

        const miniTitle = document.getElementById("mini-title");

        if (miniTitle && selectedTags.length > 0) {
            const parent = miniTitle.parentElement;
            const postsTitle = parent.querySelector(".posts-title");

            miniTitle.remove();

            selectedTags.forEach(tag => {
                const tagTitle = document.createElement("div");
                tagTitle.className = "mini-title";
                tagTitle.textContent = tag;

                parent.insertBefore(tagTitle, postsTitle);
            });
        }

        postsGrid.innerHTML = "";

        if (selectedTags.length === 1 && selectedTags[0] === "save") {
            await loadSaveMetaLogs(postsGrid);
            return;
        }

        if (selectedTags.length > 0) {
            posts = posts.filter(post =>
                selectedTags.every(tag => normalizeTags(post.tags).includes(tag))
            );
        }

        posts.sort((a, b) => {
            const dateA = new Date(
                a.date.replace(/\./g, "-").replace(/-$/, "")
            );

            const dateB = new Date(
                b.date.replace(/\./g, "-").replace(/-$/, "")
            );

            return dateB - dateA;
        });

        posts.forEach(post => {
            createPostCard(post, postsGrid);
        });

    } catch (error) {
        console.error("posts.json 로드 실패:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadPosts);