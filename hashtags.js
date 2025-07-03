async function loadAllTags() {
    // 假設你有文章列表 json，例如 posts/index.json
    const articleList = await fetch('posts/index.json').then(r => r.json());
    const tagSet = new Set();
    for (const post of articleList) {
        // 假設每篇文章 json 有 tags 屬性，為陣列
        if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => tagSet.add(tag));
        }
    }
    // 顯示不重複 tag
    const hashtagList = document.getElementById('hashtag-list');
    hashtagList.innerHTML = [...tagSet].map(tag =>
        `<span class="tag">#${tag}</span>`
    ).join('');
}
loadAllTags();
