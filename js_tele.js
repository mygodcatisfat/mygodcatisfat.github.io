// 取得 category（例："travel-tokyo"），這裡預設從網址 query string 取得
function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('category'); // 例：travel-tokyo
}

// category 對應的關鍵字
const categoryToKeyword = {
  "travel-tokyo": "東京",
  "travel-taiwan": "臺灣",
  "travel-osaka": "大阪",
  "travel-germany": "德國",
  "travel-austria": "奧地利",
  "travel-czech": "捷克",
  // 你可依 sidebar 需求自由擴充
};

let filtered = [];
let currentIndex = 0;
const pageSize = 5;

function renderPosts(start, count) {
  let container = document.getElementById('blog-posts-container');
  const end = Math.min(start + count, filtered.length);
  for (let i = start; i < end; i++) {
    const row = filtered[i];
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
  }
  currentIndex = end;
  // 控制按鈕顯示
  const loadMoreBtn = document.getElementById('load-more-posts');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = currentIndex >= filtered.length ? 'none' : 'block';
  }
}

fetch('blog_posts.json')
  .then(res => res.json())
  .then(data => {
    let container = document.getElementById('blog-posts-container');
    let category = getCategoryFromURL();
    let keyword = categoryToKeyword[category] || "";

    // 進行篩選：只要「地區」或「tag」欄位包含關鍵字就符合
    filtered = keyword
      ? data.filter(row => {
          let region = row['地區'] || "";
          let tag = row['tag'] || "";
          return region.includes(keyword) || tag.includes(keyword);
        })
      : data;

    // 清空容器
    container.innerHTML = "";

    // 初始載入5篇
    currentIndex = 0;
    renderPosts(currentIndex, pageSize);

    // 按鈕狀態更新（如果一開始就沒文章或少於5篇）
    const loadMoreBtn = document.getElementById('load-more-posts');
    if (loadMoreBtn) {
      loadMoreBtn.style.display = filtered.length > pageSize ? 'block' : (filtered.length === 0 ? 'none' : 'block');
    }
  });

// 綁定「載入更多」按鈕
document.addEventListener('DOMContentLoaded', function() {
  const loadMoreBtn = document.getElementById('load-more-posts');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      renderPosts(currentIndex, pageSize);
    });
  }
});
