#!/usr/bin/env node
/**
 * Builds index.html with all components inlined.
 * Run after editing files in components/.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE_URL = 'https://lazizjonalimov.github.io';

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

function readComponent(relativePath) {
    return fs.readFileSync(path.join(ROOT, relativePath), 'utf8').trim();
}

function indent(content, spaces = 4) {
    const pad = ' '.repeat(spaces);
    return content.split('\n').map((line) => pad + line).join('\n');
}

const bodySections = Object.entries(componentMap)
    .map(([id, file]) => `    <div id="${id}">\n${indent(readComponent(file))}\n    </div>`)
    .join('\n\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
    (function () {
        try {
            // Dark is the site's default look; light mode only kicks in once
            // the visitor has explicitly chosen it via the toggle button.
            if (localStorage.getItem('theme') === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        } catch (e) {}
    })();
    </script>

    <title>Lazizjon Alimov | IT Systems Engineer & Software Developer</title>
    <meta name="description" content="Lazizjon Alimov (Laziz) — IT Systems Engineer and Software Developer. Honors Computer Science graduate from Western Michigan University building practical, scalable technology in transportation, logistics, and automation.">
    <meta name="author" content="Lazizjon Alimov">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${SITE_URL}/">

    <meta property="og:type" content="profile">
    <meta property="og:url" content="${SITE_URL}/">
    <meta property="og:title" content="Lazizjon Alimov | IT Systems Engineer & Software Developer">
    <meta property="og:description" content="Portfolio of Lazizjon Alimov — IT Systems Engineer, Computer Science graduate, and software developer.">
    <meta property="og:image" content="${SITE_URL}/assets/images/profile-image.jpeg">
    <meta property="og:site_name" content="Lazizjon Alimov">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Lazizjon Alimov | IT Systems Engineer & Software Developer">
    <meta name="twitter:description" content="Portfolio of Lazizjon Alimov — IT Systems Engineer and software developer.">
    <meta name="twitter:image" content="${SITE_URL}/assets/images/profile-image.jpeg">
    <meta name="twitter:creator" content="@lazizjonalimov">

    <link rel="me" href="https://linkedin.com/in/lazizjonalimov/">
    <link rel="me" href="https://github.com/lazizjonalimov">

    <meta name="google-site-verification" content="fqjouxQ3y6JTcp8qXid3zjbJ02HqeJVq470EJ-DpH5I">
    <meta name="theme-color" content="#08080d">

    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Lazizjon Alimov",
        "alternateName": ["Laziz Alimov", "Laziz", "Lazizjon", "lazizjonalimov"],
        "url": "${SITE_URL}",
        "image": "${SITE_URL}/assets/images/profile-image.jpeg",
        "jobTitle": "IT Systems Engineer",
        "email": "lazizjonalimov@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
        },
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Western Michigan University",
            "url": "https://wmich.edu"
        },
        "worksFor": {
            "@type": "Organization",
            "name": "SMT Trans"
        },
        "sameAs": [
            "https://linkedin.com/in/lazizjonalimov/",
            "https://github.com/lazizjonalimov",
            "https://x.com/lazizjonalimov",
            "https://instagram.com/lazizjonalimov",
            "https://www.facebook.com/lazalimov/"
        ]
    }
    </script>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Lazizjon Alimov",
        "alternateName": "Lazizjon Alimov Portfolio",
        "url": "${SITE_URL}"
    }
    </script>

    <link rel="icon" type="image/x-icon" href="assets/images/icons/favicon-white.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/images/icons/favicon-white-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/icons/favicon-white-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="assets/images/icons/favicon-white-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/icons/apple-touch-icon-white.png">
    <link rel="icon" type="image/png" sizes="192x192" href="assets/images/icons/android-chrome-192x192-white.png">
    <link rel="icon" type="image/png" sizes="512x512" href="assets/images/icons/android-chrome-512x512-white.png">
    <link rel="shortcut icon" href="assets/images/icons/favicon-white.ico">
    <link rel="manifest" href="site.webmanifest">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">

    <link rel="stylesheet" href="assets/css/base.css">
    <link rel="stylesheet" href="assets/css/layout.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <link rel="stylesheet" href="assets/css/animations.css">
    <link rel="stylesheet" href="assets/css/responsive.css">
    <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Archivo+Black&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
${bodySections}

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script src="assets/js/navigation.js"></script>
    <script src="assets/js/animations.js"></script>
    <script src="assets/js/contact.js"></script>
    <script src="assets/js/effects.js"></script>
    <script src="assets/js/particles-canvas.js"></script>
    <script src="assets/js/tilt.js"></script>
    <script src="assets/js/skill-rings.js"></script>
    <script src="assets/js/timeline-progress.js"></script>
    <script src="assets/js/main.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'index.html'), html);
console.log('Built index.html with inlined components.');
