import { useEffect, useRef } from 'react'
import Icon from './BuilderIcons.jsx'

// Order widgets appear in on the screen, regardless of the order they were added.
const SCREEN_ORDER = ['auth', 'payments', 'ai', 'analytics', 'maps', 'chat', 'admin']

function Tile({ children, className = '' }) {
  return <div className={`builder-pop rounded-2xl border border-black/[0.06] bg-white p-3 shadow-[0_6px_18px_rgba(10,10,10,0.06)] ${className}`}>{children}</div>
}

function Label({ icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-black/45 uppercase">
      <Icon name={icon} className="h-3 w-3" strokeWidth={2.2} />
      {children}
    </div>
  )
}

const WIDGETS = {
  auth: () => (
    <div className="builder-pop flex items-center gap-3 px-1">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-ember-300 to-ember-500 text-sm font-bold text-white">PS</div>
      <div>
        <div className="text-[11px] text-black/50">Good morning</div>
        <div className="font-display text-[15px] font-extrabold text-black">Priya Sharma</div>
      </div>
    </div>
  ),
  payments: () => (
    <div className="builder-pop relative overflow-hidden rounded-2xl bg-ember-500 p-4 text-white shadow-[0_10px_24px_rgba(250,70,20,0.35)]">
      <div className="absolute -top-8 -right-6 h-24 w-24 rounded-full bg-white/15" />
      <div className="text-[10px] font-semibold tracking-[0.1em] text-white/75 uppercase">Balance</div>
      <div className="font-display text-[26px] font-extrabold tracking-tight">$12,480.50</div>
      <div className="mt-3 flex gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black">Pay</span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white">Send</span>
      </div>
    </div>
  ),
  ai: () => (
    <Tile>
      <Label icon="sparkle">AI assistant</Label>
      <div className="mt-2 rounded-xl rounded-tl-sm bg-black/[0.04] px-3 py-2 text-[12px] leading-snug text-black">You spent 18% less on food this month. Want a savings plan?</div>
      <div className="mt-2 flex items-center justify-between rounded-full border border-black/10 py-1.5 pr-1.5 pl-3 text-[11px] text-black/40">
        Ask anything…
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ember-500 text-white"><Icon name="sparkle" className="h-3 w-3" strokeWidth={2.4} /></span>
      </div>
    </Tile>
  ),
  analytics: () => (
    <Tile>
      <div className="flex items-start justify-between">
        <div>
          <Label icon="chart">This week</Label>
          <div className="mt-1 font-display text-[20px] font-extrabold text-black">+24.6%</div>
        </div>
        <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold text-white">Live</span>
      </div>
      <svg viewBox="0 0 200 50" className="mt-1 h-12 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#FA4614" stopOpacity="0.3" />
            <stop offset="1" stopColor="#FA4614" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 42 L25 36 L50 39 L75 26 L100 30 L125 18 L150 22 L175 9 L200 4 L200 50 L0 50Z" fill="url(#spark-fill)" />
        <path d="M0 42 L25 36 L50 39 L75 26 L100 30 L125 18 L150 22 L175 9 L200 4" fill="none" stroke="#FA4614" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </Tile>
  ),
  maps: () => (
    <div className="builder-pop relative h-28 overflow-hidden rounded-2xl bg-[#f3efe9]">
      <svg viewBox="0 0 300 120" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-10 80 C 60 60, 120 100, 190 70 S 280 40, 320 55" stroke="#fff" strokeWidth="10" fill="none" />
        <path d="M110 -10 C 120 40, 90 80, 130 130" stroke="#fff" strokeWidth="8" fill="none" />
        <path d="M200 -10 L 230 130" stroke="#fff" strokeWidth="6" fill="none" />
        <path d="M40 90 C 90 70, 120 60, 168 52" stroke="#FA4614" strokeWidth="3" strokeDasharray="6 5" fill="none" />
      </svg>
      <div className="absolute top-[30px] left-[52%] grid h-8 w-8 -translate-x-1/2 place-items-center rounded-full bg-ember-500 text-white shadow-[0_0_0_6px_rgba(250,70,20,0.2)]">
        <Icon name="pin" className="h-4 w-4" strokeWidth={2.2} />
      </div>
      <div className="absolute bottom-2 left-2 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-black shadow">Driver · 4 min away</div>
    </div>
  ),
  chat: () => (
    <Tile className="space-y-2">
      <Label icon="chat">Messages</Label>
      {[
        ['AK', 'Arjun', 'Sent the new designs 🎉', '2m'],
        ['MJ', 'Maya', 'Can we ship on Friday?', '9m'],
      ].map(([init, who, msg, t]) => (
        <div key={who} className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-[10px] font-bold text-white">{init}</div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between text-[12px] font-semibold text-black">{who}<span className="font-normal text-black/40">{t}</span></div>
            <div className="truncate text-[11px] text-black/55">{msg}</div>
          </div>
        </div>
      ))}
    </Tile>
  ),
  admin: () => (
    <Tile>
      <Label icon="dashboard">Admin</Label>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {[
          ['1,284', 'Orders'],
          ['2.4k', 'Users'],
          ['98%', 'Uptime'],
        ].map(([v, l]) => (
          <div key={l} className="rounded-xl bg-black/[0.04] py-2">
            <div className="font-display text-[14px] font-extrabold text-black">{v}</div>
            <div className="text-[9px] text-black/50">{l}</div>
          </div>
        ))}
      </div>
    </Tile>
  ),
}

function AppHeader({ styled, hasAuth }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`grid h-7 w-7 place-items-center rounded-lg ${styled ? 'bg-ember-500' : 'bg-black/15'}`}>
          <div className="h-2.5 w-2.5 rotate-45 rounded-[3px] bg-white" />
        </div>
        <span className="font-display text-[15px] font-extrabold text-black">Nova</span>
      </div>
      {hasAuth && <div className="h-7 w-7 rounded-full bg-gradient-to-br from-ember-300 to-ember-500" />}
    </div>
  )
}

