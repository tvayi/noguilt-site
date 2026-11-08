(function () {
  'use strict';

  /* ---------- Мобильное меню в шапке ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    const menu = header.querySelector('.site-header__menu');
    const links = header.querySelector('.site-header__links');
    const compact = window.matchMedia('(max-width: 960px)');
    const setOpen = (open) => {
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      links.classList.toggle('is-open', open);
    };
    menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
    links.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setOpen(false); menu.focus(); }
    });
    document.addEventListener('click', (e) => { if (!header.contains(e.target)) setOpen(false); });
    compact.addEventListener('change', () => setOpen(false));
  }

  /* ---------- Лента документов со стрелками ---------- */
  const track = document.getElementById('docs-track');
  if (track) {
    const root = track.parentElement;
    const prev = root.querySelector('.docs__arrow--prev');
    const next = root.querySelector('.docs__arrow--next');
    const update = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    const move = (dir) => {
      const card = track.querySelector('.doc');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: smooth ? 'smooth' : 'auto' });
    };
    prev.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
    /* Ширина ленты меняется, когда подгружаются сканы */
    track.querySelectorAll('img').forEach((img) => { if (!img.complete) img.addEventListener('load', update); });
    update();
  }

  /* ---------- Просмотр сканов документов ---------- */
  const box = document.getElementById('lightbox');
  if (box && typeof box.showModal === 'function') {
    const img = box.querySelector('.lightbox__img');
    document.querySelectorAll('[data-lightbox]').forEach((btn) => {
      btn.addEventListener('click', () => {
        img.src = btn.dataset.lightbox;
        img.alt = btn.dataset.alt || '';
        box.showModal();
      });
    });
    box.querySelector('.lightbox__close').addEventListener('click', () => box.close());
    box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  }

  /* ---------- Запись через cal.com ----------
     Кнопки с атрибутом data-booking открывают календарь во всплывающем окне.
     Если cal.com не загрузился (блокировщик, сеть), кнопка ведёт по своему href — в Telegram. */
  const booking = window.CAL_BOOKING;
  if (!booking || !booking.link) return;

  const EMBED_SRC = 'https://app.cal.com/embed/embed.js';

  /* Стандартный загрузчик cal.com (element-click embed) */
  (function (C, A, L) { const p = function (a, ar) { a.q.push(ar); }; const d = C.document; C.Cal = C.Cal || function () { const cal = C.Cal; const ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, EMBED_SRC, 'init');

  const ns = booking.namespace;
  const calLink = booking.link + (booking.link.indexOf('?') === -1 ? '?locale=ru' : '');

  window.Cal('init', ns, { origin: 'https://app.cal.com' });
  window.Cal.config = window.Cal.config || {};
  window.Cal.config.forwardQueryParams = true;
  window.Cal.ns[ns]('ui', { hideEventTypeDetails: false, layout: 'month_view' });
  window.Cal.ns[ns]('preload', { calLink: calLink });

  /* Следим, загрузилась ли библиотека: 'loading' → 'ready' | 'failed' */
  let state = 'loading';
  const script = document.querySelector('script[src="' + EMBED_SRC + '"]');
  if (script) {
    script.addEventListener('load', () => { state = 'ready'; });
    script.addEventListener('error', () => { state = 'failed'; });
  }
  setTimeout(() => { if (state === 'loading') state = 'failed'; }, 10000);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-booking]');
    if (!btn || state === 'failed') return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    window.Cal.ns[ns]('modal', { calLink: calLink, config: booking.config });
  });
})();
