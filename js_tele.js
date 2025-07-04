import { getTranslatedBlogField, renderPosts, filterPosts, updateLoadMoreButton, updateTitle } from './js_utils.js';


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

let allPosts = [];
let filtered = [];
let currentIndex = 0;
const pageSize = 5;

function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('blog_posts.json')
    .then(res => res.json())
    .then(data => {
      allPosts = data;
      let category = getCategoryFromURL();
      let keyword = categoryToKeyword[category] || "";

      filtered = keyword
        ? filterPosts(allPosts, { region: keyword })
        : allPosts;

      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;
      renderPosts(filtered, currentIndex, pageSize);
      updateTitle(filtered.length, keyword);
      currentIndex += pageSize;
      updateLoadMoreButton(currentIndex, filtered.length);
    });

  document.getElementById('load-more-posts').addEventListener('click', function() {
    renderPosts(filtered, currentIndex, pageSize);
    currentIndex += pageSize;
    updateLoadMoreButton(currentIndex, filtered.length);
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', function() {
      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;
      renderPosts(filtered, currentIndex, pageSize);
      updateLoadMoreButton(currentIndex, filtered.length);
    });
  }
});
