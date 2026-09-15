(function () {
  const buttons = Array.from(document.querySelectorAll('.pres-slidebar__nav [data-slide]'));
  const slides = Array.from(document.querySelectorAll('.pres-slide'));
  const prevBtn = document.getElementById('pres-prev');
  const nextBtn = document.getElementById('pres-next');
  const progressEl = document.getElementById('pres-progress');
  const total = slides.length;
  let current = 0;

  function clamp(index) {
    return Math.max(0, Math.min(total - 1, index));
  }

  function goTo(index, { updateHash = true } = {}) {
    current = clamp(index);

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

    if (updateHash) {
      history.replaceState(null, '', `#${current + 1}`);
    }
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => goTo(i));
  });

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goTo(current + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
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

  const hash = location.hash.replace('#', '');
  const fromHash = parseInt(hash, 10);
  goTo(Number.isFinite(fromHash) && fromHash >= 1 ? fromHash - 1 : 0, { updateHash: false });
})();
