let allPosts = [];
let categoryData = [];

Promise.all([
  fetch('https://raw.githubusercontent.com/skwodnjs/skwodnjs.github.io/main/_data/articles.json').then(r => r.json()),
  fetch('https://raw.githubusercontent.com/skwodnjs/skwodnjs.github.io/main/_data/category.yml').then(r => r.text()).then(yamlText => jsyaml.load(yamlText))
])
.then(([posts, categories]) => {
  allPosts = posts;
  categoryData = categories;

  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);
})
.catch(error => {
  console.error('데이터 로딩 오류:', error);
});

function handleHashChange() {
  const hash = decodeURIComponent(location.hash.replace('#', ''));
  const titleLabel = document.querySelector('.title-search .archives');
  const countLabel = document.querySelector('.title-search span');
  const areaMain = document.querySelector('.area-main');

  if (titleLabel && countLabel) {
    if (!hash || hash === '전체 글') {
      titleLabel.textContent = '전체 글';
      countLabel.textContent = allPosts.length;
    } else {
      let found = false;

      for (const cat of categoryData) {
        if (cat.name === hash) {
          titleLabel.textContent = cat.name;
          countLabel.textContent = allPosts.filter(p => p.category === cat.name || p.category.startsWith(cat.name + '/')).length;
          found = true;
          break;
        }
        if (cat.children) {
          for (const sub of cat.children) {
            const full = `${cat.name}/${sub.name}`;
            if (full === hash) {
              titleLabel.textContent = full;
              countLabel.textContent = allPosts.filter(p => p.category === full).length;
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (!found) {
        titleLabel.textContent = hash;
        countLabel.textContent = allPosts.filter(p => p.category === hash || p.category.startsWith(hash + '/')).length;
      }
    }
  }

  if (!areaMain) return;
  areaMain.querySelectorAll('.article').forEach(el => el.remove());

  const visiblePosts = (!hash || hash === '전체 글')
    ? allPosts
    : allPosts.filter(post => {
        return post.category === hash || post.category.startsWith(hash + '/');
      });

  visiblePosts.forEach(post => {
    const article = document.createElement('article');
    article.className = 'article';

    article.innerHTML = `
      <a href="${post.link}" class="link-article">
        <strong class="title">${post.title}</strong>
        <p class="summary">${post.summary}</p>
      </a>
      <div class="box-meta">
        <a href="#${encodeURIComponent(post.category)}" class="category">${post.category}</a>
        <span class="date">${post.date}</span>
      </div>
    `;

    areaMain.appendChild(article);
  });
}
