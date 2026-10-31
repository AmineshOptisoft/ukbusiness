import { useEffect, useRef } from 'react'

/**
 * Animated canvas of dots.
 * - mode "grid":  evenly spaced dots that twinkle (service card hover effect)
 * - mode "stars": scattered stars that drift and twinkle (platform card)
 * Animation only runs while `active` is true and the canvas is on screen,
 * and is frozen to a single frame for users who prefer reduced motion.
 */
export default function DotField({ mode = 'grid', active = true, color = '250, 70, 20', spacing = 11, density = 0.00035, className = '' }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let dots = []
    let w = 0
    let h = 0
    let frame = 0
    let visible = true

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dots = []
      if (mode === 'grid') {
        for (let x = spacing / 2; x < w; x += spacing) {
          for (let y = spacing / 2; y < h; y += spacing) {
            dots.push({ x, y, r: 1, phase: Math.random() * Math.PI * 2, speed: 0.6 + Math.random() * 2.4 })
          }
        }
      } else {
        const count = Math.round(w * h * density)
        for (let i = 0; i < count; i++) {
          dots.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() < 0.08 ? 1.6 + Math.random() * 1.2 : 0.4 + Math.random() * 0.9,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 1.6,
            vx: (Math.random() - 0.5) * 0.06,
            vy: (Math.random() - 0.5) * 0.06,
          })
        }
      }
    }

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const time = t / 1000
      for (const d of dots) {
        if (mode === 'stars' && !reduceMotion) {
          d.x = (d.x + d.vx + w) % w
          d.y = (d.y + d.vy + h) % h
        }
        const twinkle = 0.5 + 0.5 * Math.sin(time * d.speed + d.phase)
        const alpha = mode === 'grid' ? 0.08 + twinkle * 0.55 : 0.25 + twinkle * 0.75
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (t) => {
      frame = 0
      if (!visible || !activeRef.current) return
      draw(t)
      if (!reduceMotion) frame = requestAnimationFrame(loop)
    }
    const start = () => {
      if (!frame && visible && activeRef.current) frame = requestAnimationFrame(loop)
    }

    build()
    draw(0)
    start()

    const ro = new ResizeObserver(() => {
      build()
      draw(performance.now())
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    io.observe(canvas)
    canvas.__start = start

    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
    }
  }, [mode, color, spacing, density])

  useEffect(() => {
    if (active) canvasRef.current?.__start?.()
  }, [active])

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />
}
