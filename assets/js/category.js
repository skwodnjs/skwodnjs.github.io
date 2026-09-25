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

async function loadCategoryPosts() {
    const container = document.getElementById("category-posts");
    const count = document.getElementById("post-count");
    const category = String(document.body.dataset.category || "").toLowerCase();

    if (!container || !category) return;

    try {
        const response = await fetch("/data/posts.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load posts");

        const posts = (await response.json())
            .filter(post => String(post.category || "").toLowerCase() === category)
            .sort((a, b) => parseDate(b.date) - parseDate(a.date));

        if (count) count.textContent = posts.length ? String(posts.length) : "";

        if (!posts.length) {
            container.innerHTML = '<div class="empty-state">아직 작성된 글이 없습니다.</div>';
            return;
        }

        container.innerHTML = posts.map(post => `
            <article class="note-item">
                <time class="note-date">${escapeHtml(post.date || "")}</time>
                <div>
                    <a class="note-title" href="/post/?id=${encodeURIComponent(post.id)}">${escapeHtml(post.title || "Untitled")}</a>
                    <p class="note-description">${escapeHtml(post.description || "")}</p>
                </div>
            </article>
        `).join("");
    } catch (error) {
        container.innerHTML = '<div class="empty-state">글 목록을 불러오지 못했습니다.</div>';
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", loadCategoryPosts);
