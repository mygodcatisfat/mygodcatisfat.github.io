// 夜間模式切換與紀錄
(() => {
  const DARK_MODE_KEY = 'dark-mode';
  const className = 'dark-mode';
  const classList = document.documentElement.classList;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  const getUserPreference = () => {
    const stored = localStorage.getItem(DARK_MODE_KEY);
    return stored === null ? prefersDark.matches : stored === 'true';
  };

  const applyDarkMode = (enabled, persist = true) => {
    classList.toggle(className, enabled);
    if (persist) localStorage.setItem(DARK_MODE_KEY, enabled);
  };

  // 公開的切換函式
  window.toggleDarkMode = () => {
    const enabled = !classList.contains(className);
    applyDarkMode(enabled);
  };

  // 初始化
  document.addEventListener('DOMContentLoaded', () => {
    applyDarkMode(getUserPreference());
  });

  // 若使用者未手動設定偏好，則自動追蹤系統模式變化
  if (localStorage.getItem(DARK_MODE_KEY) === null) {
    prefersDark.addEventListener('change', (e) => {
      applyDarkMode(e.matches, false); // 不覆寫 localStorage
    });
  }
})();
