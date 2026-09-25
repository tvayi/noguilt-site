(function () {
  'use strict';

  /* Просмотр сканов документов в полном размере */
  const box = document.getElementById('lightbox');
  if (!box || typeof box.showModal !== 'function') return;

  const img = box.querySelector('.lightbox__img');

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      img.src = btn.dataset.lightbox;
      img.alt = btn.dataset.alt || '';
      box.showModal();
    });
  });

  box.querySelector('.lightbox__close').addEventListener('click', () => box.close());

  /* Клик по затемнённому фону закрывает окно */
  box.addEventListener('click', (e) => {
    if (e.target === box) box.close();
  });
})();
