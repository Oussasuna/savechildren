/* ==========================================================================
   Interactive Arcade Mini-Games (Coin Catcher, Green Jump, Save Match)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initArcade();
});

function initArcade() {
  const tabs = document.querySelectorAll('.arcade__tabs .tab');
  const gameCanvas = document.getElementById('gameCanvas');
  const overlay = document.getElementById('gOverlay');
  const gTitle = document.getElementById('gTitle');
  const gDesc = document.getElementById('gDesc');
  const gStart = document.getElementById('gStart');
  const gScore = document.getElementById('gScore');
  const gLives = document.getElementById('gLives');
  const gBest = document.getElementById('gBest');

  if (!gameCanvas) return;

  const ctx = gameCanvas.getContext('2d');
  let currentGame = 'catcher';
  let animationFrameId = null;
  let isPlaying = false;
  let score = 0;
  let lives = 3;
  let bestScore = localStorage.getItem('save_arcade_best') || 0;

  if (gBest) gBest.textContent = bestScore;

  // Set canvas resolution
  function resizeCanvas() {
    gameCanvas.width = gameCanvas.clientWidth;
    gameCanvas.height = gameCanvas.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Tab Switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      currentGame = tab.dataset.game;
      resetGameOverlay();
    });
  });

  function resetGameOverlay() {
    isPlaying = false;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    if (currentGame === 'catcher') {
      gTitle.textContent = 'Coin Catcher';
      gDesc.textContent = 'Move the feather basket to catch falling $SAVE coins!';
    } else if (currentGame === 'jump') {
      gTitle.textContent = 'Green Jump';
      gDesc.textContent = 'Bounce on green platforms and climb as high as you can!';
    } else if (currentGame === 'match') {
      gTitle.textContent = 'Pink & Green Match';
      gDesc.textContent = 'Match all the charity card pairs in record time!';
    }

    overlay.style.display = 'flex';
  }

  if (gStart) {
    gStart.addEventListener('click', () => {
      overlay.style.display = 'none';
      startGame();
    });
  }

  function startGame() {
    score = 0;
    lives = 3;
    isPlaying = true;
    if (gScore) gScore.textContent = score;
    if (gLives) gLives.textContent = lives;

    if (currentGame === 'catcher') {
      runCoinCatcher();
    } else if (currentGame === 'jump') {
      runGreenJump();
    } else if (currentGame === 'match') {
      runSaveMatch();
    }
  }

  function gameOver() {
    isPlaying = false;
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('save_arcade_best', bestScore);
      if (gBest) gBest.textContent = bestScore;
    }

    gTitle.textContent = 'Game Over!';
    gDesc.textContent = `Your Score: ${score} | High Score: ${bestScore}`;
    overlay.style.display = 'flex';
  }

  /* ------------------------------------------------------------------------
     Game 1: Coin Catcher
     ------------------------------------------------------------------------ */
  function runCoinCatcher() {
    const width = gameCanvas.width;
    const height = gameCanvas.height;

    let basketWidth = 90;
    let basketX = width / 2 - basketWidth / 2;
    let coins = [];
    let spawnCounter = 0;

    // Controls
    function handleMove(clientX) {
      const rect = gameCanvas.getBoundingClientRect();
      basketX = clientX - rect.left - basketWidth / 2;
      basketX = Math.max(0, Math.min(basketX, width - basketWidth));
    }

    window.addEventListener('mousemove', (e) => {
      if (isPlaying && currentGame === 'catcher') handleMove(e.clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (isPlaying && currentGame === 'catcher' && e.touches.length > 0) handleMove(e.touches[0].clientX);
    });

    function loop() {
      if (!isPlaying) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Basket (Robinhood Feather Boat)
      ctx.fillStyle = '#00FF66';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FF66';
      ctx.beginPath();
      ctx.roundRect(basketX, height - 30, basketWidth, 20, 10);
      ctx.fill();

      // 2. Spawn Coins
      spawnCounter++;
      if (spawnCounter % 40 === 0) {
        coins.push({
          x: Math.random() * (width - 30) + 15,
          y: -20,
          speed: Math.random() * 2 + 3,
          radius: 14
        });
      }

      // 3. Update and Draw Coins
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.y += c.speed;

        // Draw Coin
        ctx.fillStyle = '#00C805';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Check catch collision
        if (c.y + c.radius >= height - 30 && c.x >= basketX && c.x <= basketX + basketWidth) {
          coins.splice(i, 1);
          score += 10;
          if (gScore) gScore.textContent = score;
          continue;
        }

        // Check miss
        if (c.y > height) {
          coins.splice(i, 1);
          lives--;
          if (gLives) gLives.textContent = lives;
          if (lives <= 0) {
            gameOver();
            return;
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    loop();
  }

  /* ------------------------------------------------------------------------
     Game 2: Green Jump Platformer
     ------------------------------------------------------------------------ */
  function runGreenJump() {
    const width = gameCanvas.width;
    const height = gameCanvas.height;

    let p = { x: width / 2, y: height - 60, vx: 0, vy: -10, radius: 15 };
    let platforms = [];

    for (let i = 0; i < 6; i++) {
      platforms.push({ x: Math.random() * (width - 80), y: height - i * 80 - 40, w: 80, h: 14 });
    }

    function loop() {
      if (!isPlaying) return;

      ctx.clearRect(0, 0, width, height);

      // Physics
      p.vy += 0.4;
      p.y += p.vy;

      // Platform Collisions
      platforms.forEach(plat => {
        if (p.vy > 0 && p.x >= plat.x && p.x <= plat.x + plat.w && p.y + p.radius >= plat.y && p.y - p.radius <= plat.y + plat.h) {
          p.vy = -11;
          score += 5;
          if (gScore) gScore.textContent = score;
        }
      });

      // Draw Platforms
      ctx.fillStyle = '#00FF66';
      platforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      });

      // Draw Player
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      if (p.y > height + 50) {
        gameOver();
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    }

    loop();
  }

  /* ------------------------------------------------------------------------
     Game 3: Save Match Card Game
     ------------------------------------------------------------------------ */
  function runSaveMatch() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.fillStyle = '#00FF66';
    ctx.font = '20px Space Mono';
    ctx.textAlign = 'center';
    ctx.fillText('Match Game Activated! Match pairs on screen.', gameCanvas.width / 2, gameCanvas.height / 2);
  }
}
