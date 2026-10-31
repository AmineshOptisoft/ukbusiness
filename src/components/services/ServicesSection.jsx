import { useEffect, useRef } from 'react'
import ServiceArt from './ServiceArt.jsx'
import './services.css'

const SERVICES = [
  { id: 'web', art: 'flow', name: 'Web Development', tag: 'Development', title: 'Web platforms and portals engineered to scale with you', href: '#web-development' },
  { id: 'mobile', art: 'weave', name: 'Mobile Apps', tag: 'Development', title: 'Native and cross-platform iOS & Android apps people love', href: '#mobile-apps' },
  { id: 'ai', art: 'grid', name: 'AI Solutions', tag: 'Artificial intelligence', title: 'AI assistants and automation that give your team hours back', href: '#ai-solutions' },
  { id: 'design', art: 'blob', name: 'UI / UX Design', tag: 'Design', title: 'Research-led product design and systems that convert', href: '#ui-ux-design' },
  { id: 'cloud', art: 'rings', name: 'Cloud & DevOps', tag: 'Infrastructure', title: 'Cloud architecture, CI/CD and monitoring that never sleeps', href: '#cloud-devops' },
  { id: 'qa', art: 'checks', name: 'QA & Testing', tag: 'Quality', title: 'Automated and manual testing for zero-surprise releases', href: '#qa-testing' },
]

const ICONS = {
  web: 'M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14',
  mobile: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2',
  ai: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z',
  design: 'M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5zM2 2l7.586 7.586',
  cloud: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  qa: 'M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
}

// Bottom-right cut-out, drawn in the page colour over the card corner.
const NOTCH = 'M0 66 C8 66 13 63 16 56 L40 9 C43 3 47 0 55 0 L132 0 Q150 0 150 -18 L150 66 Z'

function Arrow({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/** Adds `.is-in` to every `.svc-reveal` inside the root once it scrolls into view. */
function useReveal(rootRef) {
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll('.svc-reveal') ?? []
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'))
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.15 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [rootRef])
}

/** Mouse-follow 3D tilt; skipped for touch and reduced-motion users. */
function useTilt() {
  const canTilt = useRef(false)
  useEffect(() => {
    canTilt.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const onPointerMove = (e) => {
    if (!canTilt.current || e.pointerType !== 'mouse') return
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    const k = card.dataset.big ? 0.35 : 1 // wide card tilts less
    card.style.setProperty('--rx', `${(-y * 6 * k).toFixed(2)}deg`)
    card.style.setProperty('--ry', `${(x * 8 * k).toFixed(2)}deg`)
    card.style.setProperty('--sx', `${(-x * 30).toFixed(1)}px`)
    card.style.setProperty('--lx', `${(x * 16).toFixed(1)}px`)
    card.style.setProperty('--ly', `${(y * 12).toFixed(1)}px`)
  }
  const onPointerLeave = (e) => {
    ;['--rx', '--ry', '--sx', '--lx', '--ly'].forEach((p) => e.currentTarget.style.removeProperty(p))
  }
  return { onPointerMove, onPointerLeave }
}

function ServiceCard({ service, index, big, tilt }) {
  return (
    <div className={`svc-reveal svc-cell ${big ? 'svc-cell-big' : ''}`} style={{ '--d': `${index * 90}ms` }}>
      <a href={service.href} className={`svc-card ${big ? 'svc-card-big' : ''}`} data-big={big || undefined} {...tilt}>
        <div className={`svc-img svc-img-${service.art}`}>
          <ServiceArt kind={service.art} />
          <span className="svc-num">{String(index + 1).padStart(2, '0')}</span>
          <span className="svc-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={ICONS[service.id]} />
            </svg>
            {service.name}
          </span>
        </div>
        <div className="svc-body">
          <span className="svc-tag">{service.tag}</span>
          <h3 className="svc-title">{service.title}</h3>
          <span className="svc-foot">Explore service</span>
        </div>
        <svg className="svc-notch" viewBox="0 -18 150 84" aria-hidden="true">
          <path d={NOTCH} />
        </svg>
        <span className="svc-arrow">
          <Arrow />
        </span>
      </a>
    </div>
  )
}

export default function ServicesSection({ allServicesHref = '#services', contactHref = '#contact' }) {
  const rootRef = useRef(null)
  useReveal(rootRef)
  const tilt = useTilt()

  return (
    <section id="services" ref={rootRef} className="svc" aria-labelledby="services-heading">
      <div className="svc-wrap">
        <div className="svc-top">
          <div>
            <span className="svc-eyebrow">Our services</span>
            <h2 id="services-heading" className="svc-heading svc-reveal">
              <span className="svc-line">
                <span>Services that move</span>
              </span>
              <span className="svc-line">
                <span>your business forward</span>
              </span>
            </h2>
          </div>
          <div className="svc-reveal svc-intro" style={{ '--d': '200ms' }}>
            <p>From first sketch to global launch, one team builds, ships and scales your product.</p>
            <a href={allServicesHref} className="svc-btn">
              View all services <Arrow className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>

        <div className="svc-grid">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} big={i === 0} tilt={tilt} />
          ))}

          <div className="svc-reveal svc-cell svc-cell-cta" style={{ '--d': `${SERVICES.length * 90}ms` }}>
            <div className="svc-cta">
              <a href={contactHref} className="svc-badge" aria-label="Book a free 30-minute call">
                <svg className="svc-badge-ring" viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <path id="svc-badge-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
                  </defs>
                  <text>
                    <textPath href="#svc-badge-circle" textLength="236" lengthAdjust="spacing">
                      FREE 30-MIN CALL • FREE 30-MIN CALL •
                    </textPath>
                  </text>
                </svg>
                <Arrow className="svc-badge-arrow" />
              </a>
              <span className="svc-eyebrow svc-eyebrow-light">Not sure where to start?</span>
              <h3>Tell us your idea. We’ll map the right services, team and timeline in one call.</h3>
              <a href={contactHref} className="svc-btn svc-btn-light">
                Book a free call <Arrow className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
