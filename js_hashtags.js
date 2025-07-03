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

        // 排序tag（可選）
        const tags = Array.from(tagSet).sort();

        // 輸出到側邊欄
        const listEl = document.getElementById('hashtag-list');
        listEl.innerHTML = tags.map(tag =>
            `<span class="tag">#${tag}</span>`
        ).join('');
    } catch (e) {
        document.getElementById('hashtag-list').innerText = '載入失敗';
    }
}

// 頁面載入後執行
document.addEventListener('DOMContentLoaded', loadAllTags);
