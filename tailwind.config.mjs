// tailwind.config.mjs
// Louisiana Purchase — North Park, San Diego
// Brand Design Token System
// ALL custom values live here. Arbitrary bracket utilities are forbidden in component files.

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {

      // ─── COLOR PALETTE ────────────────────────────────────────────────────
      colors: {
        // Foundational Darks — obsidian, velvet, char
        obsidian: {
          DEFAULT: '#0A0806',
          900:     '#0A0806',
          800:     '#110D0A',
          700:     '#1A1410',
          600:     '#231A15',
          500:     '#2E211A',
        },
        velvet: {
          DEFAULT: '#1C1419',
          900:     '#1C1419',
          800:     '#261B22',
          700:     '#33232D',
          600:     '#402C38',
          500:     '#503545',
        },
        char: {
          DEFAULT: '#272220',
          800:     '#302926',
          700:     '#3D342F',
          600:     '#4A3F39',
          500:     '#5A4D46',
        },

        // Gold & Brass — primary accent spectrum
        gold: {
          DEFAULT: '#C9A84C',
          50:      '#FDF6E3',
          100:     '#F7E8B8',
          200:     '#EDD07A',
          300:     '#E0BB55',
          400:     '#D4A73A',
          500:     '#C9A84C',   // Core brand gold
          600:     '#B8922F',
          700:     '#9E7B22',
          800:     '#7E6119',
          900:     '#5E470F',
        },
        brass: {
          DEFAULT: '#9C7B3C',
          light:   '#C4A05A',
          dark:    '#6B5428',
          muted:   '#7A6340',
        },

        // Crimson — sultry highlight / danger signal
        crimson: {
          DEFAULT: '#8B1A2A',
          50:      '#FEF2F4',
          100:     '#FCD9DD',
          200:     '#F5A3AD',
          300:     '#EC6B7A',
          400:     '#DC3A4E',
          500:     '#C41E32',
          600:     '#8B1A2A',   // Core brand crimson
          700:     '#6B1321',
          800:     '#4E0E18',
          900:     '#320910',
        },

        // Neutrals — warm editorial tones
        parchment: {
          DEFAULT: '#F2EBE0',
          50:      '#FDFAF6',
          100:     '#F7F1E8',
          200:     '#F2EBE0',
          300:     '#E8DDCE',
          400:     '#D6CABB',
          500:     '#C2B5A3',
        },
        cream: {
          DEFAULT: '#E8DFCF',
          warm:    '#EDE3D4',
          cool:    '#E2D9C8',
        },
        smoke: {
          DEFAULT: '#9C9490',
          light:   '#B8B2AE',
          dark:    '#7A746F',
        },
      },

      // ─── TYPOGRAPHY ───────────────────────────────────────────────────────
      fontFamily: {
        // Editorial serif — headings, hero text, pull quotes
        // Cormorant Garamond: high-contrast, NOLA editorial luxury
        serif:     ['Cormorant Garamond', 'Cormorant', 'Didot', 'Georgia', 'serif'],
        // Display variant for oversized headlines
        display:   ['Cormorant SC', 'Cormorant Garamond', 'Georgia', 'serif'],
        // Body / UI — geometric sans-serif, clean and minimal
        // DM Sans: contemporary, elegant, highly legible at small sizes
        sans:      ['DM Sans', 'Helvetica Neue', 'Arial', 'sans-serif'],
        // Mono — for structured data, menus, SEO key-value blocks
        mono:      ['DM Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
        // Accent script — decorative section markers, not body copy
        script:    ['Playfair Display', 'Georgia', 'serif'],
      },

      fontSize: {
        // Fluid editorial scale
        '2xs':  ['0.625rem',  { lineHeight: '1.0' }],   // 10px — eyebrow labels
        'xs':   ['0.75rem',   { lineHeight: '1.2' }],   // 12px — legal/caption
        'sm':   ['0.875rem',  { lineHeight: '1.4' }],   // 14px — nav / utility
        'base': ['1rem',      { lineHeight: '1.6' }],   // 16px — body
        'md':   ['1.125rem',  { lineHeight: '1.6' }],   // 18px — lead body
        'lg':   ['1.25rem',   { lineHeight: '1.5' }],   // 20px — subhead
        'xl':   ['1.5rem',    { lineHeight: '1.4' }],   // 24px — section title
        '2xl':  ['1.875rem',  { lineHeight: '1.3' }],   // 30px — page title
        '3xl':  ['2.25rem',   { lineHeight: '1.25' }],  // 36px — large title
        '4xl':  ['3rem',      { lineHeight: '1.15' }],  // 48px — hero sub
        '5xl':  ['3.75rem',   { lineHeight: '1.05' }],  // 60px — hero headline
        '6xl':  ['4.5rem',    { lineHeight: '1.0' }],   // 72px — editorial hero
        '7xl':  ['5.5rem',    { lineHeight: '0.95' }],  // 88px — oversized display
        '8xl':  ['7rem',      { lineHeight: '0.9' }],   // 112px — full bleed display
        '9xl':  ['9rem',      { lineHeight: '0.85' }],  // 144px — cinematic title
      },

      fontWeight: {
        thin:       '100',
        extralight: '200',
        light:      '300',
        normal:     '400',
        medium:     '500',
        semibold:   '600',
        bold:       '700',
        extrabold:  '800',
        black:      '900',
      },

      letterSpacing: {
        'tightest': '-0.05em',
        'tighter':  '-0.03em',
        'tight':    '-0.01em',
        'normal':   '0em',
        'wide':     '0.04em',
        'wider':    '0.08em',
        'widest':   '0.16em',
        'ultra':    '0.24em',
        'spaced':   '0.32em',     // eyebrow label tracking
      },

      // ─── SPACING & LAYOUT ─────────────────────────────────────────────────
      spacing: {
        // Named semantic spacing — prevents magic number drift
        'gutter':    '1.5rem',    // 24px — standard column gutter
        'section':   '6rem',      // 96px — section vertical padding
        'section-lg':'10rem',     // 160px — large section vertical padding
        'hero':      '14rem',     // 224px — hero top padding
        'container': '1.25rem',  // 20px — mobile container padding
        'rule':      '0.0625rem', // 1px — hairline rule
      },

      // Named max-width scale
      maxWidth: {
        'prose-narrow': '52ch',
        'prose':        '68ch',
        'prose-wide':   '80ch',
        'layout':       '1280px',
        'layout-wide':  '1440px',
        'full-bleed':   '100vw',
      },

      // ─── HEIGHTS & ASPECT RATIOS ──────────────────────────────────────────
      height: {
        'hero-mobile':   '100svh',
        'hero-desktop':  '100vh',
        'hero-short':    '72vh',
        'section-tall':  '85vh',
        'section-mid':   '65vh',
        'nav':           '5rem',     // 80px — nav bar height
        'nav-scroll':    '4rem',     // 64px — condensed scroll nav
        'divider':       '0.0625rem',
      },

      aspectRatio: {
        'hero':       '16 / 9',
        'poster':     '2 / 3',
        'portrait':   '3 / 4',
        'square':     '1 / 1',
        'wide':       '21 / 9',
        'venue':      '4 / 3',
        'panoramic':  '32 / 9',
        'menu-card':  '3 / 2',
      },

      // ─── BORDER & RADII ───────────────────────────────────────────────────
      borderRadius: {
        'none':  '0',
        'sm':    '0.125rem',   // subtle rounding for premium feel
        'md':    '0.25rem',
        'lg':    '0.5rem',
        'xl':    '1rem',
        'pill':  '9999px',
      },

      borderWidth: {
        'hairline': '0.5px',
        '1':        '1px',
        '2':        '2px',
      },

      // ─── SHADOWS & GLOWS ──────────────────────────────────────────────────
      boxShadow: {
        // NO default card shadows — all shadows are intentional and branded
        'gold-glow':     '0 0 32px 0 rgba(201, 168, 76, 0.18)',
        'gold-glow-lg':  '0 0 64px 0 rgba(201, 168, 76, 0.22)',
        'crimson-glow':  '0 0 28px 0 rgba(139, 26, 42, 0.28)',
        'obsidian-lift': '0 4px 40px 0 rgba(10, 8, 6, 0.72)',
        'obsidian-deep': '0 12px 64px 0 rgba(10, 8, 6, 0.88)',
        'inset-top':     'inset 0 4px 24px 0 rgba(10, 8, 6, 0.64)',
        'inset-bottom':  'inset 0 -4px 24px 0 rgba(10, 8, 6, 0.64)',
        'editorial':     '0 1px 0 0 rgba(201, 168, 76, 0.30)',
        'none':          'none',
      },

      // ─── GRADIENTS ────────────────────────────────────────────────────────
      backgroundImage: {
        // Atmospheric gradient overlays — apply on pseudo-elements, not directly on image containers
        'hero-vignette':      'radial-gradient(ellipse at center, transparent 30%, rgba(10,8,6,0.72) 100%)',
        'hero-bottom-fade':   'linear-gradient(to bottom, transparent 40%, rgba(10,8,6,0.96) 100%)',
        'hero-top-fade':      'linear-gradient(to top, transparent 40%, rgba(10,8,6,0.80) 100%)',
        'section-divider':    'linear-gradient(to right, transparent, rgba(201,168,76,0.40), transparent)',
        'gold-shimmer':       'linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.12) 50%, transparent 60%)',
        'obsidian-gradient':  'linear-gradient(180deg, #0A0806 0%, #1A1410 100%)',
        'velvet-gradient':    'linear-gradient(135deg, #1C1419 0%, #0A0806 100%)',
        'text-gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #EDD07A 50%, #B8922F 100%)',
        'noise-overlay':      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },

      // ─── ANIMATIONS & TRANSITIONS ─────────────────────────────────────────
      transitionTimingFunction: {
        'luxury':    'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
        'cinematic': 'cubic-bezier(0.76, 0, 0.24, 1)',
        'reveal':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'sharp':     'cubic-bezier(0.4, 0, 0.6, 1)',
      },

      transitionDuration: {
        'instant':  '80ms',
        'fast':     '160ms',
        'base':     '280ms',
        'slow':     '480ms',
        'cinematic':'800ms',
        'dramatic': '1200ms',
      },

      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'rule-expand': {
          '0%':   { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
        'text-reveal': {
          '0%':   { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0% 0 0)' },
        },
      },

      animation: {
        'fade-up':        'fade-up 0.72s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up-slow':   'fade-up 1.0s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':        'fade-in 0.64s ease-out both',
        'fade-in-slow':   'fade-in 1.1s ease-out both',
        'shimmer':        'shimmer 2.4s linear infinite',
        'rule-expand':    'rule-expand 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'text-reveal':    'text-reveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
      },

      // ─── Z-INDEX SCALE ────────────────────────────────────────────────────
      zIndex: {
        'below':   '-1',
        'base':    '0',
        'raised':  '10',
        'overlay': '20',
        'modal':   '30',
        'nav':     '40',
        'toast':   '50',
      },

      // ─── OPACITY SCALE ────────────────────────────────────────────────────
      opacity: {
        '0':   '0',
        '5':   '0.05',
        '10':  '0.10',
        '15':  '0.15',
        '20':  '0.20',
        '30':  '0.30',
        '40':  '0.40',
        '50':  '0.50',
        '60':  '0.60',
        '70':  '0.70',
        '75':  '0.75',
        '80':  '0.80',
        '85':  '0.85',
        '90':  '0.90',
        '95':  '0.95',
        '100': '1.0',
      },
    },
  },
  plugins: [],
};
