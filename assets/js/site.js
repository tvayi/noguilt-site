(function () {
  'use strict';

  /* Fade-in при скролле — только для эталонных секций (.refv-reveal) */
  const reveals = document.querySelectorAll('.refv-reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* Слайдер дипломов */
  const slider = document.getElementById('diplomaSlider');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsBox = document.getElementById('sliderDots');

  if (slider) {
    const getStep = () => {
      const card = slider.querySelector('.refv-slider__card');
      if (!card) return 280;
      const gap = parseInt(getComputedStyle(slider).gap || '16', 10);
      return card.offsetWidth + gap;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -getStep(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        slider.scrollBy({ left: getStep(), behavior: 'smooth' });
      });
    }

    if (dotsBox) {
      const cards = slider.querySelectorAll('.refv-slider__card');
      cards.forEach(() => {
        dotsBox.appendChild(document.createElement('span'));
      });
      const dots = dotsBox.querySelectorAll('span');

      const updateDots = () => {
        const step = getStep();
        const idx = Math.round(slider.scrollLeft / step);
        dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      };
      slider.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateDots);
      });
      updateDots();

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          slider.scrollTo({ left: i * getStep(), behavior: 'smooth' });
        });
      });
    }
  }
})();
