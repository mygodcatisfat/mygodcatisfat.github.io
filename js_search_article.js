import { getTranslatedBlogField, renderPosts, filterPosts, updateLoadMoreButton, updateTitle } from './js_utils.js';

let allPosts = [];
let filtered = [];
let currentIndex = 0;
const pageSize = 5;

function filterPostsByKeyword(keyword) {
  keyword = keyword.trim();
  filtered = filterPosts(allPosts, { keyword });
  document.getElementById('blog-posts-container').innerHTML = "";
  currentIndex = 0;
  renderPosts(filtered, currentIndex, pageSize);
  updateTitle(filtered.length, keyword);
  currentIndex += pageSize;
  updateLoadMoreButton(currentIndex, filtered.length);
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('blog_posts.json')
    .then(res => res.json())
    .then(data => {
      allPosts = data;
      filtered = allPosts;
      currentIndex = 0;
      renderPosts(filtered, currentIndex, pageSize);
      updateTitle(filtered.length, "");
      currentIndex += pageSize;
      updateLoadMoreButton(currentIndex, filtered.length);
    });

  document.getElementById('search-btn').addEventListener('click', function() {
    let keyword = document.getElementById('search-input').value;
    filterPostsByKeyword(keyword);
  });

  document.getElementById('search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      filterPostsByKeyword(this.value);
    }
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
