# Deployment Guide for GitHub Pages

This guide covers deploying the portfolio website to GitHub Pages.

## Pre-Deployment Checklist

- [x] `index.html` - Main portfolio page
- [x] `assets/` - CSS, JS, and image files
- [x] `components/` - Modular HTML components
- [x] `site.webmanifest` - PWA manifest
- [x] `README.md` - Project documentation

## Step 1: GitHub Repository Setup

### Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click "New repository"
3. Repository name: `lazizjonalimov.github.io` (must match your username)
4. Make it **Public** (required for GitHub Pages)
5. Click "Create repository"

### Upload Your Files

**Option A: GitHub Web Interface**
1. Click "uploading an existing file"
2. Drag and drop all your files
3. Commit with message: "Initial portfolio website deployment"

**Option B: Git Command Line**
```bash
git init
git add .
git commit -m "Initial portfolio website deployment"
git remote add origin https://github.com/lazizjonalimov/lazizjonalimov.github.io.git
git push -u origin main
```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select "Deploy from a branch"
4. Select "main" branch and "/ (root)" folder
5. Click "Save"
6. Wait 5–10 minutes, then visit `https://lazizjonalimov.github.io`

After editing `components/`, run `node scripts/build-index.js` before deploying.

## Step 3: Custom Domain (Optional)

1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Update URLs in meta tags if needed

## Troubleshooting

**Website not loading**
- Check GitHub Pages settings
- Verify repository name matches username
- Wait 10–15 minutes for deployment

**Components not loading**
- Serve locally with a local server: `python -m http.server 8000`
- GitHub Pages requires relative paths as configured in the project

## Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Custom Domain Setup](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

Your site will be live at: `https://lazizjonalimov.github.io`
