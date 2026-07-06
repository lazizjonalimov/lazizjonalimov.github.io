// Fills the experience timeline's glowing line in step with scroll position
function initTimelineProgress() {
    const timeline = document.querySelector('.experience-timeline');
    const progressLine = document.querySelector('.timeline-progress');
    if (!timeline || !progressLine) {
        return;
    }

    let ticking = false;

    function update() {
        ticking = false;
        const rect = timeline.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.85;
        const end = vh * 0.15;
        const span = rect.height + start - end;
        let progress = span > 0 ? (start - rect.top) / span : 0;
        progress = Math.max(0, Math.min(1, progress));
        progressLine.style.height = (progress * 100) + '%';
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
}
