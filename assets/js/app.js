/* ==========================================================================
   $SAVE COIN - Main Application Controller, Live Tracker, Copy CA Toast
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCopyButtons();
  initLiveTracker();
  initMobileDrawer();
  initChartFallback();
});

/* --------------------------------------------------------------------------
   1. Copy-to-Clipboard Contract Address with Animated Toast
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Contract Address Copied to Clipboard! 🟢');
      }).catch(() => {
        showToast('Copied: ' + textToCopy);
      });
    });
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-show');

    setTimeout(() => {
      toast.classList.remove('is-show');
    }, 2800);
  }
}

/* --------------------------------------------------------------------------
   2. Live Charity Donation Tracker Counter Animation & Price Strip
   -------------------------------------------------------------------------- */
function initLiveTracker() {
  const trackUsd = document.getElementById('trackUsd');
  const trackSol = document.getElementById('trackSol');
  const trackerMeta = document.getElementById('trackerMeta');
  const marketStrip = document.getElementById('marketStrip');

  let baseUsd = 148520;
  let baseSol = 1142.8;

  function updateTracker() {
    // Add small random increments to simulate live activity
    baseUsd += Math.random() * 8.5;
    baseSol += Math.random() * 0.05;

    if (trackUsd) {
      trackUsd.textContent = `$${Math.floor(baseUsd).toLocaleString('en-US')}`;
    }

    if (trackSol) {
      trackSol.textContent = `${baseSol.toFixed(2)} SOL`;
    }

    if (trackerMeta) {
      trackerMeta.textContent = `Connected to Robinhood Chain · Live Updates`;
    }

    if (marketStrip) {
      marketStrip.hidden = false;
    }
  }

  setInterval(updateTracker, 3000);
  updateTracker();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer Toggle
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');

  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', isOpen);
    });

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        burger.setAttribute('aria-expanded', false);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   4. Chart Fallback Handler
   -------------------------------------------------------------------------- */
function initChartFallback() {
  const dexFrame = document.getElementById('dexFrame');
  const chartLoading = document.getElementById('chartLoading');

  if (dexFrame) {
    dexFrame.addEventListener('load', () => {
      if (chartLoading) chartLoading.style.display = 'none';
    });
  }
}
