// Animated count ring per skill category — shows how many skills are
// listed in each category, scaled relative to the largest category.
function initSkillCountRings() {
    const categories = document.querySelectorAll('.skill-category');
    if (!categories.length) {
        return;
    }

    const counts = Array.from(categories).map((cat) => cat.querySelectorAll('.skill-item').length);
    const max = Math.max.apply(null, counts);
    const radius = 18;
    const circumference = 2 * Math.PI * radius;

    categories.forEach((cat, i) => {
        if (cat.querySelector('.skill-count-ring')) {
            return;
        }

        const count = counts[i];
        const fraction = max > 0 ? count / max : 0;
        const offset = circumference * (1 - fraction);

        const wrapper = document.createElement('div');
        wrapper.className = 'skill-count-ring';
        wrapper.setAttribute('aria-hidden', 'true');
        wrapper.innerHTML =
            '<svg viewBox="0 0 44 44" width="44" height="44">' +
            '<circle class="ring-track" cx="22" cy="22" r="' + radius + '"></circle>' +
            '<circle class="ring-fill" cx="22" cy="22" r="' + radius + '" ' +
            'style="stroke-dasharray:' + circumference + '; stroke-dashoffset:' + circumference + '"></circle>' +
            '</svg>' +
            '<span class="skill-count-number">' + count + '</span>';

        cat.appendChild(wrapper);

        const ringFill = wrapper.querySelector('.ring-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    ringFill.style.transition = 'stroke-dashoffset 1.2s ease';
                    requestAnimationFrame(() => {
                        ringFill.style.strokeDashoffset = offset;
                    });
                    observer.disconnect();
                }
            });
        }, { threshold: 0.4 });

        observer.observe(cat);
    });
}
