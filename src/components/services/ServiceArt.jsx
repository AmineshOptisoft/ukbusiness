import { useId } from 'react'

// Animated abstract artwork for each service card (pure CSS/SVG, no images).

function Flow() {
  const id = useId().replace(/:/g, '')
  return (
    <svg className="svc-art svc-flow" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`flow-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#FA4614" stopOpacity="0" />
          <stop offset=".5" stopColor="#F47432" />
          <stop offset="1" stopColor="#FFD2B0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M-20 ${200 - i * 6} C 90 ${60 + i * 9}, 220 ${250 - i * 4}, 420 ${40 + i * 7}`}
          fill="none"
          stroke={`url(#flow-${id})`}
          strokeWidth={1 + (i % 3)}
          opacity={0.25 + i * 0.05}
        />
      ))}
    </svg>
  )
}

const ART = {
  flow: Flow,
  weave: () => <div className="svc-art svc-weave" aria-hidden="true" />,
  grid: () => (
    <>
      <div className="svc-art svc-dots" aria-hidden="true" />
      <svg className="svc-art" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path className="svc-trace" d="M20 200 H120 V120 H200 V60 H300 V140 H380" fill="none" stroke="#FA4614" strokeWidth="2.5" />
        <path className="svc-trace svc-trace-slow" d="M40 40 H140 V90 H260 V190 H360" fill="none" stroke="#FFD2B0" strokeWidth="1.5" opacity=".7" />
      </svg>
    </>
  ),
  blob: () => (
    <div className="svc-art svc-blobs" aria-hidden="true">
      <i />
      <i />
      <i />
    </div>
  ),
  rings: () => (
    <div className="svc-art svc-rings" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </div>
  ),
  checks: () => (
    <div className="svc-art svc-checks" aria-hidden="true">
      {Array.from({ length: 18 }, (_, i) => (
        <i key={i} style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </div>
  ),
}

export default function ServiceArt({ kind }) {
  const Art = ART[kind]
  return <Art />
}
