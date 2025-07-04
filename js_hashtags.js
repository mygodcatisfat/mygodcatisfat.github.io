import { getTranslatedBlogField, renderPosts, filterPosts, updateLoadMoreButton, updateTitle } from './js_utils.js';

let allPosts = [];
let filtered = [];
let currentIndex = 0;
const pageSize = 5;

// 載入所有標籤並建立側邊欄
async function loadAllTags() {
  try {
    const res = await fetch('blog_posts.json');
    allPosts = await res.json();

    // 收集所有文章的 tag，去除重複與前後空白
    const tagSet = new Set();
    allPosts.forEach(post => {
      if (post.tag) {
        post.tag.split(',').forEach(tag => {
          const cleanTag = tag.trim();
          if (cleanTag) tagSet.add(cleanTag);
        });
      }
    });

    // 排序 tag
    const tags = Array.from(tagSet).sort();

    // 輸出到側邊欄（製作成 button）
    const listEl = document.getElementById('hashtag-list');
    listEl.innerHTML = '';
    tags.forEach(tag => {
      const tagText = tag.startsWith('#') ? tag.slice(1) : tag;
      const btn = document.createElement('button');
      btn.className = 'tag px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-full font-semibold transition';
      btn.textContent = tagText;
      btn.onclick = () => handleTagClick(tagText);
      listEl.appendChild(btn);
    });
  } catch (e) {
    document.getElementById('hashtag-list').innerText = '載入失敗';
  }
}

// 點擊 tag，顯示相關文章
function handleTagClick(tagText) {
  if (!translations || !translations[currentLanguage]) return;
  filtered = filterPosts(allPosts, { tag: tagText });
  currentIndex = 0;
  document.getElementById('blog-posts-container').innerHTML = '';
  renderPosts(filtered, currentIndex, pageSize);
  updateTitle(filtered.length, tagText);
  currentIndex += pageSize;
  updateLoadMoreButton(currentIndex, filtered.length);

  // 隱藏「載入更多」按鈕（如需可取消註解）
  // updateLoadMoreButton(filtered.length, filtered.length);
}

// 分頁
document.addEventListener('DOMContentLoaded', () => {
  loadAllTags();

  document.getElementById('load-more-posts').addEventListener('click', function () {
    renderPosts(filtered, currentIndex, pageSize);
    currentIndex += pageSize;
    updateLoadMoreButton(currentIndex, filtered.length);
  });

  // 語言切換時自動重新渲染
  if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', function () {
      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;
      renderPosts(filtered, currentIndex, pageSize);
      updateLoadMoreButton(currentIndex, filtered.length);
    });
  }
});
