// Theme toggle: add/remove 'dark' class on <html> and persist choice in localStorage
(function(){
    const THEME_KEY = 'site-theme';
    const toggleId = 'theme-toggle';

    function applyTheme(theme) {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        updateToggleIcon(theme);
    }

    function updateToggleIcon(theme) {
        const btn = document.getElementById(toggleId);
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (!icon) return;
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            btn.setAttribute('aria-pressed', 'true');
            btn.title = 'Switch to light mode';
        } else {
            icon.className = 'fas fa-moon';
            btn.setAttribute('aria-pressed', 'false');
            btn.title = 'Switch to dark mode';
        }
    }

    function init() {
        const btn = document.getElementById(toggleId);
        if (!btn) return;

        // Determine initial theme: localStorage -> prefers-color-scheme -> light
        let theme = localStorage.getItem(THEME_KEY);
        if (!theme) {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        applyTheme(theme);

        btn.addEventListener('click', function() {
            const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem(THEME_KEY, next);
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