function EmptyScreen({ over }) {
  return (
    <div className="flex h-full flex-col gap-3">
      {[70, 100, 100, 60].map((w, i) => (
        <div key={i} className="rounded-xl bg-black/[0.05]" style={{ width: `${w}%`, height: i === 1 ? 92 : i === 2 ? 60 : 14 }} />
      ))}
      <div className={`mt-auto mb-2 grid place-items-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${over ? 'border-ember-500 bg-ember-500/5' : 'border-black/15'}`}>
        <div className={`grid h-10 w-10 place-items-center rounded-full ${over ? 'bg-ember-500 text-white' : 'bg-black/5 text-black/50'}`}>
          <Icon name="plus" className="h-5 w-5" />
        </div>
        <div className="mt-2 text-[12px] font-semibold text-black/70">Drop a service here</div>
        <div className="text-[10px] text-black/40">or tap one from the list</div>
      </div>
    </div>
  )
}

function LaunchOverlay() {
  return (
    <div className="builder-launch absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-ember-400 to-ember-500 text-center text-white">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="builder-confetti absolute top-[-10px] block h-2 w-1.5 rounded-sm"
          style={{ left: `${(i * 53) % 100}%`, background: i % 3 ? '#fffffe' : '#0a0a0a', animationDelay: `${(i % 6) * 0.12}s` }}
        />
      ))}
      <div className="relative z-10 flex flex-col items-center">
      <div className="builder-rocket grid h-16 w-16 place-items-center rounded-full bg-white text-black">
        <Icon name="rocket" className="h-8 w-8" />
      </div>
      <div className="mt-4 font-display text-[24px] font-extrabold">You’re live!</div>
      <div className="mt-1 px-6 text-[12px] text-white/85">Your product is ready for the store. Let’s build it for real.</div>
      </div>
    </div>
  )
}

