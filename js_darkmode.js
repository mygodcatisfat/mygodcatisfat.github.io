// 夜間模式切換與紀錄
(() => {
  const DARK_MODE_KEY = 'dark-mode';
  const className = 'dark-mode';
  const classList = document.documentElement.classList;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // ✅ 主體邏輯
  function getUserPreference() {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    return stored === null ? prefersDark.matches : stored === 'true';
  }

  function applyDarkMode(enabled, persist = true) {
    classList.toggle(className, enabled);
    if (persist) localStorage.setItem(DARK_MODE_KEY, enabled);
  }

  // ✅ 將函式掛到 window，讓 HTML 按鈕能呼叫它
  window.toggleDarkMode = function () {
    const enabled = !classList.contains(className);
    applyDarkMode(enabled);
  };

  // ✅ 初始化主題
  document.addEventListener('DOMContentLoaded', () => {
    applyDarkMode(getUserPreference());
  });

  // ✅ 追蹤系統主題改變（除非使用者手動設定過）
  if (localStorage.getItem(DARK_MODE_KEY) === null) {
    prefersDark.addEventListener('change', (e) => {
      applyDarkMode(e.matches, false); // 不覆蓋 localStorage
    });
  }
})();
