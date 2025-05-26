document.querySelectorAll('.title-article').forEach(el => {
    el.setAttribute('title', el.textContent.trim());
});
