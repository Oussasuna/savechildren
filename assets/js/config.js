/* ==========================================================================
   $SAVE COIN - Site Configuration File
   ========================================================================== 
   To update your real Contract Address (CA) when you launch:
   Simply change the CONTRACT_ADDRESS variable below!
   ========================================================================== */

const SAVE_CONFIG = {
  // Set your real Contract Address here when launched (e.g. "0x71SAVE...ROBINHOOD")
  CONTRACT_ADDRESS: "SOON...",

  // Set your Twitter/X URL
  TWITTER_URL: "https://x.com/save_robinhood",
  TWITTER_HANDLE: "@save_robinhood",

  // Set your Telegram URL
  TELEGRAM_URL: "https://t.me"
};

// Automatically apply config to page elements when loaded
document.addEventListener('DOMContentLoaded', () => {
  const caBtn = document.querySelector('[data-copy]');
  if (caBtn) {
    if (SAVE_CONFIG.CONTRACT_ADDRESS && SAVE_CONFIG.CONTRACT_ADDRESS !== "SOON...") {
      caBtn.dataset.copy = SAVE_CONFIG.CONTRACT_ADDRESS;
      caBtn.innerHTML = `📋 CA: ${SAVE_CONFIG.CONTRACT_ADDRESS} (CLICK TO COPY)`;
    }
  }
});
