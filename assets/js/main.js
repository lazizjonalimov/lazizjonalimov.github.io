// main.js — theme toggle, mobile menu and active-section highlighting.
(function () {
    var root = document.documentElement;

    // ---- Theme (light by default, dark when chosen) ----
    var toggle = document.getElementById('themeToggle');
    function isLight() { return root.getAttribute('data-theme') === 'light'; }
    function syncToggle() {
        if (!toggle) return;
        var label = isLight() ? 'Switch to dark mode' : 'Switch to light mode';
        toggle.setAttribute('aria-label', label);
        toggle.setAttribute('title', label);
        toggle.setAttribute('aria-pressed', String(isLight()));
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', isLight() ? '#FAFAF7' : '#0E1014');
    }
    if (toggle) {
        toggle.addEventListener('click', function () {
            if (isLight()) {
                root.removeAttribute('data-theme');
                try { localStorage.setItem('theme', 'dark'); } catch (e) {}
            } else {
                root.setAttribute('data-theme', 'light');
                try { localStorage.setItem('theme', 'light'); } catch (e) {}
            }
            syncToggle();
        });
    }
    syncToggle();

    // ---- Mobile menu ----
    var menuBtn = document.getElementById('menuToggle');
    var nav = document.getElementById('site-nav');
    function closeMenu() {
        if (!nav) return;
        nav.classList.remove('open');
        if (menuBtn) {
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Open menu');
        }
    }
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
        nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') closeMenu(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    }

    // ---- Highlight the nav link for the section in view ----
    if ('IntersectionObserver' in window && nav) {
        var links = {};
        nav.querySelectorAll('a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var link = links[entry.target.id];
                if (!link) return;
                if (entry.isIntersecting) {
                    Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
                    link.classList.add('active');
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });
        Object.keys(links).forEach(function (id) {
            var el = document.getElementById(id);
            if (el) io.observe(el);
        });
    }
})();
