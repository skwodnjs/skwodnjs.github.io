async function loadPostLinks() {
  const main = document.querySelector("main");

  if (!main) return;

  try {
    const res = await fetch("/assets/json/posts.json");
    const posts = await res.json();

    posts.forEach(post => {
      const a = document.createElement("a");

      a.href = `/post/?id=${post.id}`;
      a.textContent = post.title || post.id;

      main.appendChild(a);
      main.appendChild(document.createElement("br"));
    });

  } catch (err) {
    console.error("posts.json 로드 실패:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadPostLinks);
