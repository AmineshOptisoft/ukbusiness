// Service modules a visitor can add to their product.
// weeks: build effort; points: team-size weight; core: required to launch.
export const MODULES = [
  { id: 'design', name: 'UI / UX design', desc: 'Research, flows and a polished design system', icon: 'design', weeks: 2.5, points: 2, core: true, stack: ['Figma'] },
  { id: 'backend', name: 'Backend & APIs', desc: 'Secure, scalable APIs and database', icon: 'server', weeks: 3, points: 3, core: true, stack: ['Node.js', 'PostgreSQL', 'AWS'] },
  { id: 'auth', name: 'User accounts', desc: 'Sign-up, login, profiles and roles', icon: 'user', weeks: 1, points: 1, stack: ['OAuth 2.0'] },
  { id: 'payments', name: 'Payments', desc: 'Cards, wallets, subscriptions and invoices', icon: 'card', weeks: 1.5, points: 2, stack: ['Stripe'] },
  { id: 'ai', name: 'AI assistant', desc: 'Chat, smart search and recommendations', icon: 'sparkle', weeks: 2, points: 2, stack: ['OpenAI'] },
  { id: 'chat', name: 'Real-time chat', desc: 'Messaging, media sharing and presence', icon: 'chat', weeks: 1.5, points: 1, stack: ['WebSockets'] },
  { id: 'notifications', name: 'Push notifications', desc: 'Timely alerts that bring users back', icon: 'bell', weeks: 0.5, points: 1, stack: ['Firebase'] },
  { id: 'maps', name: 'Maps & location', desc: 'Live tracking, geofencing and search', icon: 'pin', weeks: 1, points: 1, stack: ['Google Maps'] },
  { id: 'analytics', name: 'Analytics', desc: 'Dashboards and insight on every action', icon: 'chart', weeks: 1, points: 1, stack: ['Mixpanel'] },
  { id: 'admin', name: 'Admin panel', desc: 'Manage users, content and orders', icon: 'dashboard', weeks: 2, points: 2, stack: ['React'] },
]

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]))

export const PLATFORMS = [
  { id: 'mobile', label: 'Mobile app', icon: 'phone', factor: 1, stack: ['Flutter'] },
  { id: 'web', label: 'Web app', icon: 'globe', factor: 0.9, stack: ['Next.js'] },
  { id: 'both', label: 'Both', icon: 'layers', factor: 1.35, stack: ['Flutter', 'Next.js'] },
]

const FEATURES_TO_LAUNCH = 3

/** Readiness (0–100), rough timeline and team for a selection. */
export function getPlan(selected, platformId) {
  const platform = PLATFORMS.find((p) => p.id === platformId) ?? PLATFORMS[0]
  const mods = selected.map((id) => MODULE_BY_ID[id])
  const hasDesign = selected.includes('design')
  const hasBackend = selected.includes('backend')
  const features = mods.filter((m) => !m.core).length

  const readiness = Math.round((hasDesign ? 30 : 0) + (hasBackend ? 30 : 0) + (Math.min(features, FEATURES_TO_LAUNCH) / FEATURES_TO_LAUNCH) * 40)

  const effort = mods.reduce((sum, m) => sum + m.weeks, 0)
  // discovery sprint + parallelised build, scaled by platform
  const weeks = mods.length ? (1.5 + effort * 0.65) * platform.factor : 0
  const minWeeks = Math.max(2, Math.floor(weeks))
  const maxWeeks = Math.max(minWeeks + 1, Math.ceil(weeks * 1.2))

  const points = mods.reduce((sum, m) => sum + m.points, 0)
  const team = mods.length ? Math.min(9, 2 + Math.ceil(points / 3) + (platformId === 'both' ? 1 : 0)) : 0

  const stack = [...new Set([...platform.stack, ...mods.flatMap((m) => m.stack)])]

  const missing = []
  if (!hasDesign) missing.push('UI / UX design')
  if (!hasBackend) missing.push('Backend & APIs')
  if (features < FEATURES_TO_LAUNCH) missing.push(`${FEATURES_TO_LAUNCH - features} more feature${FEATURES_TO_LAUNCH - features > 1 ? 's' : ''}`)

  return { readiness, minWeeks, maxWeeks, team, stack, missing, features }
}
