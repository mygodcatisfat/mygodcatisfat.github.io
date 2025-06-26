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
    // 關閉側邊欄
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        if (sidebar.classList.contains('open')) closeSidebar();
    }
    // 關閉語言選單
    if (!languageOptions.contains(e.target) && !languageButton.contains(e.target) && !languageButton.contains(e.target.parentNode)) {
        if (languageOptions.classList.contains('open')) {
            languageOptions.classList.remove('open');
            languageButton.querySelector('.menu-arrow').style.transform = 'rotate(0deg)';
        }
    }
});

// 語言選單展開與收合
function toggleLanguageOptions() {
    const options = document.getElementById('languageOptions');
    const buttonArrow = document.getElementById('languageButton').querySelector('.menu-arrow');
    options.classList.toggle('open');
    if (options.classList.contains('open')) {
        buttonArrow.style.transform = 'rotate(-90deg)';
    } else {
        buttonArrow.style.transform = 'rotate(0deg)';
    }
    document.querySelectorAll('.menu-section.expanded').forEach(s => s.classList.remove('expanded'));
}
