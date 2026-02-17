function joinPath(path, slug) {
  if (!slug) return path || "";
  return path ? `${path}/${slug}` : slug;
}

function createCategoryList(obj, path = "") {
  const ul = document.createElement("ul");

  for (const key in obj) {
    if (key === "_meta") continue;

    const node = obj[key] || {};
    const meta = node._meta || {};

    const slug = meta.slug || key;
    const count = meta.count ?? 0;

    const fullPath = joinPath(path, slug);

    const li = document.createElement("li");
    li.classList.add("category-item", `cat-${slug}`);

    const a = document.createElement("a");

    a.href = `/category#${fullPath}`;

    a.textContent = `${key} (${count})`;
    a.classList.add("category-link", `cat-${slug}`);
    a.dataset.slug = slug;
    a.dataset.path = fullPath;

    li.appendChild(a);

    const childKeys = Object.keys(node).filter(k => k !== "_meta");
    if (childKeys.length > 0) {
      li.appendChild(createCategoryList(node, fullPath));
    }

    ul.appendChild(li);
  }

  return ul;
}

fetch("/assets/json/categories.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("category-list");
    container.innerHTML = "";
    container.appendChild(createCategoryList(data));
  })
  .catch(err => console.error("카테고리 로드 실패:", err));
