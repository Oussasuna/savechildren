/* ==========================================================================
   PFP Greenifier Canvas Generator & Before/After Comparison Tool
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPfpGreenifier();
});

function initPfpGreenifier() {
  const drop = document.getElementById('drop');
  const fileInput = document.getElementById('fileInput');
  const preview = document.getElementById('preview');
  const dropClear = document.getElementById('dropClear');
  const browseBtn = document.getElementById('browseBtn');
  const goBtn = document.getElementById('goBtn');
  
  const stageEmpty = document.getElementById('stageEmpty');
  const compare = document.getElementById('compare');
  const beforeImg = document.getElementById('beforeImg');
  const afterImg = document.getElementById('afterImg');
  const compareHandle = document.getElementById('compareHandle');
  
  const downloadBtn = document.getElementById('downloadBtn');
  const tweetBtn = document.getElementById('tweetBtn');

  let currentFile = null;
  let originalImageObj = null;
  let generatedDataUrl = null;

  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', () => fileInput.click());
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
      }
    });
  }

  // Drag & drop handlers
  if (drop) {
    ['dragenter', 'dragover'].forEach(evt => {
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        drop.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(evt => {
      drop.addEventListener(evt, (e) => {
        e.preventDefault();
        drop.classList.remove('is-dragover');
      });
    });

    drop.addEventListener('drop', (e) => {
      if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
  }

  if (dropClear) {
    dropClear.addEventListener('click', (e) => {
      e.stopPropagation();
      resetInput();
    });
  }

  function resetInput() {
    currentFile = null;
    originalImageObj = null;
    generatedDataUrl = null;
    preview.hidden = true;
    preview.src = '';
    goBtn.disabled = true;
    downloadBtn.disabled = true;
    compare.classList.remove('is-active');
    stageEmpty.style.display = 'block';
  }

  function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    currentFile = file;
    const reader = new FileReader();

    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.hidden = false;
      goBtn.disabled = false;

      originalImageObj = new Image();
      originalImageObj.src = e.target.result;
      originalImageObj.onload = () => {
        beforeImg.src = e.target.result;
      };
    };

    reader.readAsDataURL(file);
  }

  if (goBtn) {
    goBtn.addEventListener('click', () => {
      if (!originalImageObj) return;
      processGreenify();
    });
  }

  /* Canvas Image Processing Logic */
  function processGreenify() {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // 1. Draw scaled original image
    ctx.drawImage(originalImageObj, 0, 0, size, size);

    // 2. Pixel Greenify Color Matrix Manipulation
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Calculate grayscale brightness luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      // Map luminance to $SAVE green gradient scale
      // Low lum -> Dark emerald (#003B17), Mid lum -> Vibrant green (#00C805), High lum -> Neon green (#00FF66) / Mint (#E3FFE9)
      data[i] = Math.min(255, lum * 0.2);                    // Red channel
      data[i + 1] = Math.min(255, lum * 1.25 + 20);            // Green channel (boosted)
      data[i + 2] = Math.min(255, lum * 0.4 + 10);            // Blue channel
    }

    ctx.putImageData(imgData, 0, 0);

    // 3. Overlay $SAVE Circuit Feather Badge Watermark
    const logoImg = new Image();
    logoImg.src = 'assets/img/logo.svg';

    logoImg.onload = () => {
      // Draw subtle circuit ring border
      ctx.strokeStyle = '#00FF66';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
      ctx.stroke();

      // Draw bottom-right badge
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FF66';
      ctx.drawImage(logoImg, size - 110, size - 110, 95, 95);
      ctx.restore();

      // Export result
      generatedDataUrl = canvas.toDataURL('image/png');
      afterImg.src = generatedDataUrl;

      stageEmpty.style.display = 'none';
      compare.classList.add('is-active');
      downloadBtn.disabled = false;

      // Update Tweet Link
      if (tweetBtn) {
        tweetBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent('I just greenified my PFP for $SAVE @RobinhoodApp Charity! 🟢 #SaveCoin #RobinhoodChain')}`;
      }
    };
  }

  // Before/After Slider Drag Physics
  if (compareHandle && compare) {
    let isSliding = false;

    function updateSlider(clientX) {
      const rect = compare.getBoundingClientRect();
      let x = clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percentage = (x / rect.width) * 100;

      compareHandle.style.left = `${percentage}%`;
      afterImg.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
    }

    compareHandle.addEventListener('mousedown', () => isSliding = true);
    window.addEventListener('mouseup', () => isSliding = false);
    window.addEventListener('mousemove', (e) => {
      if (isSliding) updateSlider(e.clientX);
    });

    // Touch support
    compareHandle.addEventListener('touchstart', () => isSliding = true);
    window.addEventListener('touchend', () => isSliding = false);
    window.addEventListener('touchmove', (e) => {
      if (isSliding && e.touches.length > 0) updateSlider(e.touches[0].clientX);
    });
  }

  // Download Action
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!generatedDataUrl) return;
      const link = document.createElement('a');
      link.download = 'SAVE_PFP_Greenified.png';
      link.href = generatedDataUrl;
      link.click();
    });
  }
}
