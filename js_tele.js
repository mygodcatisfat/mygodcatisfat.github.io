// 請確保只載入 js_tele.js 主控文章渲染，其他如 js_search_article.js、js_hashtags.js 請勿同時載入
// 以避免全域變數覆蓋及事件重複註冊問題

/**
 * 分類對應關鍵字
 */
var categoryToKeyword = {
  "travel-tokyo": "東京",
  "travel-taiwan": "臺灣",
  "travel-osaka": "大阪",
  "travel-germany": "德國",
  "travel-austria": "奧地利",
  "travel-czech": "捷克"
};

// 全域變數，所有文章、篩選後文章、載入進度
var allPosts = [];        // 存所有文章
var filtered = [];        // 存篩選後文章
var currentIndex = 0;     // 目前已經載入到第幾篇
var pageSize = 5;         // 每頁顯示幾篇

/**
 * 從網址取得 category 參數
 */
function getCategoryFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

/**
 * 渲染頁面文章（僅追加新文章，不重複渲染）
 */
function renderPostsOnce(posts, start, count, containerId = 'blog-posts-container') {
  // 若語系未載入，則不渲染
  if (!translations || !translations[currentLanguage]) return;
  var container = document.getElementById(containerId);
  var end = Math.min(start + count, posts.length);

  // 只渲染[start,end)區間的文章
  for (let i = start; i < end; i++) {
    const post = posts[i];
    const serial = post['序號'];
    const title = getTranslatedBlogField(serial, 'title') || post['文章標題'];
    const summary = getTranslatedBlogField(serial, 'summary') || post['文章摘要'];
    const place = getTranslatedBlogField(serial, 'place') || post['地區'];
    const html = `
      <article class="post-card">
        <img src="${post['圖片連結']}" alt="${post['圖片註解'] || ''}" class="w-full aspect-square rounded-lg mb-6 shadow-md bg-white hover:shadow-lg transition duration-300">
        <div class="post-content">
          <span class="text-sm text-gray-500 mb-2 block">${post['日期'] || ''} · ${place}</span>
          <h3 class="text-3xl font-semibold text-gray-900 mb-4">${title}</h3>
          <p class="text-gray-700 leading-relaxed mb-4">${summary}</p>
          <a href="${post['文章連結'] || '#'}" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300" target="_blank">
            ${(translations && translations[currentLanguage] && translations[currentLanguage]['read_more']) ? translations[currentLanguage]['read_more'] : '閱讀更多'} &rarr;
          </a>
          <div class="mt-4 flex flex-wrap gap-2">
            ${(post['tag'] || '').split(',').map(function(tag){return `<span class="tag">${tag.trim()}</span>`;}).join('')}
          </div>
        </div>
      </article>
    `;
    container.innerHTML += html;
  }
}

/**
 * 初始化主流程
 */
document.addEventListener('DOMContentLoaded', function() {
  // 只讓主控流程處理 blog-posts-container
  fetch('blog_posts.json')
    .then(function(res){ return res.json(); })
    .then(function(data){
      allPosts = data;

      // 根據網址 category 決定篩選關鍵字
      var category = getCategoryFromURL();
      var keyword = categoryToKeyword[category] || "";

      // 篩選資料（如果有分類，則依 region 篩選，否則全部顯示）
      filtered = keyword
        ? filterPosts(allPosts, { region: keyword })
        : allPosts;

      // 清空 container、重設 currentIndex
      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;

      // 只渲染前 pageSize 篇
      renderPostsOnce(filtered, currentIndex, pageSize);
      updateTitle(filtered.length, keyword);
      currentIndex += pageSize;

      // 控制 load more 按鈕顯示狀態
      updateLoadMoreButton(currentIndex, filtered.length);
    });

  // 註冊 load more 按鈕，只能註冊一次
  document.getElementById('load-more-posts').onclick = function() {
    renderPostsOnce(filtered, currentIndex, pageSize);
    currentIndex += pageSize;
    updateLoadMoreButton(currentIndex, filtered.length);
  };

  // 語言切換時重新渲染文章（不重複載入！）
  if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', function() {
      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;
      renderPostsOnce(filtered, currentIndex, pageSize);
      updateLoadMoreButton(currentIndex, filtered.length);
    });
  }
});

/**
 * 工具：篩選文章（多條件，使用 utils.js 實作）
 * 工具：更新標題
 * 工具：更新 load more 按鈕狀態
 * 這些函式如果 utils.js 已經有，直接使用即可
 */

// 如果 utils.js 未提供，以下為範例實作

function updateLoadMoreButton(currentIndex, totalLength, btnId) {
  btnId = btnId || 'load-more-posts';
  var btn = document.getElementById(btnId);
  if (btn) btn.style.display = currentIndex >= totalLength ? 'none' : 'block';
}

function updateTitle(filteredLength, keyword, containerSelector) {
  containerSelector = containerSelector || 'h2[data-i18n="latest_posts_title"]';
  var titleElement = document.querySelector(containerSelector);
  if (titleElement) {
    if (keyword) {
      titleElement.textContent = '總共搜尋到' + filteredLength + '篇' + keyword + '相關熱門文章';
    } else {
      titleElement.textContent = '總共搜尋到' + filteredLength + '篇熱門文章';
    }
  }
}
