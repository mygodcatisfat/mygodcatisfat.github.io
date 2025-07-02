// 控制「回到最上方」按鈕的動畫滾動效果
document.getElementById('back-to-top').addEventListener('click', function() {
    const startPosition = window.pageYOffset;
    const distance = -startPosition;
    const duration = 800;
    let start = null;
    function easeOutQuad(t) { return t * (2 - t); }
    function scrollTopAnimation(currentTime) {
        if (!start) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        window.scrollTo(0, startPosition + distance * easedProgress);
        if (timeElapsed < duration) requestAnimationFrame(scrollTopAnimation);
    }
    requestAnimationFrame(scrollTopAnimation);
});
