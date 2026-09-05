/* ==========================================================================
   Make-a-Wish Community Board & Green Lantern Physics (Inspired by wishsolana.com)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initWishBoard();
});

const DEFAULT_WISHES = [
  { id: 1, text: "May 100% of trading fees feed 10,000 children this month! 💚", author: "RobinhoodTrench", likes: 142 },
  { id: 2, text: "Hope $SAVE becomes the #1 charity coin across all web3.", author: "CryptoCare", likes: 98 },
  { id: 3, text: "For zero childhood hunger and transparent blockchain donations.", author: "GreenFeather", likes: 87 },
  { id: 4, text: "Wishing for community strength and honest devs on Robinhood Chain!", author: "AnonHoldr", likes: 65 }
];

function initWishBoard() {
  const wishForm = document.getElementById('wishForm');
  const wishInput = document.getElementById('wishInput');
  const wishesGrid = document.getElementById('wishesGrid');

  // Load from localStorage or defaults
  let wishes = JSON.parse(localStorage.getItem('save_wishes')) || DEFAULT_WISHES;

  function saveAndRender() {
    localStorage.setItem('save_wishes', JSON.stringify(wishes));
    renderWishes();
  }

  function renderWishes() {
    if (!wishesGrid) return;
    wishesGrid.innerHTML = '';

    wishes.forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-card reveal is-in';
      card.innerHTML = `
        <div class="wish-text">"${escapeHtml(item.text)}"</div>
        <div class="wish-footer">
          <span>by ${escapeHtml(item.author)}</span>
          <button class="wish-like" data-id="${item.id}">
            ♥ <span>${item.likes}</span>
          </button>
        </div>
      `;
      wishesGrid.appendChild(card);
    });

    // Attach like events
    document.querySelectorAll('.wish-like').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.id);
        const target = wishes.find(w => w.id === id);
        if (target) {
          target.likes++;
          saveAndRender();
          createFloatingLantern(e.clientX, e.clientY);
        }
      });
    });
  }

  if (wishForm && wishInput) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = wishInput.value.trim();
      if (!val) return;

      const newWish = {
        id: Date.now(),
        text: val,
        author: `Robinhooder_${Math.floor(Math.random() * 8999 + 1000)}`,
        likes: 1
      };

      wishes.unshift(newWish);
      wishInput.value = '';
      saveAndRender();

      // Trigger Floating Wish Lantern FX
      const rect = wishForm.getBoundingClientRect();
      createFloatingLantern(rect.left + rect.width / 2, rect.top);
    });
  }

  renderWishes();
}

/* Floating Green Wish Lantern Particle Animation */
function createFloatingLantern(x, y) {
  const lantern = document.createElement('div');
  lantern.className = 'lantern-particle';
  lantern.innerHTML = '🏮';
  lantern.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 24px;
    pointer-events: none;
    z-index: 9999;
    filter: drop-shadow(0 0 15px #00FF66);
    transition: transform 2.5s ease-out, opacity 2.5s ease-out;
  `;

  document.body.appendChild(lantern);

  requestAnimationFrame(() => {
    lantern.style.transform = `translate(${(Math.random() - 0.5) * 100}px, -250px) scale(1.4)`;
    lantern.style.opacity = '0';
  });

  setTimeout(() => {
    lantern.remove();
  }, 2500);
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
