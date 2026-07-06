// Add loading animation
function initLoadingAnimation() {
    window.addEventListener('load', function() {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--void);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        `;

        const spinner = document.createElement('div');
        spinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid rgba(244, 244, 249, 0.15);
            border-top: 3px solid var(--cyan);
            box-shadow: 0 0 20px rgba(34, 224, 255, 0.5);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;
        
        loader.appendChild(spinner);
        document.body.appendChild(loader);
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
}

// Neon glow cursor: a trailing ring that scales/glows over interactive elements
function initCursorTrail() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
        return;
    }

    const ring = document.createElement('div');
    ring.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 32px;
        height: 32px;
        margin: -16px 0 0 -16px;
        border-radius: 50%;
        border: 1.5px solid var(--cyan);
        box-shadow: 0 0 16px rgba(34, 224, 255, 0.6);
        pointer-events: none;
        z-index: 10000;
        transition: border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        transform: translate(-100px, -100px);
        opacity: 0;
        will-change: transform;
    `;

    const dot = document.createElement('div');
    dot.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 6px;
        height: 6px;
        margin: -3px 0 0 -3px;
        border-radius: 50%;
        background: var(--cyan);
        box-shadow: 0 0 8px rgba(34, 224, 255, 0.8);
        pointer-events: none;
        z-index: 10000;
        transform: translate(-100px, -100px);
        will-change: transform;
    `;

    document.body.appendChild(ring);
    document.body.appendChild(dot);

    let ringX = 0, ringY = 0, targetX = 0, targetY = 0;
    let scale = 1;
    let visible = false;
    let hovering = false;

    document.addEventListener('mousemove', function(e) {
        targetX = e.clientX;
        targetY = e.clientY;
        dot.style.transform = `translate(${targetX}px, ${targetY}px)`;
        if (!visible) {
            visible = true;
            ring.style.opacity = '1';
            ringX = targetX;
            ringY = targetY;
        }
    });

    (function follow() {
        ringX += (targetX - ringX) * 0.18;
        ringY += (targetY - ringY) * 0.18;
        scale += ((hovering ? 1.8 : 1) - scale) * 0.2;
        ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(${scale})`;
        requestAnimationFrame(follow);
    })();

    const interactiveSelector = 'a, button, .btn, .skill-item, .project-card, .social-link, .nav-cta, input, textarea';

    document.addEventListener('mouseover', function(e) {
        if (e.target.closest(interactiveSelector)) {
            hovering = true;
            ring.style.borderColor = 'var(--pink)';
            ring.style.boxShadow = '0 0 22px rgba(255, 79, 216, 0.7)';
        }
    });

    document.addEventListener('mouseout', function(e) {
        if (e.target.closest(interactiveSelector)) {
            hovering = false;
            ring.style.borderColor = 'var(--cyan)';
            ring.style.boxShadow = '0 0 16px rgba(34, 224, 255, 0.6)';
        }
    });
}

// Magnetic pull effect for primary buttons
function initMagneticButtons() {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) {
        return;
    }

    document.querySelectorAll('.btn, .nav-cta, .theme-toggle').forEach(function(el) {
        el.addEventListener('mousemove', function(e) {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', function() {
            el.style.transform = '';
        });
    });
}

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--gradient-full);
        box-shadow: 0 0 12px rgba(34, 224, 255, 0.6);
        z-index: 10000;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Add keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add focus styles for keyboard navigation
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid var(--cyan) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(focusStyle);
}

// Add experience icon animation on company name hover (fallback for browsers without :has() support)
function initExperienceIconAnimation() {
    // Check if :has() is supported
    const hasSelectorSupported = CSS.supports('selector(:has(*))');
    
    if (!hasSelectorSupported) {
        const setupAnimation = () => {
            // Fallback for browsers without :has() support
            // Target the company name text specifically (h3 or company-link)
            const companyNames = document.querySelectorAll('.experience-title h3:not([data-animation-setup]), .experience-title .company-link:not([data-animation-setup])');
            
            companyNames.forEach(companyName => {
                const experienceHeader = companyName.closest('.experience-header');
                const experienceIcon = experienceHeader?.querySelector('.experience-icon');
                
                if (experienceIcon) {
                    // Mark as set up to avoid duplicate event listeners
                    companyName.setAttribute('data-animation-setup', 'true');
                    
                    companyName.addEventListener('mouseenter', function() {
                        experienceIcon.style.animation = 'iconBounce 0.6s ease';
                    });
                    
                    // Reset animation so it can be triggered again
                    experienceIcon.addEventListener('animationend', function() {
                        experienceIcon.style.animation = '';
                    });
                }
            });
        };
        
        // Initial setup
        setupAnimation();
        
        // Watch for dynamically loaded components
        const observer = new MutationObserver(function(mutations) {
            const hasNewExperience = Array.from(mutations).some(mutation => 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && (
                        node.tagName === 'H3' ||
                        node.classList?.contains('company-link') ||
                        node.querySelector?.('.experience-title h3') ||
                        node.querySelector?.('.company-link')
                    )
                )
            );
            
            if (hasNewExperience) {
                setupAnimation();
            }
        });
        
        // Observe the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}
