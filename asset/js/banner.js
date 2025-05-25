const banners = document.querySelectorAll('.banner');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let slideTimer = null;

// 슬라이드 표시 함수
function showSlide(index) {
  dots.forEach(d => d.classList.remove('active'));
  banners.forEach(b => b.classList.remove('active'));

  dots[index].classList.add('active');
  banners[index].classList.add('active');
  currentIndex = index;

  resetAutoSlide(); // 슬라이드 전환 시 타이머 재시작
}

// 자동 슬라이드 함수
function startAutoSlide() {
  slideTimer = setTimeout(() => {
    const nextIndex = (currentIndex + 1) % banners.length;
    showSlide(nextIndex);
  }, 3000);
}

function resetAutoSlide() {
  clearTimeout(slideTimer);
  startAutoSlide();
}

// 클릭 이벤트
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
  });
});

// 자동 슬라이드 시작
startAutoSlide();
