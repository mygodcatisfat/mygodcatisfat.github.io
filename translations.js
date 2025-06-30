/*
載入外部 JSON 翻譯檔
根據使用者選擇切換語言
將對應語言的文字套用到有 data-i18n 屬性的元素上
*/
// 載入外部 JSON 翻譯檔，根據使用者選擇切換語言並套用到 data-i18n 屬性元素
const JSON_URL = 'https://raw.githubusercontent.com/mygodcatisfat/mygodcatisfat.github.io/refs/heads/main/translations.json';
let translations = {};
let currentLanguage = 'zh-Hant';

async function loadTranslations() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        translations = await response.json();
        console.log('Translations loaded:', translations);
    } catch (error) {
        console.error('載入翻譯檔失敗:', error);
    }
}

function applyTranslations(lang) {
    const langData = translations[lang];
    if (!langData) return;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) element.innerText = langData[key];
    });
    const btn = document.getElementById('languageButtonText');
    if (btn) btn.innerText = lang === 'zh-Hant' ? '語言設定' : 'LANGUAGE';
}

function selectLanguage(lang) {
    if (!translations[lang]) return;
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    applyTranslations(lang);
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadTranslations();
    const storedLang = localStorage.getItem('selectedLanguage') || 'zh-Hant';
    selectLanguage(storedLang);
});
