fetch('blog_posts.json') // 或填上你的 JSON 檔案網址
  .then(res => res.json())
  .then(data => {
    let container = document.getElementById('blog-posts-container');
    data.forEach(row => {
      let html = `
        <article class="post-card">
          <img src="${row['圖片連結']}" alt="${row['圖片註解']}" class="w-full h-auto rounded-lg mb-6 shadow-md">
          <span class="text-sm text-gray-500 mb-2 block">${row['日期']} · ${row['地區']}</span>
          <h3 class="text-3xl font-semibold text-gray-900 mb-4">${row['文章標題']}</h3>
          <p class="text-gray-700 leading-relaxed mb-4">${row['文章摘要']}</p>
          <a href="${row['文章連結']}" class="text-indigo-600 hover:text-indigo-800 font-bold transition duration-300" target="_blank">
            閱讀更多 &rarr;
          </a>
          <div class="mt-4 flex flex-wrap gap-2">
            ${row['tag'].split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
          </div>
        </article>
      `;
      container.innerHTML += html;
    });
  });
