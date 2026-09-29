# Siqi Dai Personal Website

Personal portfolio site for Siqi Dai, built as a static GitHub Pages website: https://sherry1247.github.io/#home

## Structure

- `index.html`: main page structure and content
- `css/style.css`: original component foundations
- `css/refactor.css`: current design tokens, editorial layouts, responsive rules, and visual polish
- `js/main.js`: shared theme, navigation, reveal, timeline, interest, and contact interactions
- `js/courses.js`: course graph data, graph interaction, filters, and course search
- `assets/images/`: profile image and future image assets
- `assets/docs/`: resume and downloadable documents

## Features

- Light and dark mode
- Full-screen landing section
- Interactive project rows and a compact project timeline
- Related-course learning graph with accessible keyboard interaction
- iPhone-inspired animated contact interface
- Skill logos using Devicon
- Static-site friendly deployment for GitHub Pages

## Local preview

From the repo root:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173`.

## Deployment

This repository is intended to be published through GitHub Pages from the default branch.
