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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
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

// Add cursor trail effect
function initCursorTrail() {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(102, 126, 234, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
    }
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            outline: 2px solid #667eea !important;
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
