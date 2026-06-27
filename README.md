# Lazizjon Alimov - Portfolio Website

A modern, responsive portfolio website showcasing my skills, projects, and professional experience.

## 🚀 Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Interactive Elements**: Floating animations, hover effects, and smooth scrolling
- **Component-Based**: Modular HTML, CSS, and JavaScript architecture
- **Fast Loading**: Optimized assets and efficient code structure

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with Flexbox and Grid layouts
- **JavaScript**: Interactive features and smooth animations
- **Font Awesome**: Professional icons
- **Google Fonts**: Inter font family for modern typography

## 📁 Project Structure

```
├── assets/
│   ├── css/           # Modular CSS files
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── animations.css
│   │   └── responsive.css
│   ├── images/        # Optimized images
│   └── js/            # Modular JavaScript files
│       ├── main.js
│       ├── navigation.js
│       ├── animations.js
│       ├── contact.js
│       ├── effects.js
│       └── component-loader.js
├── components/
│   ├── partials/      # Reusable components
│   │   ├── navigation.html
│   │   └── footer.html
│   └── sections/      # Page sections
│       ├── hero.html
│       ├── about.html
│       ├── skills.html
│       ├── projects.html
│       └── contact.html
├── index.html         # Main HTML file
├── site.webmanifest   # PWA manifest
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/lazizjonalimov/lazizjonalimov.github.io.git
   cd lazizjonalimov.github.io
   ```

2. **Open in browser**
   - Open `index.html` in your browser
   - Or use a local server: `python -m http.server 8000`

3. **Customize content**
   - Update personal information in component files
   - Modify colors and styling in CSS files
   - Add new sections by creating new component files

4. **Deploy to GitHub Pages**
   - Push to your GitHub repository
   - Enable GitHub Pages in repository settings
   - Your site will be available at `https://yourusername.github.io`

## 🎨 Customization Guide

### Personal Information
- **Hero Section**: Update name, title, and description in `components/sections/hero.html`
- **About Section**: Modify bio and achievements in `components/sections/about.html`
- **Skills**: Add/remove skills in `components/sections/skills.html`
- **Projects**: Update work experience in `components/sections/projects.html`
- **Contact**: Update contact information in `components/sections/contact.html`

### Styling
- **Colors**: Modify CSS custom properties in `assets/css/base.css`
- **Layout**: Adjust spacing and layout in `assets/css/layout.css`
- **Components**: Customize component styles in `assets/css/components.css`
- **Animations**: Modify animations in `assets/css/animations.css`

### Adding New Sections
1. Create new HTML file in `components/sections/`
2. Add section to `index.html` with unique ID
3. Update `component-loader.js` to load the new section
4. Add corresponding CSS styles

### Rebuild after editing components

Page content is inlined into `index.html` for search engines. After editing files in `components/`, run:

```bash
node scripts/build-index.js
```

## 🚀 Deployment Options

### GitHub Pages (Recommended)
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)
4. Site will be available at `https://username.github.io`

### Custom Domain
1. Add `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Update URLs in meta tags if needed

### Other Hosting Options
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **AWS S3**: Static website hosting
- **Cloudflare Pages**: Fast global CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit changes: `git commit -m "Add feature"`
5. Push to branch: `git push origin feature-name`
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: lazalimov@gmail.com
- **LinkedIn**: [linkedin.com/in/lazizjonalimov](https://linkedin.com/in/lazizjonalimov/)
- **GitHub**: [github.com/lazizjonalimov](https://github.com/lazizjonalimov)
- **X (Twitter)**: [x.com/lazizjonalimov](https://x.com/lazizjonalimov)
- **Instagram**: [instagram.com/lazizjonalimov](https://instagram.com/lazizjonalimov)

---

**Built with ❤️ by Lazizjon Alimov**