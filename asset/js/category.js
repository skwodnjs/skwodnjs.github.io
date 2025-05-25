fetch('https://raw.githubusercontent.com/skwodnjs/skwodnjs.github.io/main/_data/category.yml')
  .then(response => response.text())
  .then(yamlText => {
    const data = jsyaml.load(yamlText);
    renderCategoryList(data);
  })
  .catch(error => {
    console.error('카테고리 로딩 오류:', error);
  });

function renderCategoryList(data) {
  const categoryList = document.querySelector('.tt_category > li > ul');
  if (!categoryList) return;

  data.forEach(category => {
    const li = document.createElement('li');

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'link_item';
    a.innerHTML = `${category.name} <span class="c_cnt">(${category.count})</span>`;
    a.addEventListener('click', e => {
      e.preventDefault();
      window.location.href = `#${encodeURIComponent(category.name)}`;
    });
    li.appendChild(a);

    if (category.children && category.children.length > 0) {
      const subUl = document.createElement('ul');

      category.children.forEach(sub => {
        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.href = '#';
        subA.className = 'link-sub-item';
        subA.innerHTML = `${sub.name} <span class="c_cnt">(${sub.count})</span>`;
        subA.addEventListener('click', e => {
          e.preventDefault();
          const fullPath = `${category.name}/${sub.name}`;
          window.location.hash = encodeURIComponent(fullPath);
        });
        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });

      li.appendChild(subUl);
    }

    categoryList.appendChild(li);
  });
}