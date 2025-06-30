    <script>
        function scrollToSection(id) {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
        
        const loadMoreButton = document.getElementById('load-more-posts');
        if (loadMoreButton) {
            loadMoreButton.addEventListener('click', () => {
                const mainContent = document.querySelector('#latest-posts-section .md\\:col-span-2');
                if (mainContent) {
                    const newPost = document.createElement('article');
                    newPost.classList.add('post-card');
                    newPost.innerHTML = `
                        <img src="https://placehold.co/800x400/FFCC00/333333?text=秘魯馬丘比丘" alt="秘魯馬丘比丘" class="w-full h-auto rounded-lg mb-6 shadow-md">
                        <span class="text-sm text-gray-500 mb-2 block">2023年6月1日 · 南美洲</span>
                        <h3 class="text-3xl font-semibold text-gray-900 mb-4">秘魯馬丘比丘：探訪失落的印加古城</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">
                            秘魯的馬丘比丘，這座被譽為世界新七大奇蹟之一的印加古城，隱藏在安第斯山脈的雲霧之中。這篇文章將帶你穿越印加古道，探索這座神秘城市的歷史與文化，感受它令人窒息的壯麗景色。
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
            });
        }
        const getFactsButton = document.getElementById('get-facts-button');
        const factDestinationInput = document.getElementById('fact-destination-input');
        const factLoadingIndicator = document.getElementById('fact-loading-indicator');
        const factOutput = document.getElementById('fact-output');
        const factContent = document.getElementById('fact-content');
        if (getFactsButton) {
            getFactsButton.addEventListener('click', async () => {
                const destination = factDestinationInput.value.trim();
                if (!destination) {
                    showMessageBox('message_input_destination');
                    return;
                }
                factLoadingIndicator.classList.remove('hidden');
                factOutput.classList.add('hidden');
                factContent.innerHTML = '';
                try {
                    let chatHistory = [];
                    const prompt = `請提供關於 ${destination} 的一些有趣事實或簡要旅遊資訊。請以清晰、分點的文字格式回應，不需要 JSON。`;
                    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                    const payload = {
                        contents: chatHistory,
                        generationConfig: { responseMimeType: "text/plain" }
                    };
                    const apiKey = "";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const result = await response.json();
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const text = result.candidates[0].content.parts[0].text;
                        factContent.innerHTML = text.replace(/\n/g, '<br>');
                        factOutput.classList.remove('hidden');
                    } else {
                        showMessageBox('message_facts_error');
                    }
                } catch {
                    showMessageBox('message_facts_error');
                } finally {
                    factLoadingIndicator.classList.add('hidden');
                }
            });
        }
        const generatePlanButton = document.getElementById('generate-plan-button');
        const destinationInput = document.getElementById('destination-input');
        const preferencesInput = document.getElementById('preferences-input');
        const loadingIndicator = document.getElementById('loading-indicator');
        const planOutput = document.getElementById('plan-output');
        const planContent = document.getElementById('plan-content');
        if (generatePlanButton) {
            generatePlanButton.addEventListener('click', async () => {
                const destination = destinationInput.value.trim();
                const preferences = preferencesInput.value.trim();
                if (!destination) {
                    showMessageBox('message_input_destination_for_plan');
                    return;
                }
                loadingIndicator.classList.remove('hidden');
                planOutput.classList.add('hidden');
                planContent.innerHTML = '';
                try {
                    let chatHistory = [];
                    const prompt = `為我生成一個前往 ${destination} 的旅行計劃。我的偏好是：${preferences}。請以 JSON 格式回應，包含一個天的陣列，每個天都有一個 day 數字和一個 activities 陣列。例如：[{ "day": 1, "activities": ["活動1", "活動2"] }]。確保 JSON 格式正確，不要包含任何額外文字。`;
                    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                    const payload = {
                        contents: chatHistory,
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
                                    "propertyOrdering": ["day", "activities"]
                                }
                            }
                        }
                    };
                    const apiKey = "";
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    const result = await response.json();
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const jsonText = result.candidates[0].content.parts[0].text;
                        const parsedPlan = JSON.parse(jsonText);
                        let planHtml = '';
                        if (Array.isArray(parsedPlan) && parsedPlan.length > 0) {
                            parsedPlan.forEach(dayPlan => {
                                planHtml += `<p class="font-semibold mt-3">第 ${dayPlan.day} 天:</p>`;
                                if (Array.isArray(dayPlan.activities) && dayPlan.activities.length > 0) {
                                    planHtml += '<ul class="list-disc pl-5">';
                                    dayPlan.activities.forEach(activity => {
                                        planHtml += `<li>${activity}</li>`;
                                    });
                                    planHtml += '</ul>';
                                } else {
                                    planHtml += '<p>無活動建議。</p>';
                                }
                            });
                            planContent.innerHTML = planHtml;
                            planOutput.classList.remove('hidden');
                        } else {
                            showMessageBox('message_invalid_plan');
                        }
                    } else {
                        showMessageBox('message_generation_error');
                    }
                } catch {
                    showMessageBox('message_generation_error');
                } finally {
                    loadingIndicator.classList.add('hidden');
                }
            });
        }
    </script>
