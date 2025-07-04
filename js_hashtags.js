async function loadAllTags() {
    try {
        const res = await fetch('blog_posts.json');
        const posts = await res.json();

        // 收集所有文章的 tag，去除重複與前後空白
        const tagSet = new Set();
        posts.forEach(post => {
            if (post.tag) {
                post.tag.split(',').forEach(tag => {
                    const cleanTag = tag.trim();
                    if (cleanTag) tagSet.add(cleanTag);
                });
            }
        });

        // 排序 tag
        const tags = Array.from(tagSet).sort();

        // 儲存全文章資料到全域變數
        window.allPosts = posts;

        // 輸出到側邊欄（製作成 button）
        const listEl = document.getElementById('hashtag-list');
        listEl.innerHTML = '';
        tags.forEach(tag => {
            const tagText = tag.startsWith('#') ? tag.slice(1) : tag;
            const btn = document.createElement('button');
            btn.className = 'tag px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-full font-semibold transition';
            btn.textContent = tagText;
            btn.onclick = () => handleTagClick(tagText);
            listEl.appendChild(btn);
        });
    } catch (e) {
        document.getElementById('hashtag-list').innerText = '載入失敗';
    }
}

// 多語文章欄位輔助函式
function getTranslatedBlogField(serial, field) {
    if (typeof translations === 'object' && translations[currentLanguage]) {
        const key = `blog_${serial}_${field}`;
        if (translations[currentLanguage][key]) {
            return translations[currentLanguage][key];
        }
    }
    return null;
}

// 點擊 tag，顯示於主文章區左側
function handleTagClick(tagText) {
    // 確保翻譯已經載入才渲染
    if (!translations || !translations[currentLanguage]) return;
    
    const posts = window.allPosts || [];
    const filtered = posts.filter(post =>
        post.tag && post.tag.split(',').some(t =>
            t.trim().replace(/^#/, '') === tagText
        )
    );

    // 標題：共搜尋到X篇[tag]相關熱門文章
    const titleEl = document.getElementById('dynamic-post-title');
    if (titleEl) {
        // 可根據多語需求自行調整
        titleEl.textContent = `共搜尋到${filtered.length}篇${tagText}相關熱門文章`;
    }

    // 文章列表
    const container = document.getElementById('blog-posts-container');
    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-gray-500 text-center py-8">沒有相關文章</div>`;
    } else {
        filtered.forEach(post => {
            const serial = post['序號'];
            const title = getTranslatedBlogField(serial, 'title') || post['文章標題'];
            const summary = getTranslatedBlogField(serial, 'summary') || post['文章摘要'];
            // 加入 tag 標籤顯示
            const tagsHtml = (post['tag'] || '').split(',')
                .map(tag => `<span class="tag">${tag.trim()}</span>`)
                .join('');
            container.innerHTML += `
                <article class="post-card">
                    <img src="${post['圖片連結']}" alt="${post['圖片註解'] || ''}" class="w-full h-auto rounded-lg mb-6 shadow-md">
                    <div class="post-content">
                        <span class="text-sm text-gray-500 mb-2 block">${post['日期'] || ''} · ${post['地區'] || ''}</span>
                        <h3 class="text-3xl font-semibold text-gray-900 mb-4">${post['文章標題']}</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">${post['文章摘要'] || ''}</p>
                        <a href="${post['文章連結'] || '#'}" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300" target="_blank">
                            閱讀更多 &rarr;
                        </a>
                        <div class="mt-4 flex flex-wrap gap-2">
                            ${tagsHtml}
                        </div>
                    </div>
                </article>
            `;
        });
    }

    // 若有「載入更多」按鈕可選擇隱藏
    const loadMoreBtn = document.getElementById('load-more-posts');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

// 頁面載入後執行
document.addEventListener('DOMContentLoaded', loadAllTags);
