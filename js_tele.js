// 取得 category（例："travel-tokyo"），預設從網址 query string 取得
function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

// category 對應的關鍵字
const categoryToKeyword = {
  "travel-tokyo": "東京",
  "travel-taiwan": "臺灣",
  "travel-osaka": "大阪",
  "travel-germany": "德國",
  "travel-austria": "奧地利",
  "travel-czech": "捷克",
  // 可依需求擴充其它對應
};

const pageSize = 5;
let filteredPosts = [];
let currentIndex = 0;

// 渲染文章
function renderPosts(start, count) {
  const container = document.getElementById('blog-posts-container');
  if (!container) return;

  const end = Math.min(start + count, filteredPosts.length);
  const postsHtml = [];

  for (let i = start; i < end; i++) {
    const post = filteredPosts[i];
    postsHtml.push(`
      <article class="post-card">
        <img src="${post['圖片連結']}" alt="${post['圖片註解'] || ''}" class="w-full h-auto rounded-lg mb-6 shadow-md">
        <div class="post-content">
          <span class="text-sm text-gray-500 mb-2 block">${post['日期']} · ${post['地區']}</span>
          <h3 class="text-3xl font-semibold text-gray-900 mb-4">${post['文章標題']}</h3>
          <p class="text-gray-700 leading-relaxed mb-4">${post['文章摘要']}</p>
          <a href="${post['文章連結']}" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300" target="_blank">
            閱讀更多 &rarr;
          </a>
          <div class="mt-4 flex flex-wrap gap-2">
            ${(post['tag'] || '').split(',').map(tag => tag.trim() ? `<span class="tag">${tag.trim()}</span>` : '').join('')}
          </div>
        </div>
      </article>
    `);
  }
  container.insertAdjacentHTML('beforeend', postsHtml.join(''));
  currentIndex = end;

  const loadMoreBtn = document.getElementById('load-more-posts');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = currentIndex >= filteredPosts.length ? 'none' : 'block';
  }
}

// 初始化及資料載入
function initBlogPosts() {
  fetch('blog_posts.json')
    .then(res => {
      if (!res.ok) throw new Error('資料載入失敗');
      return res.json();
    })
    .then(data => {
      const container = document.getElementById('blog-posts-container');
      if (!container) return;

      const category = getCategoryFromURL();
      const keyword = categoryToKeyword[category] || "";

      // 篩選「地區」或「tag」欄位包含關鍵字
      filteredPosts = keyword
        ? data.filter(post => {
            const region = post['地區'] || "";
            const tag = post['tag'] || "";
            return region.includes(keyword) || tag.includes(keyword);
          })
        : data;

      // 設定標題
      const titleEl = document.querySelector('h2[data-i18n="latest_posts_title"]');
      if (titleEl) {
        titleEl.textContent = keyword
          ? `總共搜尋到${filteredPosts.length}篇${keyword}相關熱門文章`
          : `總共搜尋到${filteredPosts.length}篇熱門文章`;
      }

      // 清空並載入
      container.innerHTML = "";
      currentIndex = 0;
      renderPosts(currentIndex, pageSize);
    })
    .catch(error => {
      console.error(error);
      const container = document.getElementById('blog-posts-container');
      if (container) container.innerHTML = "<p>無法載入文章資料，請稍後再試。</p>";
    });
}

// 綁定「載入更多」按鈕
document.addEventListener('DOMContentLoaded', () => {
  initBlogPosts();
  const loadMoreBtn = document.getElementById('load-more-posts');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      renderPosts(currentIndex, pageSize);
    });
  }
});
