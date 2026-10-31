import { useState } from 'react'
import {
  FaBars,
  FaBolt,
  FaCartShopping,
  FaGlobe,
  FaLocationArrow,
  FaPaperPlane,
  FaPenToSquare,
  FaPuzzlePiece,
  FaRocket,
  FaScrewdriverWrench,
} from 'react-icons/fa6'
import { SiFigma, SiFramer, SiHostinger, SiShopify, SiSquarespace, SiWebflow, SiWix, SiWordpress } from 'react-icons/si'
import DotField from './DotField.jsx'
import { ArrowRight } from './icons.jsx'

const SERVICES = [
  { icon: FaGlobe, title: ['Crafted', 'Websites'], href: '#crafted-websites' },
  { icon: FaPenToSquare, title: ['Website', 'Redesign'], href: '#website-redesign' },
  { icon: FaCartShopping, title: ['eCommerce', 'Website Design'], href: '#ecommerce' },
  { icon: FaBars, title: ['CMS &', 'Dynamic Websites'], href: '#cms' },
  { icon: FaPaperPlane, title: ['Landing Pages', '& Microsites'], href: '#landing-pages' },
  { icon: FaPuzzlePiece, title: ['Consistent', 'Identity'], href: '#identity' },
  { icon: FaBolt, title: ['Motion &', 'Interaction Design'], href: '#motion' },
  { icon: FaLocationArrow, title: ['UX Centric', 'Strategy'], href: '#ux-strategy' },
  { icon: FaRocket, title: ['Performance', 'Optimization'], href: '#performance' },
  { icon: FaScrewdriverWrench, title: ['Maintenance &', 'Ongoing Support'], href: '#maintenance' },
]

const PLATFORMS = [
  { icon: SiWebflow, name: 'Webflow' },
  { icon: SiWordpress, name: 'WordPress' },
  { icon: SiWix, name: 'Wix' },
  { icon: SiFramer, name: 'Framer' },
  { icon: SiHostinger, name: 'Hostinger' },
  { icon: SiSquarespace, name: 'Squarespace' },
  { icon: SiShopify, name: 'Shopify' },
  { icon: SiFigma, name: 'Figma' },
]

function ServiceCard({ icon: Icon, title, href }) {
  const [active, setActive] = useState(false)
  const on = () => setActive(true)
  const off = () => setActive(false)

  return (
    <a
      href={href}
      onMouseEnter={on}
      onMouseLeave={off}
      onFocus={on}
      onBlur={off}
      className="sweep-border group relative flex aspect-square flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-ember-500/10 bg-ember-tint text-center outline-none transition-colors duration-300 hover:bg-white focus-visible:bg-white"
    >
      <span className={`absolute inset-0 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
        <DotField mode="grid" active={active} />
      </span>
      <Icon className="relative h-7 w-7 text-ember-500 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110" aria-hidden="true" />
      <span className="relative font-display text-[15px] leading-snug text-ember-900/55 transition-colors duration-300 group-hover:text-ember-700 group-focus-visible:text-ember-700 md:text-base">
        {title[0]}
        <br />
        {title[1]}
      </span>
    </a>
  )
}

export default function ServicesSection({
  heading = ['Elevate your', 'digital footprint.'],
  allServicesHref = '#all-services',
  startProjectHref = '#contact',
  workHref = '#case-studies',
}) {
  return (
    <section id="services" className="bg-ember-50 font-sans text-ember-900">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-8 md:py-28">
        {/* Heading row */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.05] font-normal tracking-[-0.02em] text-ember-500">
            {heading[0]}
            <br />
            {heading[1]}
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href={allServicesHref}
              className="group inline-flex items-center gap-3 rounded-full bg-ember-500 px-6 py-3 text-[15px] font-semibold text-white shadow-sm transition hover:bg-ember-700"
            >
              View all services
              <ArrowRight className="h-3 w-7 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={startProjectHref}
              className="inline-flex items-center rounded-full border border-ember-500/25 px-6 py-3 text-[15px] font-semibold text-ember-500 transition hover:border-ember-500 hover:bg-ember-tint"
            >
              Start a project
            </a>
          </div>
        </div>

        {/* Services grid */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 md:gap-4">
          {SERVICES.map((service) => (
            <ServiceCard key={service.href} {...service} />
          ))}
        </div>

        {/* Platforms */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ember-400 via-ember-500 to-ember-700 p-8 text-white md:p-12">
            <div className="pointer-events-none absolute -right-16 top-1/2 h-72 w-[28rem] -translate-y-1/2 -rotate-12 rounded-full bg-white/25 blur-3xl" aria-hidden="true" />
            <DotField mode="stars" color="255, 255, 254" />
            <div className="relative">
              <h3 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-[1.1] font-normal tracking-[-0.01em]">
                Platform flexibility.
                <br />
                Design consistency.
              </h3>
              <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-white/80">
                No matter the platform, our design language stays <span className="text-white">consistent, refined, responsive,</span> and
                built to perform.
              </p>
              <a
                href={workHref}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[15px] font-semibold text-ember-500 shadow-sm transition hover:shadow-lg"
              >
                See our work
                <ArrowRight className="h-3 w-7 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <ul className="grid grid-cols-4 overflow-hidden rounded-2xl border border-ember-500/15 bg-ember-tint">
            {PLATFORMS.map(({ icon: Icon, name }, i) => (
              <li
                key={name}
                className={`group flex aspect-square items-center justify-center border-ember-500/15 transition-colors duration-300 hover:bg-white sm:aspect-auto sm:min-h-36 ${i % 4 !== 3 ? 'border-r' : ''} ${i < 4 ? 'border-b' : ''}`}
              >
                <Icon
                  className="h-8 w-8 text-ember-900/40 transition duration-300 group-hover:scale-110 group-hover:text-ember-500 md:h-11 md:w-11"
                  role="img"
                  aria-label={name}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
