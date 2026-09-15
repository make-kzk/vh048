(function () {
  const buttons = Array.from(document.querySelectorAll('.pres-slidebar__nav [data-slide]'));
  const slides = Array.from(document.querySelectorAll('.pres-slide'));
  const prevBtn = document.getElementById('pres-prev');
  const nextBtn = document.getElementById('pres-next');
  const progressEl = document.getElementById('pres-progress');
  const progressBar = document.getElementById('pres-bar');
  const notesPanel = document.getElementById('pres-notes');
  const notesToggle = document.getElementById('pres-notes-toggle');
  const notesClose = document.getElementById('pres-notes-close');
  const notesBlocks = Array.from(document.querySelectorAll('[data-notes]'));
  const notesBody = document.getElementById('pres-notes-body');
  const total = slides.length;
  let current = 0;

  function renderNotes(index) {
    if (!notesBody) return;
    const block = notesBlocks.find((el) => Number(el.dataset.notes) === index);
    notesBody.innerHTML = block ? block.innerHTML : '';
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
    if (progressBar) progressBar.style.width = `${((current + 1) / total) * 100}%`;
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);

    renderNotes(current);
  }

  function toggleNotes(open) {
    if (!notesPanel) return;
    const next = open ?? !notesPanel.classList.contains('open');
    notesPanel.classList.toggle('open', next);
    notesPanel.setAttribute('aria-hidden', String(!next));
  }

  buttons.forEach((btn, i) => btn.addEventListener('click', () => goTo(i)));
  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));
  notesToggle?.addEventListener('click', () => toggleNotes());
  notesClose?.addEventListener('click', () => toggleNotes(false));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      toggleNotes();
      return;
    }
    if (notesPanel?.classList.contains('open') && e.key === 'Escape') {
      toggleNotes(false);
      return;
    }
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

  const fromHash = parseInt(location.hash.replace('#', ''), 10);
  goTo(Number.isFinite(fromHash) && fromHash >= 1 ? fromHash - 1 : 0, { updateHash: false });
})();
