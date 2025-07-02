// Helper: 取得元素
function $(selector) {
    return document.querySelector(selector);
}

// 平滑滾動至指定段落
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

// 新增文章卡片
function addNewPostCard() {
    const mainContent = $('#latest-posts-section .md\\:col-span-2');
    const loadMoreButton = $('#load-more-posts');
    if (!mainContent || !loadMoreButton) return;

    const newPost = document.createElement('article');
    newPost.className = 'post-card';
    newPost.innerHTML = `
        <img src="https://placehold.co/800x400/FFCC00/333333?text=秘魯馬丘比丘" alt="秘魯馬丘比丘" class="w-full h-auto rounded-lg mb-6 shadow-md">
        <span class="text-sm text-gray-500 mb-2 block">2023年6月1日 · 南美洲</span>
        <h3 class="text-3xl font-semibold text-gray-900 mb-4">秘魯馬丘比丘：探訪失落的印加古城</h3>
        <p class="text-gray-700 leading-relaxed mb-4">
            秘魯的馬丘比丘，這座被譽為世界新七大奇蹟之一的印加古城，隱藏在安第斯山脈的雲霧之中。這篇文章將帶你穿越印加古道，[...]
        </p>
        <a href="#" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300">
            閱讀更多 &rarr;
        </a>
        <div class="mt-4 flex flex-wrap gap-2">
            <span class="tag" data-i18n="tag_history">歷史</span>
            <span class="tag" data-i18n="tag_adventure">冒險</span>
            <span class="tag" data-i18n="tag_culture">文化</span>
        </div>
    `;
    mainContent.insertBefore(newPost, loadMoreButton.closest('div'));
}

// 公用 API 請求
async function fetchGeminiContent(apiKey, payload, type = 'text') {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (result.candidates && result.candidates[0].content?.parts?.length > 0) {
        return result.candidates[0].content.parts[0].text;
    }
    throw new Error('API response error');
}

// 顯示訊息盒
function showMessageBox(msgKey) {
    // 原本函式
    alert(msgKey); // 可以根據你的實作替換
}

// 綁定載入更多文章
const loadMoreButton = $('#load-more-posts');
if (loadMoreButton) {
    loadMoreButton.addEventListener('click', addNewPostCard);
}

// 綁定取得旅遊事實
const getFactsButton = $('#get-facts-button');
if (getFactsButton) {
    getFactsButton.addEventListener('click', async () => {
        const destination = $('#fact-destination-input').value.trim();
        const factLoadingIndicator = $('#fact-loading-indicator');
        const factOutput = $('#fact-output');
        const factContent = $('#fact-content');

        if (!destination) {
            showMessageBox('message_input_destination');
            return;
        }

        factLoadingIndicator.classList.remove('hidden');
        factOutput.classList.add('hidden');
        factContent.innerHTML = '';

        try {
            const prompt = `請提供關於 ${destination} 的一些有趣事實或簡要旅遊資訊。請以清晰、分點的文字格式回應，不需要 JSON。`;
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "text/plain" }
            };
            const apiKey = ""; // 填寫你的 API 金鑰
            const text = await fetchGeminiContent(apiKey, payload, 'text');
            factContent.innerHTML = text.replace(/\n/g, '<br>');
            factOutput.classList.remove('hidden');
        } catch {
            showMessageBox('message_facts_error');
        } finally {
            factLoadingIndicator.classList.add('hidden');
        }
    });
}

// 綁定產生旅行計畫
const generatePlanButton = $('#generate-plan-button');
if (generatePlanButton) {
    generatePlanButton.addEventListener('click', async () => {
        const destination = $('#destination-input').value.trim();
        const preferences = $('#preferences-input').value.trim();
        const loadingIndicator = $('#loading-indicator');
        const planOutput = $('#plan-output');
        const planContent = $('#plan-content');

        if (!destination) {
            showMessageBox('message_input_destination_for_plan');
            return;
        }

        loadingIndicator.classList.remove('hidden');
        planOutput.classList.add('hidden');
        planContent.innerHTML = '';

        try {
            const prompt = `為我生成一個前往 ${destination} 的旅行計劃。我的偏好是：${preferences}。請以 JSON 格式回應，包含一個天的陣列，每個天都包含 day 和 activities 陣列。`;
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "day": { "type": "NUMBER" },
                                "activities": {
                                    "type": "ARRAY",
                                    "items": { "type": "STRING" }
                                }
                            },
                            propertyOrdering: ["day", "activities"]
                        }
                    }
                }
            };
            const apiKey = ""; // 填寫你的 API 金鑰
            const jsonText = await fetchGeminiContent(apiKey, payload, 'json');
            const parsedPlan = JSON.parse(jsonText);
            if (Array.isArray(parsedPlan) && parsedPlan.length > 0) {
                planContent.innerHTML = parsedPlan.map(dayPlan =>
                    `<p class="font-semibold mt-3">第 ${dayPlan.day} 天:</p>` +
                    (Array.isArray(dayPlan.activities) && dayPlan.activities.length > 0
                        ? `<ul class="list-disc pl-5">${dayPlan.activities.map(a => `<li>${a}</li>`).join('')}</ul>`
                        : `<p>無活動建議。</p>`)
                ).join('');
                planOutput.classList.remove('hidden');
            } else {
                showMessageBox('message_invalid_plan');
            }
        } catch {
            showMessageBox('message_generation_error');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
}
