/* ==========================================================================
   $SAVE COIN - Site Configuration File
   ========================================================================== */

const SAVE_CONFIG = {
  // Real Contract Address (CA)
  CONTRACT_ADDRESS: "0x0e6590062733718bd7108884d31be395a1bd9419",

  // Twitter/X URL & Handle
  TWITTER_URL: "https://x.com/save_robinhood",
  TWITTER_HANDLE: "@save_robinhood",

  // Telegram URL
  TELEGRAM_URL: "https://t.me"
};

// Automatically apply config to page elements when loaded
document.addEventListener('DOMContentLoaded', () => {
  const caBtns = document.querySelectorAll('[data-copy]');
  caBtns.forEach(btn => {
    if (SAVE_CONFIG.CONTRACT_ADDRESS) {
      btn.dataset.copy = SAVE_CONFIG.CONTRACT_ADDRESS;
      btn.innerHTML = `📋 CA: ${SAVE_CONFIG.CONTRACT_ADDRESS.substring(0, 6)}...${SAVE_CONFIG.CONTRACT_ADDRESS.substring(SAVE_CONFIG.CONTRACT_ADDRESS.length - 4)} (CLICK TO COPY)`;
    }
  });
});
