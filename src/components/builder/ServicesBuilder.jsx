import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Icon from './BuilderIcons.jsx'
import { BrowserFrame, PhoneFrame } from './DevicePreview.jsx'
import { MODULES, MODULE_BY_ID, PLATFORMS, getPlan } from './modules.js'
import { ArrowRight } from '../icons.jsx'

const PRESETS = [
  { label: 'Fintech app', platform: 'mobile', modules: ['design', 'backend', 'auth', 'payments', 'analytics', 'notifications'] },
  { label: 'Delivery app', platform: 'mobile', modules: ['design', 'backend', 'auth', 'maps', 'chat', 'payments'] },
  { label: 'AI SaaS', platform: 'web', modules: ['design', 'backend', 'auth', 'ai', 'analytics', 'admin'] },
]

const DRAG_THRESHOLD = 6

function ModuleCard({ mod, added, onToggle, onDragStart }) {
  return (
    <button
      type="button"
      aria-pressed={added}
      onClick={(e) => onToggle(mod.id, e)}
      onPointerDown={(e) => onDragStart(mod.id, e)}
      className={`group relative flex w-[264px] shrink-0 touch-pan-x touch-pan-y lg:w-full items-center gap-3 rounded-2xl border p-3 text-left transition duration-300 select-none ${
        added
          ? 'border-ember-500/60 bg-ember-500/[0.12]'
          : 'border-white/10 bg-white/[0.04] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.07]'
      } cursor-grab active:cursor-grabbing`}
    >
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300 ${added ? 'bg-ember-500 text-white' : 'bg-white/[0.08] text-white group-hover:bg-ember-500'}`}>
        <Icon name={mod.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 font-display text-[15px] font-semibold text-white">
          {mod.name}
          {mod.core && <span className="rounded-full border border-white/20 px-1.5 py-px text-[9px] font-semibold tracking-[0.08em] text-white/70 uppercase">Core</span>}
        </span>
        <span className="block truncate text-[12px] text-white/50">{mod.desc}</span>
      </span>
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition duration-300 ${added ? 'bg-white text-black' : 'border border-white/15 text-white/60 group-hover:border-white/40 group-hover:text-white'}`}>
        <Icon name={added ? 'check' : 'plus'} className="h-3.5 w-3.5" strokeWidth={2.4} />
      </span>
    </button>
  )
}

function ReadinessRing({ value }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <div className="relative h-28 w-28 shrink-0">
      <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="ring-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#E38C54" />
            <stop offset="1" stopColor="#FA4614" />
          </linearGradient>
        </defs>
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,254,0.1)" strokeWidth="9" />
        <circle
          cx="56"
          cy="56"
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-[24px] leading-none font-extrabold text-white tabular-nums">{value}%</div>
          <div className="mt-1 text-[9px] font-semibold tracking-[0.12em] text-white/55 uppercase">Ready</div>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] text-white/55">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 font-display text-[22px] leading-tight font-extrabold text-white tabular-nums">{value}</div>
    </div>
  )
}

