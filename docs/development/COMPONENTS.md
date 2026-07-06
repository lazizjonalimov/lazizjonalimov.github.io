# Component Structure Documentation

## Overview
The HTML has been divided into modular components for better maintainability and organization.

## Directory Structure
```
components/
├── sections/          # Main page sections
│   ├── hero.html       # Hero/landing section
│   ├── about.html      # About section
│   ├── experience.html # Work experience section
│   ├── skills.html     # Skills section
│   ├── projects.html   # Projects section
│   └── contact.html    # Contact section
└── partials/          # Reusable components
    ├── navigation.html # Navigation bar
    └── footer.html     # Footer and scroll-to-top
```

## Component Files

### Navigation (`components/partials/navigation.html`)
- **Purpose**: Site navigation with logo, menu links, and contact button
- **Features**: Responsive hamburger menu, smooth scrolling, active link highlighting
- **Dependencies**: `assets/css/layout.css`, `assets/js/navigation.js`

### Hero Section (`components/sections/hero.html`)
- **Purpose**: Landing section with introduction and call-to-action
- **Features**: Animated title, floating tech icons, gradient background
- **Dependencies**: `assets/css/animations.css`, `assets/js/animations.js`

### About Section (`components/sections/about.html`)
- **Purpose**: Personal introduction and statistics
- **Features**: Profile image, animated counters, responsive layout
- **Dependencies**: `assets/css/layout.css`, `assets/js/animations.js`

### Experience Section (`components/sections/experience.html`)
- **Purpose**: Work experience and professional history
- **Features**: Timeline layout, role/company details
- **Dependencies**: `assets/css/layout.css`, `assets/css/components.css`

### Skills Section (`components/sections/skills.html`)
- **Purpose**: Technical skills and technologies showcase
- **Features**: Categorized skill items, hover animations, responsive grid
- **Dependencies**: `assets/css/components.css`, `assets/css/layout.css`

### Projects Section (`components/sections/projects.html`)
- **Purpose**: Portfolio projects showcase
- **Features**: Project cards, hover effects, tech tags
- **Dependencies**: `assets/css/components.css`, `assets/css/layout.css`

### Contact Section (`components/sections/contact.html`)
- **Purpose**: Contact information and form
- **Features**: Contact details, form validation, responsive layout
- **Dependencies**: `assets/css/components.css`, `assets/js/contact.js`

### Footer (`components/partials/footer.html`)
- **Purpose**: Footer content and scroll-to-top button
- **Features**: Social links, copyright, scroll functionality
- **Dependencies**: `assets/css/components.css`, `assets/js/navigation.js`

## Usage

Components are inlined into `index.html` at build time by `scripts/build-index.js` — there's no runtime fetching. Each entry in that script's `componentMap` maps a `<div id="...">` wrapper to a component file:

```javascript
const componentMap = {
    navigation: 'components/partials/navigation.html',
    hero: 'components/sections/hero.html',
    about: 'components/sections/about.html',
    experience: 'components/sections/experience.html',
    skills: 'components/sections/skills.html',
    projects: 'components/sections/projects.html',
    contact: 'components/sections/contact.html',
    footer: 'components/partials/footer.html',
};
```

After editing any file in `components/`, rebuild `index.html`:

```bash
node scripts/build-index.js
```

This keeps the served page fully self-contained (no client-side fetches needed), which matters for search engine crawlers and first-paint performance.

## Benefits

### 🏗️ **Modularity**
- Each section is self-contained
- Easy to modify individual components
- Reusable across different pages

### 🔧 **Maintainability**
- Clear separation of concerns
- Easy to locate and fix issues
- Simplified debugging

### 👥 **Team Collaboration**
- Multiple developers can work on different components
- Reduced merge conflicts
- Clear ownership of components

### 🚀 **Performance**
- Fully inlined at build time — no client-side fetches or waterfall requests
- Single static HTML file to cache

### 📱 **Responsive Design**
- Each component handles its own responsive behavior
- Easier to test individual sections
- Consistent styling across components

## Development Guidelines

### Adding New Components
1. Create component file in appropriate directory
2. Add it to `componentMap` in `scripts/build-index.js`
3. Run `node scripts/build-index.js` to regenerate `index.html`
4. Test the rendered section

### Modifying Existing Components
1. Edit the specific component file
2. Test the component in isolation
3. Verify integration with other components
4. Update documentation if needed

### Best Practices
- Keep components focused on single responsibility
- Use semantic HTML structure
- Maintain consistent naming conventions
- Include proper error handling
- Document component dependencies

## File Organization

- `index.html` - Generated output; don't hand-edit, it's overwritten by the build script
- `components/` - Source of truth for section/partial markup, organized by type (sections vs partials)
- `scripts/build-index.js` - Build script that inlines `components/` into `index.html`
