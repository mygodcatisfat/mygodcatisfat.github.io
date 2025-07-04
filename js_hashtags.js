// 請確保 utils.js 已經先載入

var allPosts = [];
var filtered = [];
var currentIndex = 0;
var pageSize = 5;

// 載入所有標籤並建立側邊欄
function loadAllTags() {
  fetch('blog_posts.json')
    .then(function(res){ return res.json(); })
    .then(function(data){
      allPosts = data;

      // 收集所有文章的 tag，去除重複與前後空白
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

      // 輸出到側邊欄（製作成 button）
      var listEl = document.getElementById('hashtag-list');
      listEl.innerHTML = '';
      tags.forEach(function(tag){
        var tagText = tag.startsWith('#') ? tag.slice(1) : tag;
        var btn = document.createElement('button');
        btn.className = 'tag px-3 py-1 bg-yellow-200 hover:bg-yellow-300 rounded-full font-semibold transition';
        btn.textContent = tagText;
        btn.onclick = function(){ handleTagClick(tagText); };
        listEl.appendChild(btn);
      });
    })
    .catch(function(){
      document.getElementById('hashtag-list').innerText = '載入失敗';
    });
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
}

document.addEventListener('DOMContentLoaded', function(){
  loadAllTags();

  document.getElementById('load-more-posts').addEventListener('click', function () {
    renderPosts(filtered, currentIndex, pageSize);
    currentIndex += pageSize;
    updateLoadMoreButton(currentIndex, filtered.length);
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('languageChanged', function () {
      document.getElementById('blog-posts-container').innerHTML = "";
      currentIndex = 0;
      renderPosts(filtered, currentIndex, pageSize);
      updateLoadMoreButton(currentIndex, filtered.length);
    });
  }
});