export default function ServicesBuilder({ contactHref = '#contact' }) {
  const [platform, setPlatform] = useState('mobile')
  const [selected, setSelected] = useState([])
  const [latest, setLatest] = useState(null)
  const [launched, setLaunched] = useState(false)
  const [drag, setDrag] = useState(null) // { id, x, y, over }
  const dropRef = useRef(null)
  const dragInfo = useRef(null)
  const suppressClick = useRef(false)

  const plan = useMemo(() => getPlan(selected, platform), [selected, platform])
  const ready = plan.readiness === 100

  const add = useCallback((id) => {
    setSelected((s) => (s.includes(id) ? s : [...s, id]))
    setLatest(id)
    setLaunched(false)
  }, [])
  const remove = useCallback((id) => {
    setSelected((s) => s.filter((x) => x !== id))
    setLaunched(false)
  }, [])

  const toggle = (id) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    if (selected.includes(id)) remove(id)
    else add(id)
  }

  const isOverDrop = (x, y) => {
    const r = dropRef.current?.getBoundingClientRect()
    return !!r && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom
  }

  // Pointer-based drag for mouse and pen; touch uses tap-to-add so lists can still scroll.
  const startDrag = (id, e) => {
    if (e.pointerType === 'touch' || e.button !== 0) return
    dragInfo.current = { id, sx: e.clientX, sy: e.clientY, active: false }
  }

  useEffect(() => {
    const move = (e) => {
      const d = dragInfo.current
      if (!d) return
      if (!d.active && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < DRAG_THRESHOLD) return
      d.active = true
      setDrag({ id: d.id, x: e.clientX, y: e.clientY, over: isOverDrop(e.clientX, e.clientY) })
    }
    const up = (e) => {
      const d = dragInfo.current
      dragInfo.current = null
      if (!d?.active) return
      suppressClick.current = true
      setTimeout(() => (suppressClick.current = false), 0)
      if (isOverDrop(e.clientX, e.clientY)) add(d.id)
      setDrag(null)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [add])

  const applyPreset = (p) => {
    setPlatform(p.platform)
    setSelected(p.modules)
    setLatest(p.modules[p.modules.length - 1])
    setLaunched(false)
  }

  const reset = () => {
    setSelected([])
    setLatest(null)
    setLaunched(false)
  }

  const screenProps = { selected, latest, over: !!drag?.over, launched }
  const dragged = drag && MODULE_BY_ID[drag.id]
  const planSummary = encodeURIComponent(
    `Platform: ${PLATFORMS.find((p) => p.id === platform).label}\nServices: ${selected.map((id) => MODULE_BY_ID[id].name).join(', ')}\nEstimate: ${plan.minWeeks}–${plan.maxWeeks} weeks, team of ${plan.team}`,
  )

  return (
    <section id="services" className="relative overflow-hidden bg-[#0a0a0a] font-sans text-white" aria-label="Our services: build your product">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full bg-ember-500/30 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-ember-400/20 blur-[120px]" />
        <div className="absolute -bottom-60 left-1/3 h-[520px] w-[720px] rounded-full bg-ember-300/15 blur-[120px]" />
        <div className="builder-grid absolute inset-0" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-20 md:px-8 md:py-28">
        {/* heading */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.18em] text-white/60 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-ember-500" /> Our services
            </div>
            <h2 className="mt-4 font-display text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-normal tracking-[-0.03em]">
              Build your product.
              <br />
              <span className="text-white/45">Right here, right now.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-white/65">
              Drag our services into the device and watch your app take shape, with a live timeline, team and tech stack.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">I want to build a</span>
            <div role="radiogroup" aria-label="Platform" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={platform === p.id}
                  onClick={() => {
                    setPlatform(p.id)
                    setLaunched(false)
                  }}
                  className={`flex items-center gap-2 rounded-full px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition sm:px-4 sm:text-[14px] ${platform === p.id ? 'bg-white text-black shadow' : 'text-white/70 hover:text-white'}`}
                >
                  <Icon name={p.icon} className="h-4 w-4" />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* builder */}
        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)_340px] xl:grid-cols-[360px_minmax(0,1fr)_360px]">
          {/* library */}
          <div className="order-2 min-w-0 lg:order-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold">Services</h3>
              <span className="text-[12px] text-white/50 tabular-nums">{selected.length} / {MODULES.length} added</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="py-1.5 text-[12px] text-white/50">Quick start:</span>
              {PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => applyPreset(p)} className="rounded-full border border-white/15 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:border-white hover:bg-white hover:text-black">
                  {p.label}
                </button>
              ))}
            </div>
            <div className="builder-scroll -mx-6 mt-4 flex gap-2.5 overflow-x-auto px-6 pb-2 lg:mx-0 lg:max-h-[560px] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:px-0 lg:pr-1">
              {MODULES.map((m) => (
                <ModuleCard key={m.id} mod={m} added={selected.includes(m.id)} onToggle={toggle} onDragStart={startDrag} />
              ))}
            </div>
          </div>

          {/* stage */}
          <div
            ref={dropRef}
            className={`relative order-1 flex min-h-[640px] min-w-0 items-center justify-center overflow-hidden rounded-[32px] border transition-colors duration-300 lg:order-2 ${
              drag?.over ? 'border-ember-500 bg-ember-500/[0.08]' : drag ? 'border-dashed border-white/30 bg-white/[0.03]' : 'border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="builder-stage-glow pointer-events-none absolute inset-x-10 bottom-0 h-40 rounded-full bg-ember-500/25 blur-[70px]" aria-hidden="true" />
            {platform === 'mobile' && <PhoneFrame {...screenProps} />}
            {platform === 'web' && (
              <div className="w-full px-4">
                <div className="mx-auto max-w-[660px]"><BrowserFrame {...screenProps} /></div>
              </div>
            )}
            {platform === 'both' && (
              <div className="relative h-[600px] w-full max-w-[640px]">
                <div className="absolute top-6 left-4 w-[88%] origin-top-left opacity-90">
                  <BrowserFrame {...screenProps} />
                </div>
                <div className="absolute right-2 bottom-0 origin-bottom-right scale-[0.78]">
                  <PhoneFrame {...screenProps} />
                </div>
              </div>
            )}
            {selected.length === 0 && !drag && (
              <div className="builder-hint pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-black shadow-lg lg:flex">
                <Icon name="grip" className="h-4 w-4" /> Drag a service from the left
              </div>
            )}
          </div>

          {/* blueprint */}
          <aside className="order-3 flex min-w-0 flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm md:p-6" aria-live="polite">
            <div className="flex items-center gap-5">
              <ReadinessRing value={plan.readiness} />
              <div>
                <div className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">Launch readiness</div>
                <div className="mt-1 font-display text-[19px] leading-snug font-semibold text-white">
                  {ready ? 'Ready for lift-off' : selected.length ? 'Taking shape…' : 'Start building'}
                </div>
                <div className="mt-1 text-[12px] leading-snug text-white/55">
                  {ready ? 'Every core piece is in place.' : `Needs: ${plan.missing.join(', ')}`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat icon="clock" label="Timeline" value={selected.length ? `${plan.minWeeks}–${plan.maxWeeks} wks` : '—'} />
              <Stat icon="team" label="Team" value={selected.length ? `${plan.team} experts` : '—'} />
            </div>

            <div>
              <div className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">Tech stack</div>
              <div className="mt-2 flex min-h-8 flex-wrap gap-1.5">
                {plan.stack.map((s) => (
                  <span key={s} className="builder-pop rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[12px] text-white">{s}</span>
                ))}
              </div>
            </div>

            {selected.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">Your build</span>
                  <button type="button" onClick={reset} className="flex items-center gap-1 text-[12px] text-white/55 transition hover:text-white">
                    <Icon name="reset" className="h-3.5 w-3.5" /> Reset
                  </button>
                </div>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {selected.map((id) => (
                    <li key={id} className="builder-pop flex items-center gap-1.5 rounded-full bg-white py-1 pr-1 pl-2.5 text-[12px] font-semibold text-black">
                      {MODULE_BY_ID[id].name}
                      <button type="button" onClick={() => remove(id)} aria-label={`Remove ${MODULE_BY_ID[id].name}`} className="grid h-5 w-5 place-items-center rounded-full bg-black/10 transition hover:bg-black hover:text-white">
                        <Icon name="x" className="h-3 w-3" strokeWidth={2.6} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex flex-col gap-2.5 pt-2">
              <button
                type="button"
                disabled={!ready}
                onClick={() => setLaunched(true)}
                className={`flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition ${
                  ready ? 'builder-ready bg-ember-500 text-white hover:shadow-[0_10px_40px_rgba(250,70,20,0.55)]' : 'cursor-not-allowed bg-white/[0.06] text-white/40'
                }`}
              >
                <Icon name="rocket" className="h-4 w-4" />
                {launched ? 'Launched!' : 'Launch your product'}
              </button>
              <a
                href={selected.length ? `${contactHref}?plan=${planSummary}` : contactHref}
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-black transition hover:shadow-[0_10px_30px_rgba(255,255,254,0.25)]"
              >
                {selected.length ? 'Send me this plan' : 'Talk to our team'}
                <ArrowRight className="h-3 w-7 transition-transform group-hover:translate-x-1" />
              </a>
              <p className="text-center text-[11px] text-white/40">Rough estimate. We confirm scope on a free 30-min call.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* drag ghost */}
      {dragged && (
        <div className="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-1/2 -rotate-3 items-center gap-3 rounded-2xl bg-white py-2.5 pr-4 pl-2.5 text-black shadow-[0_25px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(250,70,20,0.45)]" style={{ left: drag.x, top: drag.y }}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ember-500 text-white">
            <Icon name={dragged.icon} className="h-4.5 w-4.5" />
          </span>
          <span className="font-display text-[14px] font-semibold">{dragged.name}</span>
        </div>
      )}
    </section>
  )
}
