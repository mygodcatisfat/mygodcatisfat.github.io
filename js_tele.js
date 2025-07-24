// 請確保 utils.js 已先載入

var categoryToKeyword = {
  "travel-tokyo": "東京",
  "travel-taiwan": "臺灣",
  "travel-osaka": "大阪",
  "travel-germany": "德國",
  "travel-austria": "奧地利",
  "travel-czech": "捷克"
};

var allPosts = [];      // 所有文章
var filtered = [];      // 篩選後文章
var currentIndex = 0;   // 已載入到第幾篇
var pageSize = 5;       // 每次載入幾篇文章

// 取得 URL category
function getCategoryFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

// 模糊比對地區關鍵字，篩選文章
function filterPosts(posts, { region }) {
  const unique = new Map(); // 用 Map 去重複，避免重複文章

  posts.forEach(post => {
    if (post.地區.includes(region)) {
      unique.set(post.序號, post); // 以序號為 key，避免重複
    }
  });

  return Array.from(unique.values());
}

// 渲染文章（分頁顯示）
function renderPosts(posts, startIndex, size) {
  var container = document.getElementById('blog-posts-container');
  var sliced = posts.slice(startIndex, startIndex + size);

  sliced.forEach(post => {
    var html = `
      <div class="post">
        <img src="${post.圖片連結}" alt="${post.圖片註解}" />
        <h3>${post.文章標題}</h3>
        <p>${post.文章摘要}</p>
        <a href="${post.文章連結}" target="_blank">閱讀更多</a>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  });
}

// 更新文章區標題顯示文章數
function updateTitle(count, keyword) {
  var titleEl = document.getElementById('blog-title');
  titleEl.textContent = keyword
    ? `共找到 ${count} 筆「${keyword}」相關文章`
    : `全部文章，共 ${count} 筆`;
}

// 顯示 / 隱藏「載入更多」按鈕
function updateLoadMoreButton(currentIndex, total) {
  var button = document.getElementById('load-more-posts');
  button.style.display = currentIndex < total ? 'block' : 'none';
}

// 頁面初次載入流程
document.addEventListener('DOMContentLoaded', function() {
  fetch('blog_posts.json')
    .then(res => res.json())
    .then(data => {
      allPosts = data;
      var category = getCategoryFromURL();
      var keyword = categoryToKeyword[category] || "";

      // 根據地區關鍵字模糊篩選
      filtered = keyword
        ? filterPosts(allPosts, { region: keyword })
        : data;

      // 初始化顯示狀態
      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;

      // 初次載入文章
      renderPosts(filtered, currentIndex, pageSize);
      currentIndex += pageSize;

      updateTitle(filtered.length, keyword);
      updateLoadMoreButton(currentIndex, filtered.length);
    });
});

// 載入更多按鈕功能
document.getElementById('load-more-posts').addEventListener('click', function() {
  renderPosts(filtered, currentIndex, pageSize);
  currentIndex += pageSize;
  updateLoadMoreButton(currentIndex, filtered.length);
});

// 語言切換時重新載入文章
if (typeof window !== 'undefined') {
  window.addEventListener('languageChanged', function() {
    document.getElementById('blog-posts-container').innerHTML = "";
    currentIndex = 0;

    renderPosts(filtered, currentIndex, pageSize);
    currentIndex += pageSize;

    updateLoadMoreButton(currentIndex, filtered.length);
  });
}
