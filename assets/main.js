// assets/main.js

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });

    // Закрытие меню при клике вне области
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !e.target.closest('.menu-toggle')) {
        nav.classList.remove('show');
      }
    });
  }
});
