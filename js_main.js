let currentLanguage = 'zh-Hant'; // 預設語言
let translations = {}; // 儲存所有語言的翻譯數據

const JSON_URL = 'https://raw.githubusercontent.com/mygodcatisfat/mygodcatisfat.github.io/refs/heads/main/translations.json'; // 外部 JSON 檔案連結

// 載入翻譯數據
async function loadTranslations() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        translations = data;
        console.log('Translations loaded successfully:', translations);
    } catch (error) {
        console.error('Error loading translations from external JSON:', error);
    }
}

// 應用翻譯到頁面
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
    // 特別處理語言按鈕文本
    const languageButtonText = document.getElementById('languageButtonText');
    if (lang === 'en') {
        languageButtonText.innerText = '語言設定';
    } else {
        languageButtonText.innerText = 'LANGUAGE';
    }
}

// 頁面載入時執行
document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations(); // 先載入翻譯數據
    const storedLang = localStorage.getItem('selectedLanguage') || 'zh-Hant'; // 從 localStorage 讀取或預設中文
    selectLanguage(storedLang, false); // 應用初始語言，不觸發 alert
});

// 左側選單功能
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    // 關閉語言選單
    document.getElementById('languageOptions').classList.remove('open');
    document.getElementById('languageButton').querySelector('.menu-arrow').style.transform = 'rotate(0deg)';
}

document.querySelector('.sidebar-menu').addEventListener('click', function(e) {
    const menuTitle = e.target.closest('.menu-title');
    if (menuTitle) {
        const section = menuTitle.parentElement;
        section.classList.toggle('expanded');
        // 關閉其他展開的
        document.querySelectorAll('.menu-section.expanded').forEach(sec => {
            if (sec !== section) sec.classList.remove('expanded');
        });
        // 關閉語言選單
        document.getElementById('languageOptions').classList.remove('open');
        document.getElementById('languageButton').querySelector('.menu-arrow').style.transform = 'rotate(0deg)';
    }
});

function showContent(contentType) {
    // 關閉側邊欄
    closeSidebar();

    // 檢查是否為旅遊相關項目
    if (contentType.startsWith('travel-')) {
        // 導向到 travel.html 並帶上參數
        window.location.href = `travel.html?category=${contentType}`;
    } else {
        // 對於其他內容，顯示提示訊息（或您原有的顯示內容邏輯）
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

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}
window.onload = function() {
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// 語言選單功能
function toggleLanguageOptions() {
    const options = document.getElementById('languageOptions');
    const buttonArrow = document.getElementById('languageButton').querySelector('.menu-arrow');
    
    options.classList.toggle('open');
    if (options.classList.contains('open')) {
        buttonArrow.style.transform = 'rotate(-90deg)'; // 向上展開時箭頭向上
    } else {
        buttonArrow.style.transform = 'rotate(0deg)'; // 收合時箭頭復原
    }

    // 關閉其他展開的子選單
    document.querySelectorAll('.menu-section.expanded').forEach(s => {
        s.classList.remove('expanded');
    });
}

function selectLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    applyTranslations(lang);
    // 可加 toast 訊息取代 alert
    // showToast(lang === 'en' ? 'Switched to English' : '已切換為繁體中文');
}

// 輪播複製程式
document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.querySelector('.gallery-marquee');
    if (marquee) {
        marquee.innerHTML += marquee.innerHTML; // 複製一次內容達到無縫輪播
    }
});

// 平滑滾動腳本
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        function easeOutQuad(t) {
            return t * (2 - t);
        }

        function animation(currentTime) {
            if (!start) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);

            window.scrollTo(0, startPosition + distance * easedProgress);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    });
});

// 回到最上方按鈕功能
document.getElementById('back-to-top').addEventListener('click', function() {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 800;
    let start = null;

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function scrollTopAnimation(currentTime) {
        if (!start) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(scrollTopAnimation);
        }
    }

    requestAnimationFrame(scrollTopAnimation);
});

// 點擊頁面其他地方關閉側邊欄和語言選單
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const languageOptions = document.getElementById('languageOptions');
    const languageButton = document.getElementById('languageButton');
    
    // 關閉側邊欄
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        if (sidebar.classList.contains('open')) {
            closeSidebar();
        }
    }

    // 關閉語言選單
    if (!languageOptions.contains(e.target) && !languageButton.contains(e.target) && !languageButton.contains(e.target.parentNode)) {
         // 檢查點擊是否在語言按鈕本身或其子元素上
        if (languageOptions.classList.contains('open')) {
            languageOptions.classList.remove('open');
            languageButton.querySelector('.menu-arrow').style.transform = 'rotate(0deg)';
        }
    }
});
