async function loadRecentData() {
    const tagContainer = document.getElementById("tag-list");
    const postsContainer = document.getElementById("post-list");

    try {
        const response = await fetch("/posts/posts.json", {
            cache: "no-store"
        });

        const posts = await response.json();

        const sortedPosts = posts
            .slice()
            .sort((a, b) => parseDate(b.date) - parseDate(a.date));

        /* =========================
           최근 태그 8개
           ========================= */

        if (tagContainer) {
            const recentTags = sortedPosts
                .flatMap(post => normalizeTags(post.tags || post.tag))
                .filter(unique())
                .slice(0, 8);

            tagContainer.innerHTML = recentTags
                .map(tag => `
                    <a
                        class="recent-tag"
                        href="/posts/?tag=${encodeURIComponent(tag)}"
                    >
                        ${escapeHtml(tag)}
                    </a>
                `)
                .join("");
        }

        /* =========================
           최근 글 3개
           ========================= */

        if (postsContainer) {
            postsContainer.innerHTML = sortedPosts
                .slice(0, 3)
                .map(post => {
                    const tags = normalizeTags(post.tags || post.tag);

                    return `
                        <article class="post-item">

                            <div class="post-tags">
                                ${tags
                                    .map(tag => `
                                        <span>
                                            ${escapeHtml(tag)}
                                        </span>
                                    `)
                                    .join("")}
                            </div>

                            <h3>
                                <a
                                    class="post-link"
                                    href="/post/?id=${encodeURIComponent(post.id)}"
                                >
                                    ${escapeHtml(post.title)}
                                </a>
                            </h3>

                            <p>
                                ${escapeHtml(post.description || "")}
                            </p>

                        </article>
                    `;
                })
                .join("");
        }

    } catch (error) {
        console.error("최근 데이터 로드 실패:", error);
    }
}

function parseDate(value) {
    return new Date(
        String(value)
            .trim()
            .replace(/\s/g, "")
            .replace(/\./g, "-")
            .replace(/-$/, "")
    );
}

function normalizeTags(value) {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value
            .map(v => String(v).trim())
            .filter(Boolean);
    }

    return String(value)
        .split(",")
        .map(v => v.trim())
        .filter(Boolean);
}

function unique() {
    const seen = new Set();

    return value => {
        if (seen.has(value)) return false;

        seen.add(value);
        return true;
    };
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", loadRecentData);