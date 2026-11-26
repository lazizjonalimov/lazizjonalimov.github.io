#!/usr/bin/env node
/**
 * Builds the site:
 *   index.html               — home page with all components inlined
 *   work/<slug>/index.html   — one case-study page per entry in case-studies.js
 *   sitemap.xml              — lists every page
 * Run after editing anything in components/ or scripts/case-studies.js.
 */
const fs = require('fs');
const path = require('path');
const cases = require('./case-studies');

const ROOT = path.join(__dirname, '..');
const SITE_URL = 'https://lazizjonalimov.github.io';
const CSS_VERSION = 9;

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8').trim();
const indent = (s, n = 4) => s.split('\n').map((l) => (l ? ' '.repeat(n) + l : l)).join('\n');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Components are written with page-relative links ("#about", "assets/…").
// Sub-pages need them rooted so they work from /work/<slug>/.
const rootLinks = (html) => html
    .replace(/href="#/g, 'href="/#')
    .replace(/(src|href)="assets\//g, '$1="/assets/');

function visual(v) {
    if (v.viz) return read(`components/visuals/${v.viz}.html`);
    return `<img src="${v.image}" alt="${esc(v.alt)}" loading="lazy">`;
}

const PERSON_LD = `{
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Lazizjon Alimov",
        "alternateName": ["Laziz Alimov", "Laziz", "Lazizjon", "lazizjonalimov"],
        "url": "${SITE_URL}",
        "image": "${SITE_URL}/assets/images/profile-image.jpeg",
        "jobTitle": "Systems Engineer",
        "description": "Systems Engineer and Software Developer, Honors Computer Science graduate of Western Michigan University, building tools for transportation, logistics and automation.",
        "knowsAbout": ["Systems engineering", "Software development", "Python", "JavaScript", "React", "iOS development", "Transportation management systems"],
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
    }`;

function head({ title, description, url, ogType = 'website', ogImage, jsonLd, socialDescription }) {
    const img = ogImage || `${SITE_URL}/assets/images/profile-image.jpeg`;
    const social = socialDescription || description;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script>
    (function () {
        document.documentElement.classList.add('js');
        try {
            // Light is the site's default look; dark mode only applies once
            // the visitor has explicitly chosen it via the toggle button.
            if (localStorage.getItem('theme') !== 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        } catch (e) {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    })();
    </script>

    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <meta name="author" content="Lazizjon Alimov">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${url}">

    <meta property="og:type" content="${ogType}">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(social)}">
    <meta property="og:image" content="${img}">
    <meta property="og:site_name" content="Lazizjon Alimov">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(social)}">
    <meta name="twitter:image" content="${img}">
    <meta name="twitter:creator" content="@lazizjonalimov">

    <link rel="me" href="https://linkedin.com/in/lazizjonalimov/">
    <link rel="me" href="https://github.com/lazizjonalimov">

    <meta name="google-site-verification" content="fqjouxQ3y6JTcp8qXid3zjbJ02HqeJVq470EJ-DpH5I">
    <meta name="theme-color" content="#F2F2F2">

${jsonLd.map((ld) => `    <script type="application/ld+json">\n    ${ld}\n    </script>`).join('\n')}

    <link rel="icon" type="image/x-icon" href="/assets/images/icons/favicon-white.ico">
    <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/icons/favicon-white-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/icons/favicon-white-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/assets/images/icons/favicon-white-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/icons/apple-touch-icon-white.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/assets/images/icons/android-chrome-192x192-white.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/assets/images/icons/android-chrome-512x512-white.png">
    <link rel="shortcut icon" href="/assets/images/icons/favicon-white.ico">
    <link rel="manifest" href="/site.webmanifest">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;800&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <link rel="stylesheet" href="/assets/css/style.css?v=${CSS_VERSION}">
</head>`;
}

const toTop = '    <button type="button" class="to-top" id="toTop" aria-label="Back to top"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>';

// ---------- shared pieces ----------
function workCard(c, i, { flat = false } = {}) {
    const firstMetric = c.metrics[0] ? `${c.metrics[0][0]} ${c.metrics[0][1]}` : '';
    return `<article class="stack-card${flat ? ' flat' : ''}"${flat ? '' : ` style="--i:${i}"`}>
    <div class="sc-info">
        <div class="sc-top">
            <span class="sc-logo"><i class="fas ${c.icon}" aria-hidden="true"></i>${esc(c.short)}</span>
            <span class="mono-meta">${esc(c.date)}</span>
        </div>
        <p class="sc-sum">${esc(c.summary)}</p>
        <dl class="sc-rows">
            <div><dt>Service:</dt><dd>${esc(c.service)}</dd></div>
            <div><dt>Industry:</dt><dd>${esc(c.industry)}</dd></div>
            ${firstMetric ? `<div><dt>Result:</dt><dd>${esc(firstMetric)}</dd></div>` : ''}
        </dl>
        <a class="link-arrow" href="/work/${c.slug}/">→| View case study<span class="sr-only">: ${esc(c.name)}</span></a>
    </div>
    <a class="sc-media" href="/work/${c.slug}/" tabindex="-1" aria-hidden="true">
${indent(visual(c.visual), 8)}
    </a>
</article>`;
}

// ---------- home ----------
function buildHome() {
    const order = [
        'components/partials/navigation.html',
        'components/sections/hero.html',
        'components/sections/about.html',
        'components/sections/projects.html',
        'components/sections/skills.html',
        'components/sections/experience.html',
        'components/sections/github.html',
        'components/sections/contact.html',
        'components/partials/footer.html',
    ];
    const cards = cases.map((c, i) => indent(workCard(c, i), 12)).join('\n');
    const body = order.map((f) => indent(read(f).replace('{{WORK_CARDS}}', cards))).join('\n\n');

    const html = `${head({
        title: 'Lazizjon Alimov | Systems Engineer & Software Developer',
        description: 'Lazizjon Alimov (Laziz) — Systems Engineer and Software Developer. Western Michigan University Honors CS graduate building tools for transportation and logistics.',
        socialDescription: 'Portfolio of Lazizjon Alimov — Systems Engineer, Computer Science graduate, and software developer.',
        url: `${SITE_URL}/`,
        ogType: 'profile',
        jsonLd: [PERSON_LD, `{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Lazizjon Alimov",
        "alternateName": "Lazizjon Alimov Portfolio",
        "url": "${SITE_URL}"
    }`],
    })}
<body>
    <a class="skip-link" href="#home">Skip to content</a>
${body}

    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
    <script src="/assets/js/contact.js"></script>
    <script src="/assets/js/main.js"></script>
${toTop}
</body>
</html>
`;
    fs.writeFileSync(path.join(ROOT, 'index.html'), html);
}

// ---------- case studies ----------
function buildCase(c, idx) {
    const url = `${SITE_URL}/work/${c.slug}/`;
    const others = [cases[(idx + 1) % cases.length], cases[(idx + 2) % cases.length]];
    const links = c.links.map(([label, href]) =>
        `<a class="btn-arrow" href="${href}" target="_blank" rel="noopener noreferrer"><span class="ba-icon" aria-hidden="true"><i class="fas fa-arrow-up-right-from-square"></i></span><span class="ba-text">${esc(label)}</span></a>`).join('\n                    ');
    const details = c.details.map(([k, v]) => `<div><dt>${esc(k)}:</dt><dd>${esc(v)}</dd></div>`).join('\n                        ');
    const deliverables = c.deliverables.map((d) => `<li>${esc(d)}</li>`).join('\n                        ');
    const metrics = c.metrics.map(([n, l]) => `<div class="metric reveal"><dt>${esc(l)}</dt><dd>${esc(n)}</dd></div>`).join('\n                        ');
    const ogImage = c.visual.image ? `${SITE_URL}${c.visual.image}` : undefined;

    const main = `<main id="main" class="case">
    <section class="container case-hero">
        <a class="back-link" href="/#projects">← All work</a>
        <div class="case-title-row reveal">
            <span class="case-icon"><i class="fas ${c.icon}" aria-hidden="true"></i></span>
            <h1 class="case-title">${esc(c.name)}</h1>
            <span class="mono-meta">${esc(c.date)}</span>
        </div>
        <div class="case-intro">
            <p class="mono-label reveal">Project details:</p>
            <div class="reveal">
                <p class="case-sum">${esc(c.summary)}</p>
                <dl class="case-details">
                        ${details}
                </dl>
                ${links ? `<div class="case-links">
                    ${links}
                </div>` : ''}
            </div>
        </div>
    </section>

    <div class="container case-visual reveal">
${indent(visual(c.visual), 8)}
    </div>

    <div class="container case-body">
        <nav class="case-toc" aria-label="On this page">
            <p class="mono-meta">On this page</p>
            <a href="#challenge">The challenge</a>
            <a href="#approach">The approach</a>
            <a href="#deliverables">Key deliverables</a>
            <a href="#outcome">The outcome</a>
        </nav>
        <div class="case-content">
            <section id="challenge" class="reveal">
                <h2>The challenge</h2>
                <p>${esc(c.challenge)}</p>
            </section>
            <section id="approach" class="reveal">
                <h2>The approach</h2>
                <p>${esc(c.approach)}</p>
            </section>
            <section id="deliverables" class="reveal">
                <h2>Key deliverables</h2>
                <ul class="deliverables">
                        ${deliverables}
                </ul>
            </section>
            <section id="outcome">
                <h2 class="reveal">The outcome</h2>
                <p class="reveal">${esc(c.outcome)}</p>
                <dl class="metrics">
                        ${metrics}
                </dl>
            </section>
        </div>
    </div>

    <section class="container more-cases">
        <div class="section-bar reveal">
            <p class="mono-label"><i class="fas fa-briefcase" aria-hidden="true"></i>Projects</p>
            <a class="mono-handle" href="/#projects">All work →</a>
        </div>
        <h2 class="section-title center reveal">Explore more projects</h2>
        <div class="more-grid">
${others.map((o) => indent(workCard(o, 0, { flat: true }), 12)).join('\n')}
        </div>
    </section>

    <section class="cta-band">
        <div class="container cta-inner">
            <h2 class="cta-title">Have a problem like this to solve?</h2>
            <a class="btn-arrow light" href="/#contact"><span class="ba-icon" aria-hidden="true"><i class="fas fa-arrow-right-to-bracket"></i></span><span class="ba-text">Get in touch</span></a>
        </div>
    </section>
</main>`;

    const caseLd = `{
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": ${JSON.stringify(c.name)},
        "description": ${JSON.stringify(c.summary)},
        "url": "${url}",
        "author": { "@type": "Person", "name": "Lazizjon Alimov", "url": "${SITE_URL}" }
    }`;

    const html = `${head({
        title: `${c.name} — Case study | Lazizjon Alimov`,
        description: c.summary,
        url,
        ogType: 'article',
        ogImage,
        jsonLd: [caseLd],
    })}
<body>
    <a class="skip-link" href="#main">Skip to content</a>
${indent(rootLinks(read('components/partials/navigation.html')))}

${indent(main)}

${indent(rootLinks(read('components/partials/footer.html')))}

    <script src="/assets/js/main.js"></script>
${toTop}
</body>
</html>
`;
    const dir = path.join(ROOT, 'work', c.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ---------- sitemap ----------
function buildSitemap() {
    const today = new Date().toISOString().slice(0, 10);
    const urls = [`${SITE_URL}/`, ...cases.map((c) => `${SITE_URL}/work/${c.slug}/`), `${SITE_URL}/assets/resume/Laziz-Alimov-Resume.pdf`];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u, i) => `    <url>
        <loc>${u}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>${i === 0 ? '1.0' : '0.8'}</priority>
    </url>`).join('\n')}
</urlset>
`;
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
}

buildHome();
cases.forEach(buildCase);
buildSitemap();
console.log(`Built index.html, ${cases.length} case studies and sitemap.xml.`);
