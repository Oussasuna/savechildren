/* ==========================================================================
   Interactive 3D Coin Canvas Render with Drag-Spin Physics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCoin3D();
});

function initCoin3D() {
  const canvas = document.getElementById('coinCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const size = 360;
  canvas.width = size;
  canvas.height = size;

  let rotationY = 0;
  let rotationVelocity = 0.02;
  let isDragging = false;
  let previousMouseX = 0;

  // Preload Logo SVG image for rendering on coin face
  const logoImage = new Image();
  logoImage.src = 'assets/img/logo.svg';

  const scene = document.getElementById('coinScene');

  if (scene) {
    scene.addEventListener('mousedown', (e) => {
      isDragging = true;
      previousMouseX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      rotationVelocity = deltaX * 0.015;
      rotationY += rotationVelocity;
      previousMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile devices
    scene.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        previousMouseX = e.touches[0].clientX;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMouseX;
      rotationVelocity = deltaX * 0.015;
      rotationY += rotationVelocity;
      previousMouseX = e.touches[0].clientX;
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  function render() {
    ctx.clearRect(0, 0, size, size);

    if (!isDragging) {
      rotationVelocity *= 0.96; // Friction decay
      if (Math.abs(rotationVelocity) < 0.005) {
        rotationVelocity = 0.012; // Maintain gentle ambient spin
      }
      rotationY += rotationVelocity;
    }

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 130;
    const cosR = Math.cos(rotationY);
    const scaleX = Math.abs(cosR);
    const isFront = cosR >= 0;

    ctx.save();
    ctx.translate(centerX, centerY);

    // 1. Draw 3D Extruded Coin Rim Thickness
    const thickness = 16;
    const dir = isFront ? 1 : -1;
    for (let i = 0; i < thickness; i++) {
      ctx.beginPath();
      ctx.ellipse(i * dir * 0.5, 0, radius * scaleX, radius, 0, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#00FF66' : '#005224';
      ctx.fill();
    }

    // 2. Draw Coin Face
    ctx.save();
    ctx.scale(scaleX, 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);

    // Coin face gold/emerald gradient fill
    const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
    grad.addColorStop(0, '#00FF66');
    grad.addColorStop(0.5, '#00C805');
    grad.addColorStop(0.85, '#006E2E');
    grad.addColorStop(1, '#003B17');
    ctx.fillStyle = grad;
    ctx.fill();

    // Milled Outer Grooves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Logo Symbol inside Coin Face
    if (logoImage.complete) {
      ctx.drawImage(logoImage, -radius * 0.65, -radius * 0.65, radius * 1.3, radius * 1.3);
    }

    // Specular Lighting Sweep Across Coin Face
    const sweepGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    const timeOffset = (Math.sin(Date.now() * 0.003) + 1) / 2;
    sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(Math.max(0, timeOffset - 0.2), 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(timeOffset, 'rgba(255, 255, 255, 0.35)');
    sweepGrad.addColorStop(Math.min(1, timeOffset + 0.2), 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = sweepGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();

    requestAnimationFrame(render);
  }

  render();
}
