// backToTop.js
// 優化「回到最上方」平滑滾動效果

// 快取 DOM 元素
const backToTopBtn = document.getElementById('back-to-top');

// 設定動畫時長（毫秒）
const duration = 800;

// Easing 函式：easeOutQuad
const easeOutQuad = t => t * (2 - t);

// 點擊按鈕時觸發平滑滾動
backToTopBtn.addEventListener('click', () => {
  const startY = window.pageYOffset;
  const startTime = performance.now();

  // 動畫迴圈
  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 計算滾動位置
    window.scrollTo(0, startY * (1 - easeOutQuad(progress)));

    // 若未完成，持續下一幀
    if (progress < 1) requestAnimationFrame(animate);
  }

  // 啟動動畫
  requestAnimationFrame(animate);
});
