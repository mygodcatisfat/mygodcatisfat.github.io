// 處理主選單點擊後，滑順地滾動到指定區塊（如成員介紹、相簿等）
// nav 橫向卷軸預設最左側

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    if (nav) nav.scrollLeft = 0;

    // 動畫參數
    const SCROLL_DURATION = 1000;
    const easeOutQuad = t => t * (2 - t);

    nav?.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href').slice(1);
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;

            const startY = window.pageYOffset;
            const endY = targetElement.getBoundingClientRect().top + startY;
            const distance = endY - startY;
            let startTime = null;

            const animateScroll = currentTime => {
                if (!startTime) startTime = currentTime;
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / SCROLL_DURATION, 1);
                window.scrollTo(0, startY + distance * easeOutQuad(progress));
                if (elapsed < SCROLL_DURATION) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        });
    });
});
