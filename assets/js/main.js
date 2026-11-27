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
        var suffix = el.hasAttribute('data-suffix') ? el.getAttribute('data-suffix')
            : (/%$/.test(el.textContent.trim()) ? '%' : '');
        var start = null;
        function fmt(n) { return n.toLocaleString('en-US') + suffix; }
        function step(ts) {
            if (!start) start = ts;
            var t = Math.min((ts - start) / 1400, 1);
            el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - t, 3))));
            if (t < 1) requestAnimationFrame(step);
        }
        el.textContent = fmt(0);
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

    // ---- Statement text that fills in word by word while scrolling ----
    document.querySelectorAll('[data-fill]').forEach(function (el) {
        var words = el.textContent.trim().split(/\s+/);
        el.setAttribute('aria-label', el.textContent.trim());
        el.innerHTML = words.map(function (w) { return '<span class="fw" aria-hidden="true">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
        var spans = el.querySelectorAll('.fw');
        function update() {
            var r = el.getBoundingClientRect();
            var vh = window.innerHeight;
            var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
            var n = Math.round(Math.max(0, Math.min(1, p)) * spans.length);
            for (var i = 0; i < spans.length; i++) spans[i].classList.toggle('on', i < n);
        }
        if (reduceMotion) { spans.forEach(function (sp) { sp.classList.add('on'); }); return; }
        window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
        window.addEventListener('resize', update);
        update();
    });

    // ---- Case study pages: highlight the section in view ----
    var toc = document.querySelector('.case-toc');
    if (toc && 'IntersectionObserver' in window) {
        var tocLinks = toc.querySelectorAll('a[href^="#"]');
        var tocIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                tocLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id); });
            });
        }, { rootMargin: '-35% 0px -60% 0px' });
        tocLinks.forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) tocIO.observe(t); });
    }


    // ---- Phones: dots + counter for swipeable rows ----
    function setupSwipe(row) {
        var items = Array.prototype.filter.call(row.children, function (c) { return !c.classList.contains('gh-fallback'); });
        var old = row.nextElementSibling;
        if (old && old.classList.contains('swipe-dots')) old.remove();
        if (items.length < 2) return;
        var bar = document.createElement('div');
        bar.className = 'swipe-dots';
        bar.setAttribute('aria-hidden', 'true');
        var pad = function (n) { return (n < 10 ? '0' : '') + n; };
        bar.innerHTML = '<span class="sd-count"></span><span class="sd-dots">' +
            items.map(function () { return '<span></span>'; }).join('') + '</span><span class="sd-hint">Swipe →</span>';
        row.parentNode.insertBefore(bar, row.nextSibling);
        var dots = bar.querySelectorAll('.sd-dots span');
        var count = bar.querySelector('.sd-count');
        function update() {
            var step = items[1].offsetLeft - items[0].offsetLeft || 1;
            var i = Math.max(0, Math.min(items.length - 1, Math.round(row.scrollLeft / step)));
            dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
            count.textContent = pad(i + 1) + ' / ' + pad(items.length);
        }
        row.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
        update();
    }
    document.querySelectorAll('[data-swipe]').forEach(setupSwipe);
    window.__setupSwipe = setupSwipe;

    // ---- Latest GitHub repositories (live, public API) ----
    var ghBox = document.getElementById('ghRepos');
    if (ghBox && window.fetch) {
        var escHTML = function (t) { return String(t || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
        var ago = function (iso) {
            var days = Math.floor((Date.now() - new Date(iso).getTime()) / 864e5);
            if (days < 1) return 'today';
            if (days < 30) return days + (days === 1 ? ' day ago' : ' days ago');
            var months = Math.floor(days / 30);
            if (months < 12) return months + (months === 1 ? ' month ago' : ' months ago');
            var years = Math.floor(days / 365);
            return years + (years === 1 ? ' year ago' : ' years ago');
        };
        fetch('https://api.github.com/users/lazizjonalimov/repos?sort=pushed&per_page=12')
            .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
            .then(function (repos) {
                var list = repos.filter(function (r) { return !r.fork && r.name !== 'lazizjonalimov.github.io'; }).slice(0, 6);
                if (!list.length) throw new Error('empty');
                ghBox.innerHTML = list.map(function (r) {
                    return '<a class="gh-card" href="' + escHTML(r.html_url) + '" target="_blank" rel="noopener noreferrer">' +
                        '<h3><i class="far fa-folder" aria-hidden="true"></i>' + escHTML(r.name) + '</h3>' +
                        (r.description ? '<p>' + escHTML(r.description) + '</p>' : '') +
                        '<p class="gh-meta mono-meta">' + (r.language ? '<span class="gh-lang">' + escHTML(r.language) + '</span>' : '') +
                        '<span>Updated ' + ago(r.pushed_at) + '</span>' +
                        (r.stargazers_count ? '<span>★ ' + r.stargazers_count + '</span>' : '') + '</p></a>';
                }).join('');
                if (window.__setupSwipe) window.__setupSwipe(ghBox);
            })
            .catch(function () {
                ghBox.innerHTML = '<p class="gh-fallback">GitHub is not responding right now — <a href="https://github.com/lazizjonalimov" target="_blank" rel="noopener noreferrer">see all repositories on GitHub</a>.</p>';
            });
    }
})();
