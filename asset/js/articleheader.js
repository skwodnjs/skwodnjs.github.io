document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header .article-header');
    if (!header) return;

    const randomIndex = Math.floor(Math.random() * 14) + 1;
    const imageUrl = `../asset/img/article header/article header (${randomIndex}).jpg`;

    header.style.backgroundImage = `url("${imageUrl}")`;
});