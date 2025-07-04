document.addEventListener('DOMContentLoaded', function() {
  let filtered = [];
  let currentIndex = 0;
  const pageSize = 5;
  let allPosts = []; // 儲存所有文章資料

  // 取得翻譯文章欄位
  function getTranslatedBlogField(serial, field) {
    // field: 'title' 或 'summary'
    if (typeof translations === 'object' && translations[currentLanguage]) {
      const key = `blog_${serial}_${field}`;
      if (translations[currentLanguage][key]) {
        return translations[currentLanguage][key];
      }
    }
    return null;
  }
  
  function renderPosts(start, count) {
    // 確保翻譯已經載入才渲染
    if (!translations || !translations[currentLanguage]) return;
    
    let container = document.getElementById('blog-posts-container');
    const end = Math.min(start + count, filtered.length);
    for (let i = start; i < end; i++) {
      const row = filtered[i];
      const serial = row['序號'];
      const title = getTranslatedBlogField(serial, 'title') || row['文章標題'];
      const summary = getTranslatedBlogField(serial, 'summary') || row['文章摘要'];
      let html = `
        <article class="post-card">
          <img src="${row['圖片連結']}" alt="${row['圖片註解']}" class="w-full h-auto rounded-lg mb-6 shadow-md">
          <div class="post-content">
            <span class="text-sm text-gray-500 mb-2 block">${row['日期']} · ${row['地區']}</span>
            <h3 class="text-3xl font-semibold text-gray-900 mb-4">${title}</h3>
            <p class="text-gray-700 leading-relaxed mb-4">${summary}</p>
            <a href="${row['文章連結']}" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300" target="_blank">
              ${translations && translations[currentLanguage] && translations[currentLanguage]['read_more'] ? translations[currentLanguage]['read_more'] : '閱讀更多'} &rarr;
            </a>
            <div class="mt-4 flex flex-wrap gap-2">
              ${(row['tag'] || '').split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
            </div>
          </div>
        </article>
      `;
      container.innerHTML += html;
    }
    currentIndex = end;
    document.getElementById('load-more-posts').style.display = currentIndex >= filtered.length ? 'none' : 'block';
  }
  
  // 載入 blog_posts.json，只需一次
  fetch('blog_posts.json')
    .then(res => res.json())
    .then(data => {
      allPosts = data;
      filtered = allPosts; // 預設顯示全部
      currentIndex = 0;
      renderPosts(currentIndex, pageSize);
      updateTitle(""); // 預設標題
    });
  
  // 搜尋功能
  function filterPostsByKeyword(keyword) {
    keyword = keyword.trim();
    if (!keyword) {
      filtered = allPosts;
    } else {
      filtered = allPosts.filter(row => {
        let region = row['地區'] || "";
        let tag = row['tag'] || "";
        let summary = row['文章摘要'] || "";
        let title = row['文章標題'] || "";
        // 支援多欄位搜尋（可依需求增減）
        return region.includes(keyword) || tag.includes(keyword) || summary.includes(keyword) || title.includes(keyword);
      });
    }
    document.getElementById('blog-posts-container').innerHTML = "";
    currentIndex = 0;
    renderPosts(currentIndex, pageSize);
    updateTitle(keyword);
  }
  
  // 標題更新
  function updateTitle(keyword) {
    const titleElement = document.querySelector('h2[data-i18n="latest_posts_title"]');
    if (titleElement) {
      if (keyword) {
        titleElement.textContent = `總共搜尋到${filtered.length}篇${keyword}相關熱門文章`;
      } else {
        titleElement.textContent = `總共搜尋到${filtered.length}篇熱門文章`;
      }
    }
  }
  
  // 綁定搜尋按鈕
  document.getElementById('search-btn').addEventListener('click', function() {
    let keyword = document.getElementById('search-input').value;
    filterPostsByKeyword(keyword);
  });
  // 支援按 Enter 搜尋
  document.getElementById('search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      filterPostsByKeyword(this.value);
    }
  });
  
  // 載入更多
  document.getElementById('load-more-posts').addEventListener('click', function() {
    renderPosts(currentIndex, pageSize);
  });

  // 載入更多
  document.getElementById('load-more-posts').addEventListener('click', function() {
    renderPosts(currentIndex, pageSize);
  });

  // ⬇⬇⬇ 支援語言切換時自動重新渲染文章 ⬇⬇⬇
  if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', function() {
      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;
      renderPosts(currentIndex, pageSize);
    });
  }
  // ⬆⬆⬆ 支援語言切換 end ⬆⬆⬆
});
