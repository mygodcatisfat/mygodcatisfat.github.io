document.addEventListener('DOMContentLoaded', function() {
  // 若有 category 參數，跳過渲染
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('category')) return;

  let allPosts = [];
  let filtered = [];
  let currentIndex = 0;
  const pageSize = 5;

  fetch('blog_posts.json')
    .then(res => res.json())
    .then(data => {
      allPosts = data;
      filtered = allPosts;

      // 清空容器並渲染前5篇
      const container = document.getElementById('blog-posts-container');
      container.innerHTML = "";
      renderPosts(filtered.slice(0, pageSize));
    });
});
