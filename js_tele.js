
// 請確保 utils.js 已經先載入

var categoryToKeyword = {
  "travel-tokyo": "東京",
  "travel-taiwan": "臺灣",
  "travel-osaka": "大阪",
  "travel-germany": "德國",
  "travel-austria": "奧地利",
  "travel-czech": "捷克"
};

var allPosts = [];
var filtered = [];
var currentIndex = 0;
var pageSize = 5;

function getCategoryFromURL() {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category');
}

document.addEventListener('DOMContentLoaded', function() {
  fetch('blog_posts.json')
    .then(function(res){ return res.json(); })
    .then(function(data){
      allPosts = data;
      var category = getCategoryFromURL();
      var keyword = categoryToKeyword[category] || "";

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
