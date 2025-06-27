/*
載入外部 JSON 翻譯檔
根據使用者選擇切換語言
將對應語言的文字套用到有 data-i18n 屬性的元素上
*/
let currentLanguage = 'zh-Hant';
let translations = {};
const JSON_URL = 'https://raw.githubusercontent.com/mygodcatisfat/mygodcatisfat.github.io/refs/heads/main/translations.json';

async function loadTranslations() {
    try {
        const response = await fetch(JSON_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        translations = await response.json();
        console.log('Translations loaded successfully:', translations);
    } catch (error) {
        console.error('Error loading translations from external JSON:', error);
    }
}

function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.innerText = translations[lang][key];
        }
    });
    const languageButtonText = document.getElementById('languageButtonText');
    if (lang === 'en') {
        languageButtonText.innerText = '語言設定';
    } else {
        languageButtonText.innerText = 'LANGUAGE';
    }
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
    selectLanguage(storedLang, false);
});
