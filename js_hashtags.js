// 載入所有 tag 並渲染為可點擊按鈕
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

        // 儲存全文章資料到全域變數，供後續查詢
        window.allPosts = posts;

        // 輸出到側邊欄（製作成 button）
        const listEl = document.getElementById('hashtag-list');
        listEl.innerHTML = '';
        tags.forEach(tag => {
            // 處理 tag 前的 #
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

// 點擊 tag 時，顯示包含該 tag 的文章
function handleTagClick(tagText) {
    // 檢查或建立顯示區塊
    let sidebar = document.getElementById('tag-result-sidebar');
    if (!sidebar) {
        sidebar = document.createElement('div');
        sidebar.className = 'sidebar-widget';
        sidebar.id = 'tag-result-sidebar';
        sidebar.innerHTML = `
            <h3 class="font-bold mb-2">#<span id="selected-tag"></span> 相關文章</h3>
            <ul id="tag-post-list" class="space-y-2"></ul>
        `;
        // 插入在 hashtag-list 下面
        let container = document.getElementById('hashtag-list');
        container.parentNode.insertBefore(sidebar, container.nextSibling);
    }
    sidebar.classList.remove('hidden');
    document.getElementById('selected-tag').textContent = tagText;

    // 過濾包含此 tag 的文章
    const posts = window.allPosts || [];
    // 支援逗號分隔、tag 前後空白
    const filtered = posts.filter(post =>
        post.tag && post.tag.split(',').some(t =>
            t.trim().replace(/^#/, '') === tagText
        )
    );

    // 顯示結果
    const list = document.getElementById('tag-post-list');
    list.innerHTML = '';
    if (filtered.length === 0) {
        list.innerHTML = '<li>沒有相關文章</li>';
    } else {
        filtered.forEach(post => {
            const li = document.createElement('li');
            // 文章標題與連結
            li.innerHTML = `<a href="${post['文章連結'] || '#'}" class="text-blue-700 hover:underline" target="_blank" rel="noopener">${post['文章標題']}</a>`;
            list.appendChild(li);
        });
    }
}

// 頁面載入後執行
document.addEventListener('DOMContentLoaded', loadAllTags);
