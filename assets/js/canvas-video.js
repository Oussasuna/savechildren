/* ==========================================================================
   Procedural Video Background Canvas (Cinematic Energy & Particle Rays)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCanvasVideo();
});

function initCanvasVideo() {
  const canvas = document.getElementById('videoCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let rayAngle = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Particle Class for Floating Energy Leaves & Feather Sparks
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.size = Math.random() * 3 + 1.5;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.opacity = Math.random() * 0.7 + 0.3;
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.opacity += Math.sin(Date.now() * this.pulseSpeed) * 0.02;

      if (this.y < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.fillStyle = '#00FF66';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00FF66';
      ctx.globalAlpha = Math.max(0.1, Math.min(0.9, this.opacity));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 75; i++) {
    particles.push(new Particle());
  }

  function render() {
    // 1. Dark Gradient Background Base
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, Math.max(width, height));
    bgGrad.addColorStop(0, '#092215');
    bgGrad.addColorStop(0.5, '#040d08');
    bgGrad.addColorStop(1, '#020704');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Rotating Light Rays
    rayAngle += 0.003;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.globalAlpha = 0.06;
    ctx.fillStyle = '#00FF66';

    const numRays = 8;
    for (let i = 0; i < numRays; i++) {
      const angle = rayAngle + (i * Math.PI * 2) / numRays;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.max(width, height), angle, angle + 0.18);
      ctx.lineTo(0, 0);
      ctx.fill();
    }
    ctx.restore();

    // 3. Floating Particles Update & Render
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}
