document.addEventListener('DOMContentLoaded', () => {
    const marquee = document.querySelector('.gallery-marquee');
    if (marquee) marquee.innerHTML += marquee.innerHTML;
});