fetch("https://script.google.com/macros/s/你的scriptID/exec")
  .then(res => res.json())
  .then(posts => {
    // 依你的前端結構動態渲染
    const postsSection = document.getElementById("latest-posts-section");
    postsSection.innerHTML = posts.map(post => `
      <article class="post-card">
        <img src="${post.圖片連結}" alt="${post.標題}">
        <span>${post.日期} · ${post.分類}</span>
        <h3>${post.標題}</h3>
        <p>${post.摘要}</p>
        <a href="${post.文章連結}" target="_blank">閱讀更多</a>
      </article>
    `).join('');
  });
