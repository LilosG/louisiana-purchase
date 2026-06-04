# Louisiana Purchase
**Creole Dining & Craft Cocktails — North Park, San Diego**

Premium Astro + Tailwind CSS + TypeScript digital storefront.

## Stack
- **Framework**: Astro (Static Generation)
- **Styling**: Tailwind CSS v4 — fully tokenized, zero arbitrary utilities
- **Language**: TypeScript (strict mode)
- **Hosting**: Vercel
- **Fonts**: Cormorant Garamond (serif) + DM Sans (body)

## Local Development

```bash
# Install dependencies
npm install

# Copy and populate environment variables
cp .env.example .env

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Environment Variables
Copy `.env.example` → `.env` and populate all values before running.
See `.env.example` for full documentation of each variable.
**Never commit `.env` or `.env.production` to version control.**

## Project Structure
```
src/
├── assets/           # Local optimized images & SVGs
├── components/
│   ├── core/         # LocalSEO — headless SEO/AEO engine
│   ├── layout/       # SiteNav, SiteFooter
│   └── ui/           # Atomic UI elements
├── data/
│   ├── menu.json     # Source-of-truth menu data
│   └── private-events.ts  # SEO slug registry
├── layouts/
│   └── Layout.astro  # Master document wrapper
├── pages/
│   ├── index.astro
│   ├── menu.astro
│   └── private-events/
│       ├── index.astro
│       └── [slug].astro
├── styles/
│   └── global.css
└── types/
    ├── menu.ts
    └── seo.ts
```

## Deployment
Connected to Vercel via GitHub. Every push to `main` triggers a production deployment.
Pull requests generate preview deployments automatically.
