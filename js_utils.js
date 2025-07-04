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
  let container = document.getElementById(containerId);
  const end = Math.min(start + count, posts.length);
  for (let i = start; i < end; i++) {
    const post = posts[i];
    const serial = post['序號'];
    const title = getTranslatedBlogField(serial, 'title') || post['文章標題'];
    const summary = getTranslatedBlogField(serial, 'summary') || post['文章摘要'];
    let html = `
      <article class="post-card">
        <img src="${post['圖片連結']}" alt="${post['圖片註解'] || ''}" class="w-full h-auto rounded-lg mb-6 shadow-md">
        <div class="post-content">
          <span class="text-sm text-gray-500 mb-2 block">${post['日期'] || ''} · ${post['地區'] || ''}</span>
          <h3 class="text-3xl font-semibold text-gray-900 mb-4">${title}</h3>
          <p class="text-gray-700 leading-relaxed mb-4">${summary}</p>
          <a href="${post['文章連結'] || '#'}" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300" target="_blank">
            ${(translations && translations[currentLanguage] && translations[currentLanguage]['read_more']) ? translations[currentLanguage]['read_more'] : '閱讀更多'} &rarr;
          </a>
          <div class="mt-4 flex flex-wrap gap-2">
            ${(post['tag'] || '').split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
          </div>
        </div>
      </article>
    `;
    container.innerHTML += html;
  }
}

// 通用工具：文章篩選（多條件）
function filterPosts(posts, { keyword = '', tag = '', region = '' }) {
  return posts.filter(post => {
    let cond = true;
    if (keyword) {
      cond = cond && (
        (post['地區'] || '').includes(keyword) ||
        (post['tag'] || '').includes(keyword) ||
        (post['文章摘要'] || '').includes(keyword) ||
        (post['文章標題'] || '').includes(keyword)
      );
    }
    if (tag) {
      cond = cond && (post['tag'] || '').split(',').map(t => t.trim().replace(/^#/, '')).includes(tag);
    }
    if (region) {
      cond = cond && (post['地區'] || '').includes(region);
    }
    return cond;
  });
}

// 分頁控制
function updateLoadMoreButton(currentIndex, totalLength, btnId = 'load-more-posts') {
  const btn = document.getElementById(btnId);
  if (btn) btn.style.display = currentIndex >= totalLength ? 'none' : 'block';
}

// 標題更新
function updateTitle(filteredLength, keyword = '', containerSelector = 'h2[data-i18n="latest_posts_title"]') {
  const titleElement = document.querySelector(containerSelector);
  if (titleElement) {
    if (keyword) {
      titleElement.textContent = `總共搜尋到${filteredLength}篇${keyword}相關熱門文章`;
    } else {
      titleElement.textContent = `總共搜尋到${filteredLength}篇熱門文章`;
    }
  }
}

export { getTranslatedBlogField, renderPosts, filterPosts, updateLoadMoreButton, updateTitle };
