/*
複製相簿內圖片，讓輪播動畫可以無縫循環
*/
document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.querySelector('.gallery-marquee');
    if (marquee) marquee.innerHTML += marquee.innerHTML;
});
