// Neon constellation background for the hero section
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        return;
    }

    const hero = canvas.closest('.hero');
    const ctx = canvas.getContext('2d');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function hexToRgbTriplet(hex) {
        const clean = hex.trim().replace('#', '');
        const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
        const num = parseInt(full, 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    }

    function getThemeColors() {
        const cs = getComputedStyle(document.documentElement);
        return [
            hexToRgbTriplet(cs.getPropertyValue('--cyan') || '#22e0ff'),
            hexToRgbTriplet(cs.getPropertyValue('--violet') || '#a855f7'),
            hexToRgbTriplet(cs.getPropertyValue('--pink') || '#ff4fd8'),
        ];
    }

    let colors = getThemeColors();

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let running = true;
    let rafId = null;

    function countFor(w) {
        const density = w < 640 ? 16000 : 9000;
        return Math.max(24, Math.min(90, Math.floor((w * height) / density)));
    }

    function resize() {
        const rect = hero.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const target = countFor(width);
        if (particles.length === 0) {
            particles = Array.from({ length: target }, () => makeParticle());
        } else if (particles.length < target) {
            while (particles.length < target) particles.push(makeParticle());
        } else {
            particles.length = target;
        }
    }

    function makeParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            r: Math.random() * 1.6 + 0.8,
            color: colors[Math.floor(Math.random() * colors.length)],
        };
    }

    function step() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            const dxm = p.x - mouse.x;
            const dym = p.y - mouse.y;
            const distM = Math.sqrt(dxm * dxm + dym * dym);
            if (distM < 90) {
                const force = (90 - distM) / 90;
                p.x += (dxm / (distM || 1)) * force * 1.2;
                p.y += (dym / (distM || 1)) * force * 1.2;
            }
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.strokeStyle = `rgba(${a.color}, ${0.16 * (1 - dist / 130)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }

            const dxm = particles[i].x - mouse.x;
            const dym = particles[i].y - mouse.y;
            const distM = Math.sqrt(dxm * dxm + dym * dym);
            if (distM < 150) {
                ctx.strokeStyle = `rgba(${particles[i].color}, ${0.25 * (1 - distM / 150)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }

        particles.forEach((p) => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(${p.color}, 0.9)`;
            ctx.shadowColor = `rgba(${p.color}, 0.8)`;
            ctx.shadowBlur = 6;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;
    }

    function loop() {
        if (!running) {
            rafId = null;
            return;
        }
        step();
        rafId = requestAnimationFrame(loop);
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('themechange', function () {
        colors = getThemeColors();
        particles.forEach((p) => {
            p.color = colors[Math.floor(Math.random() * colors.length)];
        });
        if (prefersReducedMotion) {
            step();
        }
    });

    hero.addEventListener('mousemove', function (e) {
        const rect = hero.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', function () {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    if (prefersReducedMotion) {
        step();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            running = entry.isIntersecting;
            if (running && !rafId) {
                loop();
            }
        });
    }, { threshold: 0 });
    observer.observe(hero);

    loop();
}
