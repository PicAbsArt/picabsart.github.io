// === Открытие/закрытие меню ===
const burger = document.querySelector('.burger-img-btn');
const sidebar = document.querySelector('.sidebar-menu');
const closeBtn = document.querySelector('.close-btn');
const overlay = document.querySelector('.sidebar-overlay');

function openMenu() {
  sidebar.classList.add('active');
  overlay.classList.add('active');
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', openMenu);
closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// Закрытие при клике на ссылку
document.querySelectorAll('.menu-item:not(.has-submenu) > a, .submenu a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Управление подменю: только по клику на иконку
document.querySelectorAll('.has-submenu').forEach(item => {
  const icon = item.querySelector('.toggle-icon');
  const submenu = item.nextElementSibling; // следующий элемент — .submenu
  let isExpanded = false;

  function updateIcon() {
    icon.src = isExpanded ? '/icons/less.png' : '/icons/more.png';
    submenu.style.maxHeight = isExpanded ? submenu.scrollHeight + 'px' : '0';
  }

  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    isExpanded = !isExpanded;
    updateIcon();
  });

  // Инициализация: всё свёрнуто
  submenu.style.maxHeight = '0';
  icon.src = '/icons/more.png';
});