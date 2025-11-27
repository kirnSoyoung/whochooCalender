// ==================== 햄버거 바 ====================
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

// 클릭시 'show' 클래스 추가/제거
menuToggle.addEventListener('click', () => {
  menu.classList.toggle('show');
});

