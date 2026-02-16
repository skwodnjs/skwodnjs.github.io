async function includeHTML(id, file) {
  const el = document.getElementById(id);
  const res = await fetch(file);
  const text = await res.text();
  el.innerHTML = text;
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML("footer", "/components/footer.html");
});

async function loadHeader(activeMenu) {
  const el = document.getElementById("header");
  const res = await fetch("/components/header.html");
  const text = await res.text();
  el.innerHTML = text;

  const activeEl = document.querySelector(
    `[data-menu="${activeMenu}"]`
  );

  if (activeEl) {
    activeEl.classList.add("active");
  }
}
