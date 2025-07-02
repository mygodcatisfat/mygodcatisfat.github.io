/*
載入外部 JSON 翻譯檔
根據使用者選擇切換語言
將對應語言的文字套用到有 data-i18n 屬性的元素上
*/
// 載入外部 JSON 翻譯檔，根據使用者選擇切換語言並套用到 data-i18n 屬性元素
const JSON_URL = 'https://raw.githubusercontent.com/mygodcatisfat/mygodcatisfat.github.io/refs/heads/main/translations.json';
const browserLang = navigator.language || navigator.userLanguage;
const defaultLang = ['zh-Hant', 'en'].includes(browserLang) ? browserLang : 'zh-Hant';
let translations = {};
let currentLanguage = 'zh-Hant';

async function loadTranslations(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(JSON_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            translations = await response.json();
            console.log('Translations loaded:', translations);
            return;
        } catch (error) {
            if (i === retries - 1) console.error('載入翻譯檔失敗:', error);
        }
    }
}

// fragment：在記憶體先組裝所有 DOM 變更，最後一次性加入頁面，減少操作 DOM 的次數。
// batch update：一次處理多個 DOM 更新，避免多次重繪(reflow/repaint)。
function applyTranslations(lang) {
    const langData = translations[lang];
    if (!langData) return;

    // fragment 批次處理 DOM
    const elements = document.querySelectorAll('[data-i18n]');
    const fragment = document.createDocumentFragment();
    const elementClones = [];

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (langData[key]) {
            // 複製節點，暫存到 fragment
            const clone = element.cloneNode(true);
            clone.innerText = langData[key];
            fragment.appendChild(clone);
            elementClones.push({original: element, clone});
        }
    });

    // batch update: 一次性替換所有內容
    elementClones.forEach(({original, clone}) => {
        original.parentNode.replaceChild(clone, original);
    });

    // 語言切換按鈕單獨處理（因為它可能沒有 data-i18n）
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
