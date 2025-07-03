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

// 點擊 tag 時，顯示包含該 tag 的文章於「熱門文章」區
function handleTagClick(tagText) {
    // 過濾包含此 tag 的文章
    const posts = window.allPosts || [];
    const filtered = posts.filter(post =>
        post.tag && post.tag.split(',').some(t =>
            t.trim().replace(/^#/, '') === tagText
        )
    );

    // 尋找 sidebar 熱門文章區塊
    // 假設只有一個熱門文章區，且h3標題有data-i18n="popular_posts_title"
    const sidebarWidgets = document.querySelectorAll('.sidebar-widget');
    let popularWidget = null;
    sidebarWidgets.forEach(widget => {
        const h3 = widget.querySelector('h3[data-i18n="popular_posts_title"]');
        if (h3) popularWidget = widget;
    });
    if (!popularWidget) return; // 找不到就不處理

    // 修改標題下內容
    let infoBox = popularWidget.querySelector('.tag-search-info');
    if (!infoBox) {
        infoBox = document.createElement('div');
        infoBox.className = 'tag-search-info text-sm text-gray-700 my-2';
        popularWidget.insertBefore(infoBox, popularWidget.querySelector('ul,ol'));
    }
    infoBox.innerHTML = `共搜尋到 <span class="font-bold">${filtered.length}</span> 篇 <span class="font-bold">${tagText}</span> 相關熱門文章`;

    // 修改文章列表
    const ul = popularWidget.querySelector('ul,ol');
    ul.innerHTML = '';
    if (filtered.length === 0) {
        ul.innerHTML = '<li>沒有相關文章</li>';
    } else {
        filtered.forEach(post => {
            const li = document.createElement('li');
            li.className = "flex items-start";
            li.innerHTML = `
                <img src="${post['圖片連結']}" alt="${post['圖片註解'] || ''}" class="rounded-md mr-3 shadow" style="width:60px;height:60px;object-fit:cover;">
                <div>
                    <a href="${post['文章連結'] || '#'}" class="text-lg font-medium text-gray-900 hover:text-indigo-600" target="_blank" rel="noopener">
                        ${post['文章標題']}
                    </a>
                    <p class="text-sm text-gray-500">${post['日期'] || ''}</p>
                </div>
            `;
            ul.appendChild(li);
        });
    }
}

// 頁面載入後執行
document.addEventListener('DOMContentLoaded', loadAllTags);
