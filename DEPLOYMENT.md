# Deployment

## Live Site

**URL:** https://jhulian-resume.web.app

## Firebase Project

- **Project ID:** `jhulian-resume`
- **Hosting config:** [firebase.json](firebase.json) — serves `dist/`, rewrites `**` → `/index.html`
- **Console:** https://console.firebase.google.com/project/jhulian-resume/overview

## Last Deployment

- **Date:** 2026-08-31
- **Files uploaded:** 9

```
dist/
├── index.html
├── favicon.png
├── vite.svg
└── assets/
    ├── profile-Bs7kfQHJ.jpeg        91.14 kB
    ├── index-bVrkh0kW.css           26.6 kB  (gzip  5.9 kB)
    ├── purify.es-21m173o_.js        22.71 kB (gzip  8.7 kB)
    ├── index.es-B8Jnh1nB.js        158.75 kB (gzip 52.9 kB)
    ├── html2canvas.esm-DXEQVQnt.js 201.04 kB (gzip 47.4 kB)
    └── index-FCBzfEKe.js           942.68 kB (gzip 301.7 kB)
```

> Asset filenames are content-hashed and change on every build — treat the list
> above as a snapshot, not a contract.

## Commands

```bash
npm run build                              # tsc -b && vite build
npx firebase deploy --only hosting         # deploy dist/
npx firebase login:list                    # check auth
npx firebase hosting:rollback              # roll back one release
```

Always `rm -rf dist` before a release build. Vite does not prune stale files
from `dist/`, and anything left there gets uploaded — including scratch pages.

## What the site contains

- **Sections:** Hero (profile), Technical Skills, Work Experience, Footer.
- **Bilingual** ES/EN via `react-i18next`, toggled in the UI. All copy lives in
  [src/i18n/locales/es.json](src/i18n/locales/es.json) and
  [en.json](src/i18n/locales/en.json) — including the experience entries and
  the skill lists, which the PDF export reads from the same keys.
- **PDF export** is drawn with jsPDF vector primitives (not `html2canvas`), so
  it is independent of the page's CSS. `html2canvas` is still a transitive
  dependency but is not on the export path — do not switch to it, as it does
  not implement `backdrop-filter` and every glass panel would rasterise as a
  flat rectangle.
- **Certifications are deliberately not displayed** anywhere on the site or in
  the PDF. They inform the skill lists only.

## Design system notes

The glass system lives in [src/styles/index.css](src/styles/index.css) and is
consumed from CSS Modules via `composes: glass … from global`.

- One light source (top-left, `--light-angle`); every sheen, rim and shadow
  offset derives from it.
- Three tiers: `glass--chrome` (above the page, darkens), `glass` / `glass--raised`
  (within the page, lifts), `glass--inline` (pills — **no** `backdrop-filter`,
  since a pill on a glass card has nothing left to blur).
- `transform` is owned by framer-motion, never by CSS transitions, on any
  element that also has motion props — otherwise the two fight and the CSS
  loses to the inline style.
- Motion tokens (eases, durations, stagger cap) are in
  [src/motion/tokens.ts](src/motion/tokens.ts).
- Degradation paths exist for `prefers-reduced-motion`,
  `prefers-reduced-transparency`, `forced-colors`, `@supports not backdrop-filter`,
  and print.

## Verifying a deploy

Check the live URL, not just the CLI output:

```bash
curl -s https://jhulian-resume.web.app/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.(js|css)'
```

The hosting rewrite sends every unknown path to `/index.html`, so a `200` on a
random URL does **not** prove a file was deployed — compare the asset hashes
against your local `dist/`.

Note that headless screenshots of this site are unreliable for judging layout:
entrance animations are still running when the capture fires, and headless
Chrome enforces a minimum window width of ~500px. To test mobile widths, render
the page inside a 390px-wide `<iframe>` and measure there.
