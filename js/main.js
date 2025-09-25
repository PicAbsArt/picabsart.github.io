// js/main.js
document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.getElementById('gallery');
  if (gallery) {
    new Masonry(gallery, {
      itemSelector: '.gallery-item',
      columnWidth: '.gallery-item',
      percentPosition: true,
      gutter: 10
    });
  }
});