import { useState } from 'react'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'News & Viewpoints', href: '#news', dropdown: true },
]

function ArrowRight({ className = '' }) {
  return (
    <svg viewBox="0 0 36 12" fill="none" className={className} aria-hidden="true">
      <path d="M0 6h34M29 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Chevron({ className = '' }) {
  return (
    <svg viewBox="0 0 12 8" fill="none" className={className} aria-hidden="true">
      <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Logo({ name, tagline }) {
  return (
    <a href="#" className="flex items-center gap-2 text-white" aria-label={`${name} ${tagline} home`}>
      <svg viewBox="0 0 40 36" className="h-9 w-10" fill="currentColor" aria-hidden="true">
        <path d="M0 0c9 4 15 10 19 18C15 26 9 32 0 36c3-6 5-12 5-18S3 6 0 0Z" />
        <path d="M40 0c-9 4-15 10-19 18 4 8 10 14 19 18-3-6-5-12-5-18s2-12 5-18Z" opacity=".85" />
      </svg>
      <span className="flex flex-col leading-none font-display font-extrabold uppercase">
        <span className="text-[26px] tracking-[0.12em]">{name}</span>
        <span className="mt-0.5 text-[11px] tracking-[0.42em]">{tagline}</span>
      </span>
    </a>
  )
}

/**
 * Builds a bundle of parallel ribbons that pinch together where they cross.
 * `anchors` are [x, y, spread] points; `dir` is the offset axis ([1,0] for
 * vertical ribbons, [0,1] for horizontal ones). Curves are smooth
 * Catmull-Rom splines converted to cubic Béziers.
 */
function ribbonBundle(anchors, dir, count = 6, gap = 13) {
  const paths = []
  for (let i = 0; i < count; i++) {
    const k = i - (count - 1) / 2
    const pts = anchors.map(([x, y, spread]) => [x + dir[0] * k * gap * spread, y + dir[1] * k * gap * spread])
    let d = `M${pts[0][0]} ${pts[0][1]}`
    for (let j = 0; j < pts.length - 1; j++) {
      const p0 = pts[j - 1] || pts[j]
      const p1 = pts[j]
      const p2 = pts[j + 1]
      const p3 = pts[j + 2] || p2
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
      d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`
    }
    paths.push(d)
  }
  return paths
}

// All bundles pass through the crossing point around (960, 560).
const BUNDLES = [
  // Left edge → crossing → upper right
  ribbonBundle([[-60, 470, 1.6], [420, 470, 1.3], [760, 560, 0.8], [960, 560, 0.45], [1180, 470, 0.8], [1500, 330, 1.4]], [0, 1]),
  // Top → loops through crossing → bottom
  ribbonBundle([[700, -60, 1.6], [800, 220, 1.3], [930, 440, 0.8], [960, 560, 0.45], [910, 760, 0.9], [960, 980, 1.5]], [1, 0]),
  // Lower right → crossing
  ribbonBundle([[1500, 640, 1.5], [1220, 640, 1], [960, 560, 0.45]], [0, 1], 5),
  // Crossing → lower left
  ribbonBundle([[960, 560, 0.45], [700, 720, 1], [380, 960, 1.6]], [1, 0], 5),
]

function RibbonBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="animate-ribbon absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e38c54" />
            <stop offset="0.55" stopColor="#f47432" />
            <stop offset="1" stopColor="#e38c54" />
          </linearGradient>
          <linearGradient id="fold-a" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fa4614" stopOpacity="0.95" />
            <stop offset="1" stopColor="#f47432" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="fold-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f47432" stopOpacity="0.2" />
            <stop offset="1" stopColor="#fa4614" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffd2b0" />
            <stop offset="1" stopColor="#ffb98a" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="shade" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#b42a00" floodOpacity="0.45" />
          </filter>
        </defs>

        <rect width="1440" height="900" fill="url(#bg)" />

        {/* Broad soft folds that give the 3D paper depth */}
        <g filter="url(#soft)">
          <path d="M-60 560 C 420 470 900 820 1500 560 L 1500 900 L -60 900 Z" fill="url(#fold-a)" />
          <path d="M700 -60 C 760 380 1040 520 960 780 C 900 960 980 1000 1020 980 L 1240 980 C 1120 820 1180 600 1500 420 L 1500 -60 Z" fill="url(#fold-b)" />
          <path d="M1000 980 C 1100 760 1300 640 1500 600 L 1500 980 Z" fill="#fa4614" opacity="0.55" />
          <path d="M-60 900 C 200 760 520 700 900 760 L 900 960 L -60 960 Z" fill="#fa4614" opacity="0.4" />
        </g>

        {/* Stacked ribbon edges */}
        <g fill="none" strokeLinecap="round" filter="url(#shade)">
          {BUNDLES.flat().map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#fa4614" strokeWidth="11" />
              <path d={d} stroke="url(#line)" strokeWidth="1.6" opacity="0.9" />
            </g>
          ))}
        </g>

        {/* Light vignette on the left keeps the copy readable */}
        <rect width="1440" height="900" fill="url(#bg)" opacity="0.18" />
      </svg>
    </div>
  )
}

export default function GrowthHero({
  brandName = 'UK Business',
  brandTagline = 'Federation',
  headline = 'Turn your brand into a force for growth.',
  subheadline = 'The best brands aren’t built on the promises they make, they’re built on the promises they can keep.',
  ctaLabel = 'Get Started',
  ctaHref = '#get-started',
  contactHref = '#contact',
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ember-300 font-sans text-white">
      <RibbonBackdrop />

      {/* Navigation */}
      <header className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-6 pt-6 md:px-8">
        <Logo name={brandName} tagline={brandTagline} />

        <nav className="hidden items-center gap-8 text-[15px] lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 text-white/95 transition hover:text-white hover:opacity-80"
            >
              {link.label}
              {link.dropdown && <Chevron className="h-2 w-3" />}
            </a>
          ))}
          <a
            href={contactHref}
            className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-ember-500 shadow-sm transition hover:shadow-lg"
          >
            Contact Us
            <ArrowRight className="h-3 w-8 transition-transform group-hover:translate-x-1" />
          </a>
          <button type="button" className="flex items-center gap-1.5 text-white/95 hover:opacity-80">
            Join <Chevron className="h-2 w-3" />
          </button>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">Toggle menu</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </header>

      {menuOpen && (
        <div id="mobile-menu" className="relative z-10 mx-6 mt-4 rounded-3xl bg-white p-6 text-ember-500 shadow-xl lg:hidden">
          <ul className="flex flex-col gap-4 text-lg">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
              </li>
            ))}
            <li><a href="#join" onClick={() => setMenuOpen(false)}>Join</a></li>
            <li>
              <a href={contactHref} className="mt-2 inline-flex items-center gap-3 rounded-full bg-ember-500 px-6 py-3 text-white">
                Contact Us <ArrowRight className="h-3 w-8" />
              </a>
            </li>
          </ul>
        </div>
      )}

      {/* Copy */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pt-16 pb-20 md:px-8 md:pt-20">
        <h1 className="max-w-[12ch] font-display text-[clamp(3rem,7.4vw,7rem)] leading-[1.05] font-normal tracking-[-0.02em]">
          {headline}
        </h1>

        <div className="mt-8 ml-1 flex flex-col items-center text-white" aria-hidden="true">
          <span className="animate-arrow block self-start">
            <svg viewBox="0 0 12 84" className="h-20 w-3" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 0v82M1 77l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <p className="mt-10 max-w-[30ch] font-display text-[clamp(1.375rem,2.5vw,2.25rem)] leading-[1.3] font-normal">
          {subheadline}
        </p>

        <a
          href={ctaHref}
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[17px] text-ember-500 shadow-sm transition hover:shadow-lg"
        >
          {ctaLabel}
          <ArrowRight className="h-3 w-8 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  )
}
