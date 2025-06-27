/*
控制側邊欄開啟/關閉
處理側邊欄選單的展開、收合互動
讓 sidebar 關閉事件更現代
根據選單點擊顯示不同內容或導頁
*/
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerButton = document.getElementById('hamburgerButton') || document.querySelector(".menu-toggle"); // 取得漢堡按鈕

    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');

    if (sidebar.classList.contains('open')) {
        hamburgerButton.style.display = 'none'; // 隱藏漢堡按鈕
    } else {
        hamburgerButton.style.display = ''; // 顯示漢堡按鈕
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const hamburgerButton = document.getElementById('hamburgerButton'); // 取得漢堡按鈕

    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.getElementById('languageOptions').classList.remove('open');
    document.getElementById('languageButton').querySelector('.menu-arrow').style.transform = 'rotate(0deg)';
    hamburgerButton.style.display = ''; // 關閉時顯示漢堡按鈕
}

document.querySelector('.sidebar-overlay').addEventListener('click', closeSidebar);

document.querySelector('.sidebar-menu').addEventListener('click', function(e) {
    const menuTitle = e.target.closest('.menu-title');
    if (menuTitle) {
        const section = menuTitle.parentElement;
        section.classList.toggle('expanded');
        document.querySelectorAll('.menu-section.expanded').forEach(sec => {
            if (sec !== section) sec.classList.remove('expanded');
        });
        document.getElementById('languageOptions').classList.remove('open');
        document.getElementById('languageButton').querySelector('.menu-arrow').style.transform = 'rotate(0deg)';
    }
});

function showContent(contentType) {
    closeSidebar();
    if (contentType.startsWith('travel-')) {
        window.location.href = `travel.html?category=${contentType}`;
    } else {
        const contentMap = translations[currentLanguage] ? {
            'daily-morning': translations[currentLanguage]['daily_morning'],
            'daily-meal': translations[currentLanguage]['daily_meal'],
            'daily-nap': translations[currentLanguage]['daily_nap'],
            'daily-play': translations[currentLanguage]['daily_play'],
            'daily-evening': translations[currentLanguage]['daily_evening'],
            'food-favorites': translations[currentLanguage]['food_favorites'],
            'food-recipes': translations[currentLanguage]['food_recipes'],
            "food-reviews": translations[currentLanguage]['food_reviews'],
            "food-hunting": translations[currentLanguage]['food_hunting'],
            "food-tips": translations[currentLanguage]['food_tips']
        } : {};
        alert((contentMap[contentType] || '內容載入中...') + ' (實際功能尚未實作)');
    }
}
