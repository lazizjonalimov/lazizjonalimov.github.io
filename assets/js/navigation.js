// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Navbar shrink on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

// Use requestAnimationFrame for better performance
let ticking = false;
window.addEventListener("scroll", function() {
    if (!ticking) {
        requestAnimationFrame(function() {
            handleNavbarScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Also call on page load to ensure correct initial state
document.addEventListener('DOMContentLoaded', function() {
    handleNavbarScroll();
});

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Light/Dark mode toggle button (fixed bottom-right, always visible)
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) {
        return;
    }

    const root = document.documentElement;

    function labelFor(theme) {
        return theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    }

    function applyLabel() {
        const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        const label = labelFor(current);
        toggleBtn.setAttribute('aria-label', label);
        toggleBtn.setAttribute('title', label);
        toggleBtn.setAttribute('aria-pressed', String(current === 'light'));

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute('content', current === 'light' ? '#f6f6fb' : '#08080d');
        }
    }

    // Reflect whatever theme the inline head script already applied
    applyLabel();

    // Toggle theme when button is clicked
    toggleBtn.addEventListener('click', function() {
        const isLight = root.getAttribute('data-theme') === 'light';
        if (isLight) {
            root.removeAttribute('data-theme');
            try { localStorage.setItem('theme', 'dark'); } catch (e) {}
        } else {
            root.setAttribute('data-theme', 'light');
            try { localStorage.setItem('theme', 'light'); } catch (e) {}
        }
        applyLabel();
        window.dispatchEvent(new Event('themechange'));
    });
}
