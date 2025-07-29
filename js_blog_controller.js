// 全部狀態集中管理，避免多份全域變數
window.appState = {
  allPosts: [],
  filtered: [],
  currentIndex: 0,
  pageSize: 5,
  mode: "all",      // "all" | "category" | "search" | "hashtag"
  keyword: "",
  tag: "",
  category: ""
};

// 分類對應關鍵字
const categoryToKeyword = {
  "travel-tokyo": "東京",
  "travel-taiwan": "臺灣",
  "travel-osaka": "大阪",
  "travel-germany": "德國",
  "travel-austria": "奧地利",
  "travel-czech": "捷克",
  "food-reviews": "食記"
};

// 工具：取得翻譯後欄位
function getTranslatedBlogField(serial, field) {
  if (typeof translations === 'object' && translations[currentLanguage]) {
    const key = `blog_${serial}_${field}`;
    if (translations[currentLanguage][key]) {
      return translations[currentLanguage][key];
    }
  }
  return null;
}

// 工具：文章渲染
function renderPosts(posts, start, count, containerId = 'blog-posts-container') {
  if (!translations || !translations[currentLanguage]) return;
  const container = document.getElementById(containerId);
  const end = Math.min(start + count, posts.length);
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

// 工具：文章篩選
function filterPosts(posts, options) {
  var keyword = options.keyword || '';
  var tag = options.tag || '';
  var region = options.region || '';
  return posts.filter(function(post){
    var cond = true;
    if (keyword) {
      cond = cond && (
        (post['地區'] || '').indexOf(keyword) !== -1 ||
        (post['tag'] || '').indexOf(keyword) !== -1 ||
        (post['文章摘要'] || '').indexOf(keyword) !== -1 ||
        (post['文章標題'] || '').indexOf(keyword) !== -1
      );
    }
    if (tag) {
      cond = cond && (post['tag'] || '').split(',').map(function(t){return t.trim().replace(/^#/, '');}).indexOf(tag) !== -1;
    }
    if (region) {
      cond = cond && (post['地區'] || '').indexOf(region) !== -1;
    }
    return cond;
  });
}

// 工具：更新標題
function updateTitle(filteredLength, keyword, containerSelector) {
  containerSelector = containerSelector || 'h2[data-i18n="search_result_title_without_keyword"], h2[data-i18n="search_result_title_with_keyword"]';
  var titleElement = document.querySelector(containerSelector);
  if (!titleElement) return;

  // 判斷用哪個 key
  var i18nKey = keyword ? "search_result_title_with_keyword" : "search_result_title_without_keyword";

  // 動態設置 data-i18n 屬性
  titleElement.setAttribute("data-i18n", i18nKey);

  // 從翻譯檔抓模板
  var langData = translations[currentLanguage] || translations["zh-Hant"];
  var template = langData[i18nKey] || "";

  // 套入動態參數
  var text = template.replace("{n}", filteredLength);
  if (keyword) text = text.replace("{keyword}", keyword);

  titleElement.textContent = text;
}

// 工具：控制「載入更多」按鈕
function updateLoadMoreButton(currentIndex, totalLength, btnId) {
  btnId = btnId || 'load-more-posts';
  var btn = document.getElementById(btnId);
  if (btn) btn.style.display = currentIndex >= totalLength ? 'none' : 'block';
}

// 工具：取得網址分類
function getCategoryFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

// 統一渲染入口：分類、搜尋、hashtag 都走這裡，避免資料混亂
function reloadAndRender({mode, keyword, tag, category}) {
  const state = window.appState;
  state.mode = mode || "all";
  state.keyword = keyword || "";
  state.tag = tag || "";
  state.category = category || "";
  let filtered = state.allPosts;

  if (mode === 'category' && category) {
    // 特殊處理「食記」分類，其餘分類正常用 region
    const regionKeyword = categoryToKeyword[category] || "";
    if (category === "food-reviews") {
      // 用 keyword 直接搜尋「食記」文章
      filtered = filterPosts(state.allPosts, {keyword: regionKeyword});
    } else {
      filtered = regionKeyword ? filterPosts(state.allPosts, {region: regionKeyword}) : state.allPosts;
    }
  } else if (mode === 'search' && keyword) {
    filtered = filterPosts(state.allPosts, {keyword});
  } else if (mode === 'hashtag' && tag) {
    filtered = filterPosts(state.allPosts, {tag});
  }

  state.filtered = filtered;
  state.currentIndex = 0;
  document.getElementById('blog-posts-container').innerHTML = "";
  renderPosts(filtered, 0, state.pageSize);
  updateTitle(filtered.length, keyword || tag || (categoryToKeyword[category] || ""));
  state.currentIndex = state.pageSize;
  updateLoadMoreButton(state.currentIndex, filtered.length);
}

// ====== 文章載入、搜尋、分頁、分類、hashtag整合 ======
function waitForTranslations(callback) {
  if (typeof translations === 'object' && typeof currentLanguage === 'string'
      && translations[currentLanguage]) {
    callback();
  } else {
    setTimeout(function() {
      waitForTranslations(callback);
    }, 50); // 每 50ms 檢查一次
  }
}

document.addEventListener('DOMContentLoaded', function() {
  waitForTranslations(function() {
    // 載入全部文章
    fetch('blog_posts.json')
      .then(res => res.json())
      .then(data => {
        window.appState.allPosts = data;
  
        // 預設抓網址參數（分類），否則全顯示
        var category = getCategoryFromURL();
        if (category) {
          reloadAndRender({mode: "category", category});
        } else {
          reloadAndRender({mode: "all"});
        }
  
        // 初始化 Hashtag 側邊欄
        loadAllTags(data);
      });

    // 註冊「載入更多」按鈕，只能一次
    document.getElementById('load-more-posts').onclick = function() {
      const state = window.appState;
      renderPosts(state.filtered, state.currentIndex, state.pageSize);
      state.currentIndex += state.pageSize;
      updateLoadMoreButton(state.currentIndex, state.filtered.length);
    };
  
    // 註冊搜尋功能
    document.getElementById('search-btn').onclick = function() {
      var keyword = document.getElementById('search-input').value;
      reloadAndRender({mode: "search", keyword});
    };
    document.getElementById('search-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        reloadAndRender({mode: "search", keyword: this.value});
      }
    });
  
    // 語言切換自動重載
    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', function() {
        const state = window.appState;
        document.getElementById('blog-posts-container').innerHTML = "";
        state.currentIndex = 0;
        renderPosts(state.filtered, 0, state.pageSize);
        updateLoadMoreButton(state.pageSize, state.filtered.length);
        state.currentIndex = state.pageSize;
      });
    }
  });
});

// ====== Hashtag 側邊欄 ======
function loadAllTags(allPosts) {
  // 收集所有 tag，去重
  var tagSet = {};
  allPosts.forEach(function(post){
    if (post.tag) {
      post.tag.split(',').forEach(function(tag){
        var cleanTag = tag.trim();
        if (cleanTag) tagSet[cleanTag] = true;
      });
    }
  });
  var tags = Object.keys(tagSet).sort();

  // 輸出到側邊欄（button 形式）
  var listEl = document.getElementById('hashtag-list');
  listEl.innerHTML = '';
  tags.forEach(function(tag){
    var tagText = tag.startsWith('#') ? tag.slice(1) : tag;
    var btn = document.createElement('button');
    btn.className = 'tag px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-full font-semibold transition';
    btn.textContent = tagText;
    btn.onclick = function(){ reloadAndRender({mode: "hashtag", tag: tagText}); };
    listEl.appendChild(btn);
  });
}

// ====== 側邊欄分類選單用法說明 ======
// 請將 travel.html 側邊欄 submenu-item 的 onclick 改成：
// <div class="submenu-item" onclick="reloadAndRender({mode: 'category', category: 'travel-tokyo'})">東京</div>
// 其它分類同理

// ====== END ======
