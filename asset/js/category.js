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
    a.href = `./#${encodeURIComponent(category.name)}`;
    a.className = 'link_item';
    a.innerHTML = `${category.name} <span class="c_cnt">(${category.count})</span>`;
    li.appendChild(a);

    if (category.children && category.children.length > 0) {
      const subUl = document.createElement('ul');

      category.children.forEach(sub => {
        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        const fullPath = `${category.name}/${sub.name}`;
        subA.href = `./#${encodeURIComponent(fullPath)}`;
        subA.className = 'link-sub-item';
        subA.innerHTML = `${sub.name} <span class="c_cnt">(${sub.count})</span>`;
        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });

      li.appendChild(subUl);
    }

    categoryList.appendChild(li);
  });
}
