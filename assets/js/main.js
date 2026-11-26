// main.js — theme toggle, mobile menu, active-section highlight and scroll reveal.
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
        if (meta) meta.setAttribute('content', isLight() ? '#F2F2F2' : '#111111');
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
        document.addEventListener('click', function (e) {
            if (nav.classList.contains('open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
        });
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

    // ---- Split big headings into words for a staggered rise ----
    document.querySelectorAll('.section-title, .hero-title, .contact-title').forEach(function (el) {
        var i = 0;
        Array.prototype.slice.call(el.childNodes).forEach(function (node) {
            if (node.nodeType !== 3 || !node.textContent.trim()) return;
            var frag = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach(function (part) {
                if (!part) return;
                if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                var w = document.createElement('span');
                w.className = 'w';
                var inner = document.createElement('span');
                inner.style.setProperty('--i', i++);
                inner.textContent = part;
                w.appendChild(inner);
                frag.appendChild(w);
            });
            el.replaceChild(frag, node);
        });
        el.classList.add('split-words');
    });

    // ---- Count up the numbers in the stats card ----
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (reduceMotion || isNaN(target)) return;
        var start = null;
        function step(ts) {
            if (!start) start = ts;
            var t = Math.min((ts - start) / 1200, 1);
            el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + '%';
            if (t < 1) requestAnimationFrame(step);
        }
        el.textContent = '0%';
        requestAnimationFrame(step);
    }

    // ---- Reveal elements as they scroll into view ----
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var revealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    entry.target.querySelectorAll('[data-count]').forEach(countUp);
                    revealer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -8% 0px' });
        revealEls.forEach(function (el) { revealer.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('in'); });
    }

    // ---- Back-to-top button (shown on mobile after scrolling) ----
    var toTop = document.getElementById('toTop');
    if (toTop) {
        window.addEventListener('scroll', function () {
            toTop.classList.toggle('show', window.scrollY > 600);
        }, { passive: true });
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- Scroll progress bar and header shadow ----
    var bar = document.getElementById('scrollBar');
    var header = document.querySelector('.site-header');
    var ticking = false;
    function onScroll() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
        if (header) header.classList.toggle('scrolled', window.scrollY > 20);
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    // ---- Pause / play the hero marquee ----
    var mToggle = document.getElementById('marqueeToggle');
    var marquee = document.querySelector('.hero-marquee');
    if (mToggle && marquee) {
        mToggle.addEventListener('click', function () {
            var paused = marquee.classList.toggle('paused');
            mToggle.setAttribute('aria-pressed', String(paused));
            mToggle.querySelector('i').className = 'fas ' + (paused ? 'fa-play' : 'fa-pause');
            mToggle.querySelector('span').textContent = paused ? 'Play motion' : 'Pause motion';
        });
    }

    // ---- Copy email to clipboard ----
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var text = btn.getAttribute('data-copy');
            var label = btn.querySelector('.copy-label');
            function done(ok) {
                label.textContent = ok ? 'Copied' : 'Copy failed';
                btn.classList.toggle('done', ok);
                setTimeout(function () { label.textContent = 'Copy'; btn.classList.remove('done'); }, 1800);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
            } else { done(false); }
        });
    });
})();
