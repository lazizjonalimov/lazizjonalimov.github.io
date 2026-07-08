// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .contact-item, .about-text, .about-image');
    animateElements.forEach((el, index) => {
        if (index % 2 === 0) {
            el.classList.add('slide-in-left');
        } else {
            el.classList.add('slide-in-right');
        }
        observer.observe(el);
    });

    // Special animations for stats
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.classList.add('scale-in');
        observer.observe(stat);
    });
}

// Counter animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                const isDecimal = !Number.isInteger(target);

                // Skip if no data-target attribute or invalid value
                if (isNaN(target)) {
                    return;
                }

                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;

                const format = (value) => value.toLocaleString('en-US', {
                    minimumFractionDigits: isDecimal ? 1 : 0,
                    maximumFractionDigits: isDecimal ? 1 : 0
                });

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = format(current) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = format(target) + suffix;
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Typing effect for hero title
function initTypingEffect() {
    const titleLines = document.querySelectorAll('.title-line');

    titleLines.forEach((line, index) => {
        // Lines with element children (e.g. the gradient name span) keep their
        // markup intact and just fade in via the existing slideInUp animation.
        if (line.children.length > 0) {
            line.style.opacity = '1';
            return;
        }

        const text = line.textContent.trim();
        line.textContent = '';
        line.style.opacity = '1';

        setTimeout(() => {
            typeText(line, text, 100);
        }, index * 500);
    });
    
    function typeText(element, text, speed) {
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i > text.length) {
                clearInterval(timer);
            }
        }, speed);
    }
}

// Parallax effect
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-icon');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Add floating animation to skill items
function initSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Link skill chips to matching project tech tags
function initSkillProjectLinks() {
    let activeSkill = null;
    const normalizeSkill = (text) => text.trim().toLowerCase();
    
    const setupLinks = () => {
        const skillItems = document.querySelectorAll('#skills .skill-item');
        const projectCards = document.querySelectorAll('.project-card');
        const projectSection = document.getElementById('projects');
        
        if (!skillItems.length || !projectCards.length) {
            return false;
        }

        const clearHighlights = () => {
            projectCards.forEach(card => {
                card.classList.remove('project-match', 'project-dimmed');
            });
        };
        
        const highlightMatches = (skill) => {
            projectCards.forEach(card => {
                const hasSkill = Array.from(card.querySelectorAll('.tech-tag'))
                    .some(tag => normalizeSkill(tag.textContent) === skill);
                
                card.classList.toggle('project-match', hasSkill);
                card.classList.toggle('project-dimmed', !hasSkill);
            });
        };
        
        skillItems.forEach(item => {
            if (item.dataset.projectLinkAttached === 'true') {
                return;
            }
            
            const skillName = normalizeSkill(item.textContent);
            item.dataset.projectLinkAttached = 'true';
            item.classList.add('skill-link');
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');
            
            const activate = () => {
                if (activeSkill === skillName) {
                    activeSkill = null;
                    clearHighlights();
                    return;
                }
                
                activeSkill = skillName;
                highlightMatches(skillName);
                if (projectSection) {
                    projectSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };
            
            item.addEventListener('click', activate);
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activate();
                }
            });
        });
        
        return true;
    };
    
    if (setupLinks()) {
        return;
    }
    
    // Fallback for dynamic component loading
    const observer = new MutationObserver(() => {
        if (setupLinks()) {
            observer.disconnect();
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// Add ripple effect to buttons
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Add scroll-triggered animations for project cards
function initProjectAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    
    const projectObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                entry.target.style.animationDelay = Math.random() * 0.3 + 's';
            }
        });
    }, { threshold: 0.1 });
    
    projectCards.forEach(card => {
        projectObserver.observe(card);
    });
}

// Add hover effects for social links
function initSocialAnimations() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

