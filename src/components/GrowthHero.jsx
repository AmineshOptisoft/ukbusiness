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

function VideoBackdrop({ src, poster }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      {/* Orange tint: multiply turns the white/grey video into brand-orange stripes */}
      <div className="absolute inset-0 bg-gradient-to-br from-ember-300 via-ember-400 to-ember-500 mix-blend-multiply" />
      {/* Extra wash on the left keeps the white copy readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-ember-500/40 via-ember-400/10 to-transparent" />
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
  videoSrc = '/videos/hero.mp4',
  videoPoster = '/videos/hero-poster.jpg',
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ember-300 font-sans text-white">
      <VideoBackdrop src={videoSrc} poster={videoPoster} />

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
