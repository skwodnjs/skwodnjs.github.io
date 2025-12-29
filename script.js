// 데이터를 저장할 변수
let allPosts = [];

// 1. JSON 데이터 불러오기
async function loadPosts() {
    try {
        const response = await fetch('./assets/posts.json');
        if (!response.ok) throw new Error("JSON 파일을 찾을 수 없습니다.");
        allPosts = await response.json();
        
        handleCategory(); // 데이터 로드 후 카테고리 로직 실행
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }
}

// 2. 화면에 포스트 목록 그리기
function renderPosts(filterCategory = null) {
    const main = document.querySelector('main');
    
    // 1. 기존에 표시되던 포스트들과 "글이 없습니다" 메시지를 모두 삭제
    // .post-link(포스트)와 .no-post(메시지)를 선택해서 지웁니다.
    const oldPosts = main.querySelectorAll('.post-link, .no-post');
    oldPosts.forEach(p => p.remove());

    // 2. 필터링 로직
    const filtered = filterCategory 
        ? allPosts.filter(post => post.categories.includes(filterCategory))
        : allPosts;

    // 3. 글이 없을 경우 메시지 출력 (한 번만 나타남)
    if (filtered.length === 0) {
        main.insertAdjacentHTML('beforeend', '<p class="no-post" style="padding:20px;">해당 카테고리에 글이 없습니다.</p>');
        return;
    }

    // 4. 필터링된 글 목록 추가
    filtered.forEach(post => {
        const postHTML = `
            <a href="${post.url}" class="post-link">
                <article class="post">
                    <div class="post-title">${post.title}</div>
                    <div class="post-meta">
                        <span class="post-category">${post.categories.join(' / ')}</span>
                        <span class="post-div">·</span>
                        <span class="post-date">${post.date}</span>
                    </div>
                    <div class="preview">${post.preview}...</div>
                </article>
            </a>
        `;
        main.insertAdjacentHTML('beforeend', postHTML);
    });
}

// 3. 해시(#) 변경에 따른 화면 제어
function handleCategory() {
    const profile = document.querySelector('.profile');
    const divider = document.querySelector('.divider');
    const current_category = document.querySelector('.current-category');

    if (location.hash.startsWith('#category=')) {
        const category = decodeURIComponent(location.hash.replace('#category=', ''));

        if (profile) profile.style.display = 'none';
        if (divider) divider.style.display = 'none';
        if (current_category) {
            current_category.style.display = '';
            current_category.textContent = category;
        }
        renderPosts(category);
    } else {
        if (profile) profile.style.display = '';
        if (divider) divider.style.display = '';
        if (current_category) current_category.style.display = 'none';
        renderPosts();
    }
}

// 메뉴 클릭 이벤트
document.querySelectorAll('.menu').forEach(el => {
    el.addEventListener('click', () => {
        const category = el.dataset.category;
        location.hash = `category=${category}`;
    });
});

// 페이지 로드 및 해시 변경 이벤트 리스너
window.addEventListener('hashchange', handleCategory);
window.addEventListener('load', loadPosts);