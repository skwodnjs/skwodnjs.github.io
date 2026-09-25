function parseDate(value) {
    return new Date(
        String(value || "")
            .trim()
            .replace(/\s/g, "")
            .replace(/\./g, "-")
            .replace(/-$/, "")
    );
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function normalizeTags(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(v => String(v).trim()).filter(Boolean);
    return String(value).split(",").map(v => v.trim()).filter(Boolean);
}

function belongsToCategory(post, category) {
    const explicit = String(post.category || "").trim().toLowerCase();
    if (explicit) return explicit === category;

    const tags = normalizeTags(post.tags).map(tag => tag.toLowerCase());
    if (category === "mathematics") return tags.includes("mathematics");
    if (category === "research") return tags.includes("research");
    return false;
}

async function loadCategoryPosts() {
    const container = document.getElementById("category-posts");
    const count = document.getElementById("post-count");
    const category = document.body.dataset.category;

    if (!container || !category) return;

    try {
        const response = await fetch("/posts/posts.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load posts");

        const posts = (await response.json())
            .filter(post => belongsToCategory(post, category))
            .sort((a, b) => parseDate(b.date) - parseDate(a.date));

        if (count) count.textContent = posts.length ? String(posts.length) : "";

        if (!posts.length) {
            container.innerHTML = '<div class="empty-state">아직 작성된 글이 없습니다.</div>';
            return;
        }

        container.innerHTML = posts.map(post => {
            const tags = normalizeTags(post.tags)
                .filter(tag => tag.toLowerCase() !== category)
                .map(tag => `<span>${escapeHtml(tag)}</span>`)
                .join("");

            return `
                <article class="note-item">
                    <time class="note-date">${escapeHtml(post.date || "")}</time>
                    <div>
                        <a class="note-title" href="/post/?id=${encodeURIComponent(post.id)}">${escapeHtml(post.title || "Untitled")}</a>
                        <p class="note-description">${escapeHtml(post.description || "")}</p>
                        ${tags ? `<div class="note-tags">${tags}</div>` : ""}
                    </div>
                </article>
            `;
        }).join("");
    } catch (error) {
        container.innerHTML = '<div class="empty-state">글 목록을 불러오지 못했습니다.</div>';
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadCategoryPosts);