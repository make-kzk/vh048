/* =====================================================
   VIBEHUNT BUSINESS — HRD PITCH DECK SCRIPT
   Interactive Slidebar, Wheel Navigation, Keyboard, ROI Calc
   ===================================================== */

(function () {
  'use strict';

  // --- Deck State ---
  const TOTAL_SLIDES = 5;
  let currentSlide = 0;
  let isThrottled = false;

  // --- DOM Elements ---
  const slides = document.querySelectorAll('.slide');
  const segmentTabs = document.querySelectorAll('.slide-segment-tab');
  const scrubberFill = document.querySelector('.scrubber-fill-bar');
  const scrubberThumb = document.querySelector('.scrubber-thumb');
  const scrubberTrack = document.querySelector('.scrubber-track-wrap');
  const prevBtn = document.querySelector('[data-deck-prev]');
  const nextBtn = document.querySelector('[data-deck-next]');
  const currentNumEl = document.querySelector('.current-num');
  const fullscreenBtn = document.querySelector('[data-deck-fullscreen]');

  // Modals & Toast
  const demoModal = document.getElementById('demoModal');
  const toastNotice = document.getElementById('toastNotice');

  // --- Slide Navigation Core ---
  function goToSlide(index, updateHash = true) {
    if (index < 0) index = 0;
    if (index >= TOTAL_SLIDES) index = TOTAL_SLIDES - 1;

    currentSlide = index;

    // 1. Update Slides Active Class
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    // 2. Update Slidebar Segment Tabs
    segmentTabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === currentSlide);
    });

    // 3. Update Scrubber Bar & Thumb
    // For 5 slides: 0 -> 20%, 1 -> 40%, 2 -> 60%, 3 -> 80%, 4 -> 100%
    const progressPercent = ((currentSlide + 1) / TOTAL_SLIDES) * 100;
    if (scrubberFill) scrubberFill.style.width = `${progressPercent}%`;
    if (scrubberThumb) scrubberThumb.style.left = `${progressPercent}%`;

    // 4. Update Counter & Buttons
    if (currentNumEl) {
      currentNumEl.textContent = String(currentSlide + 1).padStart(2, '0');
    }
    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === TOTAL_SLIDES - 1;

    // 5. Update URL Hash
    if (updateHash) {
      window.location.hash = `#${currentSlide + 1}`;
    }
  }

  function nextSlide() {
    if (currentSlide < TOTAL_SLIDES - 1) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }

  // --- Event Listeners: Slidebar Buttons & Tabs ---
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  segmentTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetIndex = parseInt(tab.getAttribute('data-slide-target'), 10);
      if (!isNaN(targetIndex)) {
        goToSlide(targetIndex);
      }
    });
  });

  // Click on Scrubber Track to Scrub
  if (scrubberTrack) {
    scrubberTrack.addEventListener('click', (e) => {
      const rect = scrubberTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetIndex = Math.min(TOTAL_SLIDES - 1, Math.floor(ratio * TOTAL_SLIDES));
      goToSlide(targetIndex);
    });
  }

  // --- Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    // If modal is open, let Escape close it
    if (demoModal && demoModal.classList.contains('open')) {
      if (e.key === 'Escape') closeModal();
      return;
    }

    // Ignore if typing in input
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'PageDown':
      case ' ': // Spacebar
        e.preventDefault();
        nextSlide();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;

      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        goToSlide(TOTAL_SLIDES - 1);
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        goToSlide(parseInt(e.key, 10) - 1);
        break;

      case 'f':
      case 'F':
      case 'а': // Russian layout 'f'
      case 'А':
        toggleFullscreen();
        break;
    }
  });

  // --- Mouse Wheel Navigation with Debounce ---
  window.addEventListener(
    'wheel',
    (e) => {
      // Don't intercept if inside scrollable content
      if (isThrottled) return;

      if (Math.abs(e.deltaY) > 25) {
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        isThrottled = true;
        setTimeout(() => {
          isThrottled = false;
        }, 550);
      }
    },
    { passive: true }
  );

  // --- Touch Swipe Navigation ---
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) nextSlide();
        else prevSlide();
      } else if (Math.abs(diffY) > 40) {
        if (diffY < 0) nextSlide();
        else prevSlide();
      }
    },
    { passive: true }
  );

  // --- Fullscreen Toggle ---
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // --- Direct Hash Loading (#1..#5) ---
  function initFromHash() {
    const hash = window.location.hash.replace('#', '');
    const slideNum = parseInt(hash, 10);
    if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= TOTAL_SLIDES) {
      goToSlide(slideNum - 1, false);
    } else {
      goToSlide(0, false);
    }
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    const slideNum = parseInt(hash, 10);
    if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= TOTAL_SLIDES) {
      if (slideNum - 1 !== currentSlide) {
        goToSlide(slideNum - 1, false);
      }
    }
  });

  // --- Slide 3 Interactive Tabs (Engine Panels) ---
  const engineTabBtns = document.querySelectorAll('.engine-tab-btn');
  const enginePanels = document.querySelectorAll('.engine-panel');

  engineTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPanel = btn.getAttribute('data-engine-tab');

      engineTabBtns.forEach((b) => b.classList.remove('active'));
      enginePanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const activePanel = document.querySelector(`.engine-panel[data-panel="${targetPanel}"]`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // --- Slide 4: Interactive ROI Calculator ---
  const teamSizeSlider = document.getElementById('teamSizeSlider');
  const hiresYearSlider = document.getElementById('hiresYearSlider');
  const teamSizeDisplay = document.getElementById('teamSizeDisplay');
  const hiresYearDisplay = document.getElementById('hiresYearDisplay');

  const calcSavedHours = document.getElementById('calcSavedHours');
  const calcSavedMoney = document.getElementById('calcSavedMoney');
  const calcChurnReduced = document.getElementById('calcChurnReduced');
  const calcPaybackDays = document.getElementById('calcPaybackDays');

  function updateRoiCalculations() {
    if (!teamSizeSlider || !hiresYearSlider) return;

    const teamSize = parseInt(teamSizeSlider.value, 10);
    const hiresCount = parseInt(hiresYearSlider.value, 10);

    // Display slider values
    if (teamSizeDisplay) teamSizeDisplay.textContent = `${teamSize} чел.`;
    if (hiresYearDisplay) hiresYearDisplay.textContent = `${hiresCount} позиций`;

    // Formulas based on research & benchmarks:
    // - Screening time saved: ~14 hours per position
    const savedHours = Math.round(hiresCount * 14);

    // - Failed hire reduction: typical churn during probation is 20% of hires.
    // VibeHunt reduces this by 46%.
    // Cost of 1 failed hire is estimated at ~1,800,000 ₸ (~$3,800 / ~380,000 ₽) in wasted recruiter & manager salary + sourcing.
    const preventedMisfits = Math.max(1, Math.round(hiresCount * 0.20 * 0.46));
    const savedKztMillion = (preventedMisfits * 1.8 + hiresCount * 0.15).toFixed(1);

    // - Payback days: with subscription amortized, 1 avoided misfit pays for 6-12 months.
    const payback = hiresCount > 30 ? '< 18 дней' : '< 30 дней';

    if (calcSavedHours) calcSavedHours.textContent = `~${savedHours} ч.`;
    if (calcSavedMoney) calcSavedMoney.textContent = `~${savedKztMillion} млн ₸`;
    if (calcChurnReduced) calcChurnReduced.textContent = `${preventedMisfits} сотрудников`;
    if (calcPaybackDays) calcPaybackDays.textContent = payback;
  }

  if (teamSizeSlider) teamSizeSlider.addEventListener('input', updateRoiCalculations);
  if (hiresYearSlider) hiresYearSlider.addEventListener('input', updateRoiCalculations);

  // --- Modal Popup Controls ---
  window.openDemoModal = function () {
    if (demoModal) demoModal.classList.add('open');
  };

  window.closeModal = function () {
    if (demoModal) demoModal.classList.remove('open');
  };

  window.showToast = function (text) {
    if (!toastNotice) return;
    toastNotice.querySelector('span').textContent = text;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 4000);
  };

  // Close modal when clicking backdrop
  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModal();
    });
  }

  // Handle Form Submissions (Demo and Pilot)
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('✓ Заявка принята! Мы свяжемся с вами в течение 15 минут.');
      form.reset();
    });
  });

  // --- Button hooks for in-slide navigation ---
  document.querySelectorAll('[data-goto-slide]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const slideIdx = parseInt(btn.getAttribute('data-goto-slide'), 10);
      if (!isNaN(slideIdx)) goToSlide(slideIdx);
    });
  });

  // --- Init ---
  initFromHash();
  updateRoiCalculations();
})();
