// 夜間模式切換與紀錄
(function () {
    const DARK_MODE_KEY = 'dark-mode';

    function setDarkMode(on) {
        document.body.classList.toggle('dark-mode', on);
        localStorage.setItem(DARK_MODE_KEY, on);
    }

    function getDarkModePreference() {
        const stored = localStorage.getItem(DARK_MODE_KEY);
        if (stored !== null) {
            return stored === 'true';
        }
        // 若無記錄，依照系統偏好
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    window.toggleDarkMode = function () {
        const enabled = !document.body.classList.contains('dark-mode');
        setDarkMode(enabled);
    };

    // 初始化
    window.addEventListener('DOMContentLoaded', function () {
        setDarkMode(getDarkModePreference());
    });
})();
