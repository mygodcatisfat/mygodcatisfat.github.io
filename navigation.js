/*
處理主選單點擊後，滑順地滾動到指定區塊（如成員介紹、相簿等）
*/
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        function easeOutQuad(t) { return t * (2 - t); }
        function animation(currentTime) {
            if (!start) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeOutQuad(progress);
            window.scrollTo(0, startPosition + distance * easedProgress);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        requestAnimationFrame(animation);
    });
});
