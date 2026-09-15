(function () {
  const buttons = Array.from(document.querySelectorAll('.pres-slidebar__nav [data-slide]'));
  const slides = Array.from(document.querySelectorAll('.pres-slide'));
  const prevBtn = document.getElementById('pres-prev');
  const nextBtn = document.getElementById('pres-next');
  const progressEl = document.getElementById('pres-progress');
  const fitters = Array.from(document.querySelectorAll('[data-fit]'));
  const total = slides.length;
  let current = 0;

  /* Product screens are built at a fixed desktop size; scale them to whatever
     room the slide has left so the slide never scrolls. */
  function fitAll() {
    fitters.forEach((box) => {
      const inner = box.querySelector('.pres-fit__inner');
      if (!inner) return;

      inner.style.setProperty('--fit-scale', '1');
      const natural = inner.getBoundingClientRect();
      if (!natural.width || !natural.height) return;

      const available = box.getBoundingClientRect();
      const scale = Math.min(1.6, available.width / natural.width, available.height / natural.height);
      inner.style.setProperty('--fit-scale', String(scale));
    });
  }

  function goTo(index, { updateHash = true } = {}) {
    current = Math.max(0, Math.min(total - 1, index));

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.hidden = i !== current;
    });

    buttons.forEach((btn, i) => {
      const active = i === current;
      btn.classList.toggle('preview-nav--active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;
    if (progressEl) progressEl.textContent = `${current + 1} / ${total}`;
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);

    fitAll();
  }

  buttons.forEach((btn, i) => btn.addEventListener('click', () => goTo(i)));
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goTo(current + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goTo(current - 1);
    }
    if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      goTo(total - 1);
    }
  });

  window.addEventListener('resize', fitAll);
  document.fonts?.ready.then(fitAll);

  const fromHash = parseInt(location.hash.replace('#', ''), 10);
  goTo(Number.isFinite(fromHash) && fromHash >= 1 ? fromHash - 1 : 0, { updateHash: false });
})();
