/*
監聽整個頁面的點擊事件，用於：
    點擊頁面其它區域時自動關閉側邊欄
    點擊非語言選單時自動收合語言選單
控制語言選單的展開/收合
*/

// 關閉側邊欄和語言選單的全域點擊事件
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    const languageOptions = document.getElementById('languageOptions');
    const languageButton = document.getElementById('languageButton');
    const target = e.target;
    
    // 關閉側邊欄
    if (sidebar && menuToggle && !sidebar.contains(target) && !menuToggle.contains(target)) {
        sidebar.classList.remove('open'); // 不需先判斷是否 open
        closeSidebar?.(); // 若函式不存在不報錯
    }
    
    // 關閉語言選單
    if (
        languageOptions &&
        languageButton &&
        !languageOptions.contains(target) &&
        !languageButton.contains(target)
    ) {
        languageOptions.classList.remove('open');
        const arrow = languageButton.querySelector('.menu-arrow');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
});

// 語言選單展開與收合
function toggleLanguageOptions() {
    const options = document.getElementById('languageOptions');
    const buttonArrow = document.getElementById('languageButton').querySelector('.menu-arrow');
    if (!options || !button) return;

    const arrow = button.querySelector('.menu-arrow');
    const isOpen = options.classList.toggle('open');

    if (arrow) arrow.style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0deg)';

    document.querySelectorAll('.menu-section.expanded').forEach(section => {
        section.classList.remove('expanded');
    });
}

// 每次頁面載入時會自動播放動畫。
// 每次使用者點擊 h1 也會播放動畫（即使動畫還沒播完也能重新觸發）。
document.addEventListener("DOMContentLoaded", function() {
    const title = document.getElementById("animated-title");
    if (!title) return;
    
    const baseClass = "animate__animated";
    const animationClass = "animate__rubberBand";

    function triggerAnimation(e) {
        if (e?.type === "touchstart") e.preventDefault();

        title.classList.remove(baseClass, animationClass);
        void title.offsetWidth; // 強制重排 (reflow)
        title.classList.add(baseClass, animationClass);
    }

    // 載入時播放動畫
    triggerAnimation();
    
    // 桌面點擊
    title.addEventListener("click", triggerAnimation(), false);
    // 手機觸控
    title.addEventListener("touchstart", triggerAnimation(), false);
    
    // 動畫結束後移除 class
    title.addEventListener("animationend", () => {
        title.classList.remove(baseClass, animationClass);
    });
});
