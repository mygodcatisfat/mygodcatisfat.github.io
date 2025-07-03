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

// 點擊 tag，顯示於主文章區左側
function handleTagClick(tagText) {
    const posts = window.allPosts || [];
    const filtered = posts.filter(post =>
        post.tag && post.tag.split(',').some(t =>
            t.trim().replace(/^#/, '') === tagText
        )
    );

    // 標題：共搜尋到X篇[tag]相關熱門文章
    const titleEl = document.getElementById('dynamic-post-title');
    if (titleEl) {
        titleEl.textContent = `共搜尋到${filtered.length}篇${tagText}相關熱門文章`;
    }

    // 文章列表
    const container = document.getElementById('blog-posts-container');
    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-gray-500 text-center py-8">沒有相關文章</div>`;
    } else {
        filtered.forEach(post => {
            container.innerHTML += `
                <div class="post-card mb-6">
                    <img src="${post['圖片連結']}" alt="${post['圖片註解'] || ''}">
                    <div class="post-content">
                        <span class="text-sm text-gray-500 mb-2 block">${row['日期']} · ${row['地區']}</span>
                        <h3 class="text-3xl font-semibold text-gray-900 mb-4">${row['文章標題']}</h3>
                        <p class="text-gray-700 leading-relaxed mb-4">${row['文章摘要']}</p>
                        <a href="${row['文章連結']}" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300" target="_blank">
                            閱讀更多 &rarr;
                        </a>
                        <div class="mt-4 flex flex-wrap gap-2">
                            ${(row['tag'] || '').split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // 若有「載入更多」按鈕可選擇隱藏
    const loadMoreBtn = document.getElementById('load-more-posts');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

// 頁面載入後執行
document.addEventListener('DOMContentLoaded', loadAllTags);
