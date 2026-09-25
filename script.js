async function loadRecentPosts() {
    const container = document.getElementById("post-list");
    if (!container) return;
    try {
        const response = await fetch("/posts/posts.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load posts");
        const posts = await response.json();
        const recent = posts.slice().sort((a, b) => parseDate(b.date) - parseDate(a.date)).slice(0, 5);
        if (!recent.length) {
            container.innerHTML = '<div class="empty">아직 작성된 글이 없습니다.</div>';
            return;
        }
        container.innerHTML = recent.map(post => `<article class="post-item"><div><a class="post-title" href="/post/?id=${encodeURIComponent(post.id)}">${escapeHtml(post.title || "Untitled")}</a><p class="post-description">${escapeHtml(post.description || "")}</p></div><time class="post-date">${escapeHtml(post.date || "")}</time></article>`).join("");
    } catch (error) {
        container.innerHTML = '<div class="empty">글 목록을 불러오지 못했습니다.</div>';
        console.error(error);
    }
}
function parseDate(value) { return new Date(String(value || "").trim().replace(/\s/g, "").replace(/\./g, "-").replace(/-$/, "")); }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
document.addEventListener("DOMContentLoaded", loadRecentPosts);