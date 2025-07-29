/*
控制側邊欄開啟/關閉
處理側邊欄選單的展開、收合互動
讓 sidebar 關閉事件更現代
根據選單點擊顯示不同內容或導頁
*/
// 控制側邊欄開啟/關閉，處理選單展開收合與內容切換

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerButton = document.getElementById('hamburgerButton') || document.querySelector(".menu-toggle");
    if (!sidebar || !overlay || !hamburgerButton) return;

    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('active');

    hamburgerButton.style.display = isOpen ? 'none' : '';
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerButton = document.getElementById('hamburgerButton') || document.querySelector(".menu-toggle");
    const langOptions = document.getElementById('languageOptions');
    const langButton = document.getElementById('languageButton');

    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    if (langOptions) langOptions.classList.remove('open');
    if (langButton) {
        const arrow = langButton.querySelector('.menu-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
    if (hamburgerButton) hamburgerButton.style.display = '';
}

// 綁定事件（安全檢查）
const overlayElem = document.querySelector('.sidebar-overlay');
if (overlayElem) {
    overlayElem.addEventListener('click', closeSidebar);
}

const sidebarMenu = document.querySelector('.sidebar-menu');
if (sidebarMenu) {
    sidebarMenu.addEventListener('click', function(e) {
        const menuTitle = e.target.closest('.menu-title');
        if (menuTitle) {
            const section = menuTitle.parentElement;
            section.classList.toggle('expanded');
            document.querySelectorAll('.menu-section.expanded').forEach(sec => {
                if (sec !== section) sec.classList.remove('expanded');
            });
            const langOptions = document.getElementById('languageOptions');
            const langButton = document.getElementById('languageButton');
            if (langOptions) langOptions.classList.remove('open');
            if (langButton) {
                const arrow = langButton.querySelector('.menu-arrow');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        }
    });
}

// 顯示內容或導頁
function showContent(contentType) {
    closeSidebar();
    if (contentType.startsWith('travel-')) {
        window.location.href = `travel.html?category=${contentType}`;
    } else {
        const contentMap = (typeof translations !== 'undefined' && translations[currentLanguage]) ? {
            'daily-morning': translations[currentLanguage]['daily_morning'],
            'daily-meal': translations[currentLanguage]['daily_meal'],
            'daily-nap': translations[currentLanguage]['daily_nap'],
            'daily-play': translations[currentLanguage]['daily_play'],
            'daily-evening': translations[currentLanguage]['daily_evening'],
            'food-favorites': translations[currentLanguage]['food_favorites'],
            'food-recipes': translations[currentLanguage]['food_recipes'],
            'food-hunting': translations[currentLanguage]['food_hunting'],
            'food-tips': translations[currentLanguage]['food_tips']
        } : {};
        alert((contentMap[contentType] || '內容載入中...') + ' (實際功能尚未實作)');
    }
}
