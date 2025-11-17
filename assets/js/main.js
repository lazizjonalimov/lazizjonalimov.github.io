// Image protection function
function initImageProtection() {
    const profileImages = document.querySelectorAll('.profile-floating-image');
    
    profileImages.forEach(img => {
        // Disable right-click context menu
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Disable drag and drop
        img.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Disable selection
        img.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Disable keyboard shortcuts for saving images
        img.addEventListener('keydown', function(e) {
            if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                return false;
            }
        });
        
        // Add overlay to prevent interaction
        img.style.position = 'relative';
        
        // Disable print
        const style = document.createElement('style');
        style.textContent = `
            @media print {
                .profile-floating-image {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    });
}

// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initSmoothScrolling();
    initScrollToTop();
    initParticles();
    initScrollAnimations();
    initCounterAnimations();
    initContactForm();
    initTypingEffect();
    initParallaxEffect();
    initSkillAnimations();
    initSkillProjectLinks();
    initRippleEffect();
    initProjectAnimations();
    initSocialAnimations();
    initDynamicBackground();
    initLoadingAnimation();
    initCursorTrail();
    initScrollProgress();
    initKeyboardNavigation();
    initExperienceIconAnimation();
    initImageProtection();
    
    // Re-initialize counter animations after components are loaded
    setTimeout(() => {
        if (typeof initCounterAnimations === 'function') {
            initCounterAnimations();
        }
        // Re-initialize experience icon animation after components are loaded
        if (typeof initExperienceIconAnimation === 'function') {
            initExperienceIconAnimation();
        }
    }, 1000);
});
