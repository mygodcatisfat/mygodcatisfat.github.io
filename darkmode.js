/*
控制網頁的夜間模式（切換 body class）
記憶使用者選擇（localStorage）
頁面載入時自動套用上次選擇
*/
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
}

window.onload = function() {
    if (localStorage.getItem('dark-mode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}
