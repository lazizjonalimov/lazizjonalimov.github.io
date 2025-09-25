// Component Loader Utility
class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.loadedComponents = new Set();
    }

    // Register a component
    register(name, path) {
        this.components.set(name, path);
    }

    // Load a single component
    async loadComponent(name, targetId) {
        if (this.loadedComponents.has(name)) {
            return;
        }

        const path = this.components.get(name);
        if (!path) {
            console.error(`Component ${name} not registered`);
            return;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.innerHTML = html;
                this.loadedComponents.add(name);
                console.log(`Component ${name} loaded successfully`);
            } else {
                console.error(`Target element ${targetId} not found`);
            }
        } catch (error) {
            console.error(`Error loading component ${name}:`, error);
        }
    }

    // Load multiple components
    async loadComponents(componentMap) {
        const loadPromises = Object.entries(componentMap).map(([name, targetId]) => 
            this.loadComponent(name, targetId)
        );
        
        await Promise.all(loadPromises);
    }

    // Preload all components
    async preloadComponents() {
        const componentMap = {
            'navigation': 'navigation',
            'hero': 'hero',
            'about': 'about',
            'experience': 'experience',
            'skills': 'skills',
            'projects': 'projects',
            'contact': 'contact',
            'footer': 'footer'
        };

        // Register all components
        this.register('navigation', 'components/partials/navigation.html');
        this.register('hero', 'components/sections/hero.html');
        this.register('about', 'components/sections/about.html');
        this.register('experience', 'components/sections/experience.html');
        this.register('skills', 'components/sections/skills.html');
        this.register('projects', 'components/sections/projects.html');
        this.register('contact', 'components/sections/contact.html');
        this.register('footer', 'components/partials/footer.html');

        // Load all components
        await this.loadComponents(componentMap);
    }

    // Get component status
    getStatus() {
        return {
            registered: Array.from(this.components.keys()),
            loaded: Array.from(this.loadedComponents),
            pending: Array.from(this.components.keys()).filter(
                name => !this.loadedComponents.has(name)
            )
        };
    }
}

// Create global instance
window.componentLoader = new ComponentLoader();

// Auto-load components when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    await window.componentLoader.preloadComponents();
    
    // Re-initialize any components that need it
    if (typeof initNavigation === 'function') {
        initNavigation();
    }
    if (typeof initScrollToTop === 'function') {
        initScrollToTop();
    }
});
