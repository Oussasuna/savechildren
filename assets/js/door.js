/* ==========================================================================
   $SAVE COIN - Teaser Logic (Icon-Only Audio Toggle & Clipboard Copy)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAudioToggle();
  initCopyButtons();
});

/* Top-Right Icon-Only Audio Toggle */
function initAudioToggle() {
  const video = document.getElementById('forestVideo');
  const soundBtn = document.getElementById('soundBtn');

  if (!video || !soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      video.play();
      soundBtn.innerHTML = '🔊';
      soundBtn.classList.add('is-active');
      soundBtn.title = 'Mute Audio';
    } else {
      video.muted = true;
      soundBtn.innerHTML = '🔈';
      soundBtn.classList.remove('is-active');
      soundBtn.title = 'Unmute Audio';
    }
  });
}

/* Clipboard Copy Buttons */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ca = btn.dataset.copy;
      navigator.clipboard.writeText(ca).then(() => {
        showToast('Contract Address Copied! 🟢');
      }).catch(() => {
        showToast('CA: ' + ca);
      });
    });
  });
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-show');

  setTimeout(() => {
    toast.classList.remove('is-show');
  }, 3000);
}
