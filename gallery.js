/*
複製相簿內圖片，讓輪播動畫可以無縫循環
*/

// 當 DOM 內容載入完成時執行
document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.querySelector('.gallery-marquee');
    // 確保元素存在且有內容才進行無縫複製
    if (marquee && marquee.innerHTML.trim() !== '') {
        marquee.innerHTML += marquee.innerHTML;
    }
});
