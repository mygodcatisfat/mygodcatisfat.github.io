// 取得 category（例："travel-tokyo"），這裡預設從網址 query string 取得
function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category'); // 例：travel-tokyo
}

// category 對應的關鍵字
const categoryToKeyword = {
  "travel-taiwan": "臺灣",
  "travel-osaka": "日本",
  "travel-tokyo": "東京",
  "travel-germany": "德國",
  "travel-austria": "奧地利",
  "travel-czech": "捷克"
  // 你可依 sidebar 類型自行增加
};

fetch('blog_posts.json')
  .then(res => res.json())
  .then(data => {
    let container = document.getElementById('blog-posts-container');

    // 根據 category 取得篩選關鍵字
    let category = getCategoryFromURL();
    let keyword = categoryToKeyword[category] || "";

    // 進行篩選：只要「地區」或「tag」欄位包含關鍵字就符合
    let filtered = keyword
      ? data.filter(row => {
          let region = row['地區'] || "";
          let tag = row['tag'] || "";
          // tag 欄位用全字串模糊搜尋（可自訂為陣列比對）
          return region.includes(keyword) || tag.includes(keyword);
        })
      : data;

    // 清空容器
    container.innerHTML = "";

    filtered.forEach(row => {
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
            ${(row['tag'] || '').split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
          </div>
        </article>
      `;
      container.innerHTML += html;
    });
  });
