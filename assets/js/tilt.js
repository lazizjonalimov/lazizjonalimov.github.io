// 3D tilt + cursor spotlight for glass cards
function initTiltCards() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
        return;
    }

    const selector = '.project-card, .skill-category, .education-card, .experience-title, .experience-positions, .contact-info-card, .contact-form-card';
    document.querySelectorAll(selector).forEach(function (card) {
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * 10;
            const rotateX = (0.5 - py) * 10;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            card.style.setProperty('--pointer-x', `${px * 100}%`);
            card.style.setProperty('--pointer-y', `${py * 100}%`);
            card.style.setProperty('--spotlight-opacity', '1');
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
            card.style.setProperty('--spotlight-opacity', '0');
        });
    });
}