/** Screen contents shared by the phone and browser frames. */
function Screen({ selected, latest, wide, over, launched }) {
  const scrollRef = useRef(null)
  const styled = selected.includes('design')
  const widgets = SCREEN_ORDER.filter((id) => selected.includes(id))

  useEffect(() => {
    // bring the widget that was just added into view
    const el = scrollRef.current?.querySelector(`[data-widget="${latest}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [latest])

  return (
    <div className="relative h-full overflow-hidden bg-[#fbfaf8]">
      {launched && <LaunchOverlay />}
      {selected.includes('notifications') && (
        <div key="notif" className="builder-drop absolute top-2 right-2 left-2 z-10 flex items-center gap-2 rounded-2xl bg-black/90 px-3 py-2 text-white shadow-lg backdrop-blur">
          <span className="grid h-6 w-6 place-items-center rounded-lg bg-ember-500"><Icon name="bell" className="h-3.5 w-3.5" strokeWidth={2.2} /></span>
          <div className="min-w-0 text-[11px] leading-tight">
            <div className="font-semibold">Order shipped</div>
            <div className="truncate text-white/60">Arriving tomorrow by 10 AM</div>
          </div>
        </div>
      )}
      <div ref={scrollRef} className={`builder-scroll h-full overflow-y-auto px-4 pt-4 pb-14 transition-[filter] duration-700 ${styled ? '' : 'grayscale'}`}>
        {selected.length === 0 ? (
          <EmptyScreen over={over} />
        ) : (
          <div className={`flex flex-col gap-3 ${selected.includes('notifications') ? 'pt-12' : ''}`}>
            <AppHeader styled={styled} hasAuth={selected.includes('auth')} />
            <div className={wide ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
              {widgets.map((id) => {
                const W = WIDGETS[id]
                return (
                  <div key={id} data-widget={id} className={wide && (id === 'auth' || id === 'payments' || id === 'maps') ? 'col-span-2' : ''}>
                    <W />
                  </div>
                )
              })}
              {widgets.length === 0 && <div className="rounded-2xl border-2 border-dashed border-black/10 p-6 text-center text-[11px] text-black/45">Add features to fill your app</div>}
            </div>
            {!styled && (
              <div className="rounded-xl bg-black px-3 py-2 text-center text-[11px] text-white">Wireframe mode · add <b>UI / UX design</b> to style it</div>
            )}
          </div>
        )}
      </div>
      {selected.includes('backend') && (
        <div className="builder-pop absolute right-3 bottom-3 left-3 flex items-center justify-between rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black shadow-[0_4px_14px_rgba(10,10,10,0.12)]">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-500" />API connected</span>
          <span className="text-black/45">42 ms</span>
        </div>
      )}
    </div>
  )
}

export function PhoneFrame(props) {
  return (
    <div className="relative h-[600px] w-[296px] shrink-0 rounded-[48px] bg-[#141414] p-[10px] shadow-[0_40px_90px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,254,0.14),inset_0_0_0_1px_rgba(255,255,254,0.06)]">
      <div className="relative h-full overflow-hidden rounded-[38px]">
        <div className="flex h-9 items-center justify-between bg-[#fbfaf8] px-6 text-[11px] font-semibold text-black">
          <span>9:41</span>
          <span className="absolute left-1/2 top-2 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-black" />
          <span className="flex items-center gap-1"><span className="h-2 w-3.5 rounded-[2px] border border-black/70" /></span>
        </div>
        <div className="h-[calc(100%-36px)]">
          <Screen {...props} />
        </div>
      </div>
    </div>
  )
}

export function BrowserFrame(props) {
  return (
    <div className="relative h-[460px] w-[660px] max-w-full shrink-0 overflow-hidden rounded-2xl bg-[#141414] shadow-[0_40px_90px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,254,0.14)]">
      <div className="flex h-10 items-center gap-2 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
        <span className="ml-4 flex-1 rounded-md bg-white/10 px-3 py-1 text-[11px] text-white/60">nova.app/dashboard</span>
      </div>
      <div className="h-[calc(100%-40px)]">
        <Screen {...props} wide />
      </div>
    </div>
  )
}
