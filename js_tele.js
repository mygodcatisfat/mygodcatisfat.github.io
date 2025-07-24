document.addEventListener('DOMContentLoaded', function() {
  // 防止重複載入
  if (window.isPostsLoaded) return;
  window.isPostsLoaded = true;

  // 類別關鍵字映射
  const categoryToKeyword = {
    "travel-tokyo": "東京",
    "travel-taiwan": "臺灣",
    "travel-osaka": "大阪",
    "travel-germany": "德國",
    "travel-austria": "奧地利",
    "travel-czech": "捷克"
  };

  // 全域變數
  let allPosts = [];
  let filtered = [];
  let currentIndex = 0;
  const pageSize = 5;

  // 從 URL 獲取 category
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const keyword = categoryToKeyword[category] || "";

  fetch('blog_posts.json')
    .then(res => res.json())
    .then(data => {
      allPosts = data;
      filtered = keyword ? allPosts.filter(post => post['地區'].includes(keyword)) : allPosts;

      // 清空容器
      const container = document.getElementById('blog-posts-container');
      container.innerHTML = "";

      // 渲染前5篇
      renderPosts(filtered.slice(0, pageSize));
    })
    .catch(error => console.error('載入失敗:', error));
});

function renderPosts(posts) {
  const container = document.getElementById('blog-posts-container');
  posts.forEach(post => {
    const html = `
      <article class="post-card">
        <img src="${post['圖片連結']}" alt="${post['圖片註解']}" class="w-full aspect-square">
        <div class="post-content">
          <span class="text-sm">${post['日期']} · ${post['地區']}</span>
          <h3 class="text-3xl">${post['文章標題']}</h3>
          <p>${post['文章摘要']}</p>
          <a href="${post['文章連結']}" target="_blank">閱讀更多 →</a>
        </div>
      </article>
    `;
    container.innerHTML += html;
  });
}
