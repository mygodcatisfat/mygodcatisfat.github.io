// 通用工具：翻譯文章欄位
function getTranslatedBlogField(serial, field) {
  if (typeof translations === 'object' && translations[currentLanguage]) {
    const key = `blog_${serial}_${field}`;
    if (translations[currentLanguage][key]) {
      return translations[currentLanguage][key];
    }
  }
  return null;
}

// 通用工具：文章渲染
function renderPosts(posts, start, count, containerId = 'blog-posts-container') {
  if (!translations || !translations[currentLanguage]) return;
  var container = document.getElementById(containerId);
  var end = Math.min(start + count, posts.length);
  for (var i = start; i < end; i++) {
    var post = posts[i];
    var serial = post['序號'];
    var title = getTranslatedBlogField(serial, 'title') || post['文章標題'];
    var summary = getTranslatedBlogField(serial, 'summary') || post['文章摘要'];
    var html = `
      <article class="post-card">
        <img src="${post['圖片連結']}" alt="${post['圖片註解'] || ''}" class="w-full aspect-square rounded-lg mb-6 shadow-md bg-white hover:shadow-lg transition duration-300">
        <div class="post-content">
          <span class="text-sm text-gray-500 mb-2 block">${post['日期'] || ''} · ${post['地區'] || ''}</span>
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

// 通用工具：文章篩選（多條件）
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

// 分頁控制
function updateLoadMoreButton(currentIndex, totalLength, btnId) {
  btnId = btnId || 'load-more-posts';
  var btn = document.getElementById(btnId);
  if (btn) btn.style.display = currentIndex >= totalLength ? 'none' : 'block';
}

// 標題更新
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
