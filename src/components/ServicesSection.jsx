import { useEffect, useRef } from 'react'
import { ArrowRight } from './icons.jsx'
import './ServicesSection.css'

const NAMES = [
  'iOS apps',
  'Android apps',
  'Flutter',
  'React Native',
  'UI / UX design',
  'Backend & APIs',
  'Cloud & DevOps',
  'QA & testing',
  'AI features',
  'App store growth',
  'Web apps',
  'Support & maintenance',
]

// Ring constants (from services-kit)
const W = 300
const H = 420
const STEP = (19.5 * Math.PI) / 180 // angle between posters
const CUTOFF = 86 // degrees: beyond this a poster is parked out of sight
const FADE_START = 52
const FADE_RANGE = 34
const EASE = 0.14 // per-frame easing toward the scroll position
const TURN_PER_POSTER = 0.42 // × viewport height of scroll per poster
const HOLD = 0.3 // × viewport height the last poster stays put

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)

function useServiceRing(sectionRef, stageRef, countRef, nameRef) {
  useEffect(() => {
    const sec = sectionRef.current
    const stage = stageRef.current
    if (!sec || !stage) return undefined

    const cards = Array.from(stage.querySelectorAll('.poster'))
    const N = cards.length
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let k = 1
    let R = 1000
    let A = 1
    let D = 0
    let baseY = 0
    let cur = 0
    let lastIdx = -1
    let frame = 0

    const layout = () => {
      const vh = window.innerHeight
      const vw = document.documentElement.clientWidth
      const sh = stage.clientHeight
      const topGap = Math.max(36, sh * 0.07)
      // posters fill the height between the heading and the counter
      k = Math.min(1.5, (sh - topGap - 28) / H, (vw * (vw < 700 ? 0.74 : 0.62)) / W)
      baseY = -sh / 2 + (H * k) / 2 + topGap
      R = 1000 * k
      stage.style.perspective = `${1450 * k}px`
      A = (N - 1) * TURN_PER_POSTER * vh
      D = still ? 0 : A + HOLD * vh
      sec.style.height = `${vh + D}px`
    }

    const render = (s) => {
      const rot = still ? 0 : clamp(s / A, 0, 1) * (N - 1) * STEP
      for (let i = 0; i < N; i++) {
        const th = i * STEP - rot
        const ad = (Math.abs(th) * 180) / Math.PI
        let x
        let z
        let a
        let op
        if (ad <= CUTOFF) {
          x = R * Math.sin(th)
          z = R - R * Math.cos(th)
          a = -th
          op = ad <= FADE_START ? 1 : 1 - (ad - FADE_START) / FADE_RANGE
        } else {
          const sg = th > 0 ? 1 : -1
          x = sg * R * 1.3
          z = -R * 0.6
          a = -sg
          op = 0
        }
        const c = cards[i]
        c.style.transform = `translate3d(${x.toFixed(1)}px,${baseY.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${a.toFixed(4)}rad) scale(${k.toFixed(4)})`
        c.style.opacity = op.toFixed(3)
        c.style.visibility = op < 0.01 ? 'hidden' : 'visible'
        c.setAttribute('aria-hidden', op < 0.5 ? 'true' : 'false')
      }
      const idx = clamp(Math.round(rot / STEP), 0, N - 1)
      if (idx !== lastIdx) {
        lastIdx = idx
        if (countRef.current) countRef.current.textContent = `${idx < 9 ? '0' : ''}${idx + 1} / ${N}`
        if (nameRef.current) nameRef.current.textContent = NAMES[idx] || ''
      }
    }

    const loop = () => {
      const r = sec.getBoundingClientRect()
      if (r.bottom > -50 && r.top < window.innerHeight + 50) {
        const s = clamp(-r.top, 0, D)
        cur += (s - cur) * EASE
        if (Math.abs(s - cur) < 0.5) cur = s
        render(cur)
      }
      frame = requestAnimationFrame(loop)
    }

    const onResize = () => {
      layout()
      render(cur)
    }

    layout()
    render(0)
    window.addEventListener('resize', onResize)
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [sectionRef, stageRef, countRef, nameRef])
}

const SPARK_COLORS = ['255, 255, 254', '255, 214, 186', '250, 70, 20', '244, 116, 50']

/** Twinkling sparkles on a canvas; paused while off screen, static with reduced motion. */
function Sparkles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let sparks = []
    let frame = 0
    let visible = false

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w * h) / 3200)
      sparks = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.1 ? 1.4 + Math.random() * 1.2 : 0.4 + Math.random() * 0.8,
        c: SPARK_COLORS[Math.random() < 0.6 ? 0 : 1 + Math.floor(Math.random() * 3)],
        speed: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        vy: -(0.03 + Math.random() * 0.12),
      }))
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const time = t / 1000
      for (const p of sparks) {
        if (!still) {
          p.y += p.vy
          if (p.y < -4) p.y = h + 4
        }
        const tw = Math.pow(0.5 + 0.5 * Math.sin(time * p.speed + p.phase), 3)
        const a = 0.15 + tw * 0.85
        ctx.fillStyle = `rgba(${p.c}, ${a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        // the bigger sparks flare into a small cross when they peak
        if (p.r > 1.3 && tw > 0.6) {
          const len = p.r * 6 * tw
          ctx.strokeStyle = `rgba(${p.c}, ${(tw - 0.6) * 1.6})`
          ctx.lineWidth = 0.8
          ctx.beginPath()
          ctx.moveTo(p.x - len, p.y)
          ctx.lineTo(p.x + len, p.y)
          ctx.moveTo(p.x, p.y - len)
          ctx.lineTo(p.x, p.y + len)
          ctx.stroke()
        }
      }
    }

    const loop = (t) => {
      draw(t)
      frame = visible && !still ? requestAnimationFrame(loop) : 0
    }

    build()
    draw(0)
    const ro = new ResizeObserver(() => {
      build()
      draw(performance.now())
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame && !still) frame = requestAnimationFrame(loop)
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" />
}

export default function ServicesSection({ brandName = 'UK Business', contactHref = '#contact' }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const countRef = useRef(null)
  const nameRef = useRef(null)
  useServiceRing(sectionRef, stageRef, countRef, nameRef)

  return (
    <section ref={sectionRef} className="svc3d" id="services" aria-label="Our services">
      <div className="svc3d-sticky">
        <div className="svc3d-bg" aria-hidden="true">
          <span className="glow glow-a" />
          <span className="glow glow-b" />
          <span className="glow glow-c" />
          <Sparkles />
        </div>
        <div className="svc3d-wrap svc3d-head">
          <h2>Our Services</h2>
          <a className="svc3d-cta group" href={contactHref}>
            Start a project
            <ArrowRight />
          </a>
        </div>

        <div className="svc3d-stage" ref={stageRef}>
          <article className="poster p-ios">
            <div className="meta"><span>{brandName}</span><span>01 · Native</span></div>
            <h3 className="title">iOS<br />Apps</h3>
            <svg className="scribble" viewBox="0 0 300 200" aria-hidden="true">
              <path d="M20 150 C 60 40, 120 20, 140 90 S 210 190, 250 80 S 180 10, 120 120 S 60 190, 30 110 C 10 60, 90 40, 160 60 S 290 120, 270 170" fill="none" stroke="#E38C54" strokeWidth="1.4" />
            </svg>
            <div className="desc"><span>SwiftUI apps built for speed, smooth animation and every Apple device.</span><span>Widgets, Apple Pay, HealthKit and App Store submission.</span></div>
          </article>

          <article className="poster p-android">
            <div className="meta"><span>{brandName}</span><span>02 · Native</span></div>
            <h3 className="title">Andr<br />oid.</h3>
            <div className="dots" aria-hidden="true" />
            <div className="desc"><span>Kotlin and Jetpack Compose apps for every Android screen size.</span><span>Material design, Play Store release and device testing.</span></div>
          </article>

          <article className="poster p-flutter">
            <div className="meta"><span>{brandName}</span><span>03 · Cross-platform</span></div>
            <div className="halo" aria-hidden="true" />
            <h3 className="title">Flutter</h3>
            <div className="desc"><span>One codebase, two stores, native feel.</span><span>Faster launch and lower upkeep.</span></div>
          </article>

          <article className="poster p-rn">
            <div className="meta"><span>{'{ React Native }'}</span><span>04</span></div>
            <div className="hex" aria-hidden="true" />
            <h3 className="title">React<br />Native</h3>
            <div className="desc"><span>JavaScript teams, shared logic with your web app.</span><span>Over-the-air updates without a store release.</span></div>
          </article>

          <article className="poster p-ux">
            <div className="meta"><span>{brandName}</span><span>05 · Design</span></div>
            <h3 className="title"><span>UI</span><span>UX</span></h3>
            <div className="desc"><span>Research, flows, prototypes and design systems.</span><span>Screens people understand on the first tap.</span></div>
          </article>

          <article className="poster p-api">
            <div className="meta"><span>{brandName}</span><span>06 · Backend</span></div>
            <pre className="code" aria-hidden="true">{`GET  /v1/events      200
POST /v1/plans       201
GET  /v1/users/me    200
WS   /live/updates   open
POST /v1/payments    201
GET  /v1/feed?page=2 200`}</pre>
            <h3 className="title">Backend<br />&amp; APIs</h3>
            <div className="desc"><span>REST, GraphQL and real-time sync.</span><span>Auth, payments and admin panels.</span></div>
          </article>

          <article className="poster p-cloud">
            <div className="meta"><span>{brandName}</span><span>07 · Infrastructure</span></div>
            <div className="rings" aria-hidden="true"><i /><i /><i /></div>
            <h3 className="title">Cloud &amp;<br />DevOps</h3>
            <div className="desc"><span>AWS, Google Cloud and Firebase set up to scale.</span><span>CI/CD pipelines and uptime monitoring.</span></div>
          </article>

          <article className="poster p-qa">
            <div className="meta"><span>{brandName}</span><span>08 · Quality</span></div>
            <h3 className="title">QA &amp;<br />Testing</h3>
            <div className="checks" aria-hidden="true">
              {Array.from({ length: 11 }, (_, i) => <i key={i} />)}
              <i className="x" />
            </div>
            <div className="desc"><span>Automated and manual testing on real devices.</span><span>Crash-free releases, every sprint.</span></div>
          </article>

          <article className="poster p-ai">
            <div className="meta"><span>{brandName}</span><span>09 · Intelligence</span></div>
            <div className="arc" aria-hidden="true" />
            <h3 className="title">AI<small>Features</small></h3>
            <div className="desc"><span>Chat assistants, smart search and recommendations.</span><span>On-device and cloud models.</span></div>
          </article>

          <article className="poster p-growth">
            <div className="meta"><span>{brandName}</span><span>10 · Growth</span></div>
            <div className="bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
            <h3 className="title">App Store<br />Growth</h3>
            <div className="desc"><span>App store optimisation and launch plans.</span><span>Analytics, A/B tests and retention.</span></div>
          </article>

          <article className="poster p-web">
            <div className="meta"><span>{brandName}</span><span>11 · Web</span></div>
            <h3 className="title">WEB</h3>
            <div className="browser" aria-hidden="true"><b /><b /><b /></div>
            <div className="desc"><span>Web apps and dashboards that pair with your mobile app.</span><span>React, Next.js and admin tools.</span></div>
          </article>

          <article className="poster p-care">
            <div className="meta"><span>{brandName}</span><span>12 · Care</span></div>
            <h3 className="title"><span className="big">24/7</span>Support &amp;<br />maintenance</h3>
            <div className="desc"><span>OS updates, bug fixes and security patches.</span><span>Monthly feature work after launch.</span></div>
          </article>
        </div>

        <div className="svc3d-wrap svc3d-foot" aria-live="polite">
          <span className="count" ref={countRef}>01 / 12</span>
          <span className="name" ref={nameRef}>iOS apps</span>
        </div>
      </div>
    </section>
  )
}
