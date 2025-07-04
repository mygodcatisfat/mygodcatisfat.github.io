// 請確保 utils.js 已經先載入

var allPosts = [];
var filtered = [];
var currentIndex = 0;
var pageSize = 5;

function filterPostsByKeyword(keyword) {
  keyword = keyword.trim();
  filtered = filterPosts(allPosts, { keyword: keyword });
  document.getElementById('blog-posts-container').innerHTML = "";
  currentIndex = 0;
  renderPosts(filtered, currentIndex, pageSize);
  updateTitle(filtered.length, keyword);
  currentIndex += pageSize;
  updateLoadMoreButton(currentIndex, filtered.length);
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('blog_posts.json')
    .then(function(res){ return res.json(); })
    .then(function(data){
      allPosts = data;
      filtered = allPosts;
      currentIndex = 0;
      renderPosts(filtered, currentIndex, pageSize);
      updateTitle(filtered.length, "");
      currentIndex += pageSize;
      updateLoadMoreButton(currentIndex, filtered.length);
    });

  document.getElementById('search-btn').addEventListener('click', function() {
    var keyword = document.getElementById('search-input').value;
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
