import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Wallet,
  Shield,
  BarChart3,
  Crosshair,
  ArrowRight,
  Globe,
  Terminal,
  Zap,
  ChevronDown,
  ExternalLink,
  Layers,
  Activity,
  Box,
} from 'lucide-react'
import Prism from './components/Prism'
import pandaLogo from './assets/PandaTerminal_mono_white_RGB_main.svg'

type RouteSeo = {
  title: string
  description: string
  path: string
  ogType: 'website' | 'article'
}

const SITE_URL = 'https://pandaterminal.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-share-image.png`

const SEO_BY_PATH: Record<string, RouteSeo> = {
  '/': {
    title: 'PANDA Terminal 2.0 | Execution-First Crypto Trading Infrastructure',
    description:
      'PANDA Terminal 2.0 is execution-first crypto trading infrastructure for modern desks: one wallet, cross-venue DeFi execution, and integrated market intelligence.',
    path: '/',
    ogType: 'website',
  },
  '/announcement': {
    title: 'PANDA Terminal 2.0 Announcement | Built for Execution',
    description:
      'Read the official PANDA Terminal 2.0 announcement and roadmap: one wallet, every venue, decentralized-first execution, and early access details.',
    path: '/announcement',
    ogType: 'article',
  },
  '/termsofservice': {
    title: 'Terms of Service | PANDA Terminal',
    description:
      'Read the PANDA Terminal Terms of Service covering platform usage, accounts, subscriptions, risk disclosures, and legal terms.',
    path: '/termsofservice',
    ogType: 'website',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | PANDA Terminal',
    description:
      'Read the PANDA Terminal Privacy Policy, including data categories, processing purposes, retention, sharing, and your rights.',
    path: '/privacy-policy',
    ogType: 'website',
  },
}

const BASE_ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'PANDA Terminal',
      url: SITE_URL,
      logo: `${SITE_URL}/panda.svg`,
      sameAs: [
        'https://x.com/pandaterminal',
        'https://t.me/pandaterminal',
        'https://www.linkedin.com/company/panda-terminal',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'PANDA Terminal',
      description:
        'Execution-first crypto trading infrastructure for modern traders across DEXes, perps, and options venues.',
      publisher: {
        '@id': `${SITE_URL}/#organization`,
      },
      inLanguage: 'en',
    },
  ],
}

function ensureMetaTag(attribute: 'name' | 'property', key: string) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  return tag
}

function ensureLinkTag(rel: string) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }
  return tag
}

function setJsonLdScript(id: string, payload: Record<string, unknown>) {
  let script = document.head.querySelector(`script[data-seo-id="${id}"]`) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo-id', id)
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(payload)
}

function applySeoForPath(pathname: string) {
  const seo = SEO_BY_PATH[pathname] ?? SEO_BY_PATH['/']
  const canonicalUrl = `${SITE_URL}${seo.path}`
  const twitterDescription = `${seo.description.slice(0, 197)}${seo.description.length > 197 ? '...' : ''}`

  document.title = seo.title

  ensureMetaTag('name', 'description').setAttribute('content', seo.description)
  ensureMetaTag('name', 'robots').setAttribute(
    'content',
    'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
  )
  ensureMetaTag('name', 'application-name').setAttribute('content', 'PANDA Terminal')
  ensureMetaTag('name', 'twitter:card').setAttribute('content', 'summary_large_image')
  ensureMetaTag('name', 'twitter:title').setAttribute('content', seo.title)
  ensureMetaTag('name', 'twitter:description').setAttribute('content', twitterDescription)
  ensureMetaTag('name', 'twitter:image').setAttribute('content', DEFAULT_OG_IMAGE)
  ensureMetaTag('name', 'twitter:url').setAttribute('content', canonicalUrl)

  ensureMetaTag('property', 'og:type').setAttribute('content', seo.ogType)
  ensureMetaTag('property', 'og:site_name').setAttribute('content', 'PANDA Terminal')
  ensureMetaTag('property', 'og:title').setAttribute('content', seo.title)
  ensureMetaTag('property', 'og:description').setAttribute('content', seo.description)
  ensureMetaTag('property', 'og:image').setAttribute('content', DEFAULT_OG_IMAGE)
  ensureMetaTag('property', 'og:image:width').setAttribute('content', '1024')
  ensureMetaTag('property', 'og:image:height').setAttribute('content', '576')
  ensureMetaTag('property', 'og:url').setAttribute('content', canonicalUrl)
  ensureMetaTag('property', 'og:locale').setAttribute('content', 'en_US')

  ensureLinkTag('canonical').setAttribute('href', canonicalUrl)

  setJsonLdScript('organization', BASE_ORGANIZATION_SCHEMA)

  if (pathname === '/announcement') {
    setJsonLdScript('page', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Panda Terminal 2.0 - Built for Execution',
      description: seo.description,
      mainEntityOfPage: canonicalUrl,
      author: {
        '@type': 'Organization',
        name: 'PANDA Terminal',
      },
      publisher: {
        '@type': 'Organization',
        name: 'PANDA Terminal',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/panda.svg`,
        },
      },
      image: DEFAULT_OG_IMAGE,
    })
    return
  }

  const pageScript = document.head.querySelector('script[data-seo-id="page"]')
  pageScript?.remove()
}

/* ─── Shared ─── */

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Navbar ─── */

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-[#101010] bg-card/95 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-5 h-full flex items-center justify-between gap-5">
        <a href="./" className="shrink-0 flex items-center">
          <img src={pandaLogo} alt="PANDA Terminal" className="h-11 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-6 text-[14px] text-ink">
          <a href="./announcement" className="hover:text-ink-secondary transition-colors">
            Announcement
          </a>
          <a href="https://app.pandaterminal.com" className="hover:text-ink-secondary transition-colors">
            Backup Funds
          </a>
        </div>

        <a
          href="/#waitlist"
          className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-black hover:bg-white/90 transition-colors"
        >
          Join Waitlist
        </a>
      </div>
    </nav>
  )
}

function AnnouncementPage() {
  useEffect(() => {
    const stylesheetId = 'getwaitlist-stylesheet'
    const scriptId = 'getwaitlist-script'
    const stylesheetHref = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css'
    const scriptSrc = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js'

    if (!document.getElementById(stylesheetId)) {
      const link = document.createElement('link')
      link.id = stylesheetId
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = stylesheetHref
      document.head.appendChild(link)
    }

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = scriptSrc
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <main className="pt-28 pb-20 px-5">
      <section className="max-w-[820px] mx-auto border border-grid bg-card">
        <div className="border-b border-grid px-6 sm:px-8 py-5">
          <p className="label-micro text-accent mb-2">Announcement</p>
          <h1 className="text-[26px] sm:text-[34px] leading-tight font-medium text-ink tracking-tight mb-2">
            Panda Terminal 2.0 — Built for Execution
          </h1>
          <p className="text-[14px] text-ink-secondary">The next chapter of Panda is here.</p>
        </div>

        <article className="px-6 sm:px-8 py-7 space-y-8 text-[15px] text-ink-secondary leading-relaxed">
          <section className="space-y-4">
            <p>
              Since 2022, we&apos;ve been building what we set out to make the Bloomberg Terminal of crypto, a comprehensive
              intelligence platform spanning on-chain and off-chain data, hardcore analytics for analysts and traders,
              and trade execution across centralized and decentralized venues.
            </p>
            <p>
              We partnered with industry-grade charting libraries used by S&amp;P 500 sectors, built sophisticated tooling
              on top of them, and shipped Panda Intel, a product we&apos;re deeply proud of.
            </p>
            <p className="text-ink">But markets evolve. And so must we.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-medium text-ink">What changed</h2>
            <p>
              Over the past two years, the crypto analytics landscape has shifted dramatically. Competition in the
              pure-analytics space has intensified while revenue models have compressed. The cost of intelligence is
              falling fast, AI and open data are democratizing access to the very insights that once commanded premium
              pricing. What was once a moat is becoming a commodity.
            </p>
            <p>
              Meanwhile, something else has become clear: trade execution infrastructure is still painfully
              underdeveloped. The sophistication traders need, seamless cross-venue execution, prime brokerage
              workflows, institutional-grade order management across DeFi, simply doesn&apos;t exist yet at the level this
              industry deserves.
            </p>
            <p>
              Recently, we also encountered critical issues with a core charting library provider that underpinned much
              of Panda Intel&apos;s foundation. As we began the work of replacing that system, it forced a broader question:
              where should we concentrate our energy for maximum impact?
            </p>
            <p className="text-ink">The answer was clear.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-medium text-ink">Introducing Panda Terminal 2.0</h2>
            <p>
              Rather than rebuild what was, we&apos;re building what&apos;s next. Panda Terminal 2.0 is a ground-up reimagining
              of the platform — purpose-built for traders, execution, and the decentralized economy.
            </p>
            <p>Here&apos;s what this means:</p>
            <ul className="space-y-3 list-disc pl-5 marker:text-accent">
              <li>
                <span className="text-ink">One wallet. Every venue.</span> Connect a single wallet and trade across a
                wide range of DEXes, perpetual protocols, and on-chain options ecosystems, no fragmentation, no
                friction.
              </li>
              <li>
                <span className="text-ink">Decentralized-first.</span> Panda Terminal 2.0 goes all-in on DeFi. Spot
                swaps, perps, options, and beyond, all routed and executed on-chain with the speed and UX that traders
                actually need.
              </li>
              <li>
                <span className="text-ink">Prime brokerage infrastructure.</span> Portfolio-level risk management,
                cross-venue margining, and the operational tooling that serious trading desks demand but can&apos;t find in
                crypto today.
              </li>
              <li>
                <span className="text-ink">Intelligence where it matters.</span> The analytics DNA of Panda Intel,
                orderflow, funding rates, open interest, on-chain metrics, macro models, isn&apos;t going away. It&apos;s being
                woven directly into the execution workflow, surfacing signals at the point of action.
              </li>
              <li>
                <span className="text-ink">Trader-first design.</span> Every screen, every workflow, every data point
                is optimized for decision-making and execution, not just observation.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-medium text-ink">Why now</h2>
            <p>
              The window is wide open. Analytics is becoming accessible to everyone; execution is still a frontier. The
              traders and institutions entering crypto need more than dashboards, they need a platform that lets them
              act with the same speed and sophistication they expect from traditional markets.
            </p>
            <p>
              We&apos;re not abandoning our roots. We&apos;re sharpening our focus. Everything we&apos;ve built since 2022, the data
              infrastructure, the exchange integrations, the analytical models, becomes the foundation for a product
              that&apos;s pointed directly at where the industry is headed: decentralized, composable, and execution-driven.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-medium text-ink">The roadmap</h2>
            <p>
              We&apos;re heads down building and expect to roll out Panda Terminal 2.0 in Q4 2026. Between now and then,
              we&apos;ll be sharing progress updates on architecture, early previews, and partnership announcements. Stay
              close, things will move fast.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[18px] font-medium text-ink">Be first in line</h2>
            <p>
              Early access will open ahead of the full Q4 launch. If you want to be among the first to experience the
              future of decentralized trading, sign up for the waitlist now.
            </p>
            <div className="border border-accent/40 bg-accent-subtle/20 px-4 py-3">
              <div id="getWaitlistContainer" data-waitlist_id="32566" data-widget_type="WIDGET_2" />
            </div>
            <p>
              Spots will be limited for the initial launch. Early waitlist members will get priority access, a direct
              line to the team, and the ability to shape the product alongside us.
            </p>
            <p>
              To our community, partners, and early supporters: thank you for believing in what we&apos;re building. We
              started with intelligence. Now we&apos;re giving you the tools to act on it, across every decentralized venue,
              from a single wallet.
            </p>
            <p className="font-mono text-ink">Q4 2026. The best is ahead. See you in 2.0.</p>
          </section>
        </article>
      </section>
    </main>
  )
}

/* ─── Agent Work Preview ─── */

const AGENT_TASKS = [
  { title: 'Ingest live venue streams', detail: '12 venues · 847 pairs synced', status: 'done' },
  { title: 'Compute orderflow imbalance', detail: 'BTC, ETH, SOL signal deltas refreshed', status: 'done' },
  { title: 'Validate funding + OI regime', detail: 'Perps pressure score: 0.74 (bullish)', status: 'done' },
  { title: 'Route execution path', detail: 'Best path: Hyperliquid -> Jupiter hedge leg', status: 'done' },
  { title: 'Run slippage + liquidity guardrails', detail: 'Expected slippage 8.2 bps · within risk limits', status: 'done' },
  { title: 'Execution agent armed', detail: 'Waiting for trigger confidence > 72%', status: 'running' },
] as const

const AGENT_STATUS_LINES = [
  'Parsing live market streams...',
  'Evaluating venue depth and latency...',
  'Computing cross-venue execution path...',
  'Validating risk and slippage guardrails...',
] as const

type AgentTask = typeof AGENT_TASKS[number]
type DisplayedTask = {
  title: string
  detail: string
  finalized: boolean
  status: AgentTask['status']
}

function TerminalPreview() {
  const [displayedTasks, setDisplayedTasks] = useState<DisplayedTask[]>([])
  const [statusLine, setStatusLine] = useState<string>(AGENT_STATUS_LINES[0])
  const [sequenceComplete, setSequenceComplete] = useState(false)
  const ref = useRef(null)
  const hasStartedRef = useRef(false)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView || hasStartedRef.current) return
    hasStartedRef.current = true

    let cancelled = false
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    const updateTask = (index: number, updater: (task: DisplayedTask) => DisplayedTask) => {
      setDisplayedTasks((prev) => prev.map((task, i) => (i === index ? updater(task) : task)))
    }

    const runSequence = async () => {
      setDisplayedTasks([])
      setSequenceComplete(false)

      for (let i = 0; i < AGENT_TASKS.length; i += 1) {
        if (cancelled) return

        const task = AGENT_TASKS[i]
        setStatusLine(AGENT_STATUS_LINES[i % AGENT_STATUS_LINES.length])
        setDisplayedTasks((prev) => [...prev, { title: '', detail: '', finalized: false, status: task.status }])

        for (const ch of task.title) {
          if (cancelled) return
          updateTask(i, (current) => ({ ...current, title: current.title + ch }))
          await sleep(22 + (i % 3) * 4)
        }

        await sleep(220 + i * 40)

        for (const ch of task.detail) {
          if (cancelled) return
          updateTask(i, (current) => ({ ...current, detail: current.detail + ch }))
          await sleep(12 + (i % 2) * 3)
        }

        await sleep(160 + (i % 2) * 120)
        if (cancelled) return
        updateTask(i, (current) => ({ ...current, finalized: true }))
      }

      if (!cancelled) {
        setStatusLine('Execution agent online. Waiting for trigger...')
        setSequenceComplete(true)
      }
    }

    void runSequence()
    return () => {
      cancelled = true
    }
  }, [inView])

  const toneFor = (status: 'done' | 'running') => {
    switch (status) {
      case 'done':
        return {
          dot: 'bg-signal-success',
          badge: 'text-signal-success border-signal-success/30 bg-signal-success/10',
          label: 'DONE',
        }
      case 'running':
        return {
          dot: 'bg-accent animate-pulse-dot',
          badge: 'text-accent border-accent/30 bg-accent/10',
          label: 'LIVE',
        }
      default:
        return {
          dot: 'bg-ink-tertiary',
          badge: 'text-ink-tertiary border-grid bg-subtle',
          label: 'IDLE',
        }
    }
  }

  return (
    <div ref={ref} className="relative mx-auto max-w-2xl">
      <div className="bg-card border border-grid overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-grid-element">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-signal-error/50" />
              <div className="w-2 h-2 rounded-full bg-signal-warn/50" />
              <div className="w-2 h-2 rounded-full bg-signal-success/50" />
            </div>
            <span className="font-mono text-[10px] text-ink-tertiary">agent://panda-exec-v2</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            AGENT RUNNING
          </span>
        </div>

        <div className="px-4 sm:px-5 py-3 border-b border-grid-element">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
            <div className="border border-grid px-2 py-1 text-ink-secondary">Wallet: 0x...a3f7</div>
            <div className="border border-grid px-2 py-1 text-ink-secondary">Mode: Execution</div>
            <div className="border border-grid px-2 py-1 text-ink-secondary">Risk: Balanced</div>
            <div className="border border-grid px-2 py-1 text-accent">Signals: LIVE</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 font-mono text-[12px] sm:text-[13px] leading-relaxed space-y-2 min-h-[220px] text-left">
          {displayedTasks.map((task, index) => {
            const resolvedStatus = task.finalized ? task.status : 'running'
            const tone = toneFor(resolvedStatus)
            return (
              <div key={`agent-task-${index}`} className="border border-grid px-3 py-2.5">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
                    <span className="text-ink">
                      {task.title}
                      {!task.finalized && <span className="animate-blink text-accent">▋</span>}
                    </span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 border ${tone.badge}`}>{tone.label}</span>
                </div>
                <p className="text-[11px] text-ink-tertiary">{task.detail}</p>
              </div>
            )
          })}

          {!sequenceComplete && (
            <div className="text-ink-tertiary text-[11px] flex items-center gap-1.5">
              <span className="animate-blink text-accent">▋</span>
              {statusLine}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Hero ─── */

function useResponsivePrism() {
  const [params, setParams] = useState({
    scale: 3.6,
    height: 3.5,
    baseWidth: 5.5,
    glow: 0.8,
    bloom: 0.6,
  })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) {
        setParams({ scale: 2.0, height: 2.5, baseWidth: 4.0, glow: 0.6, bloom: 0.5 })
      } else if (w < 1024) {
        setParams({ scale: 2.8, height: 3.0, baseWidth: 5.0, glow: 0.7, bloom: 0.55 })
      } else {
        setParams({ scale: 3.6, height: 3.5, baseWidth: 5.5, glow: 0.8, bloom: 0.6 })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return params
}

function HeroSection() {
  const prismParams = useResponsivePrism()

  return (
    <section className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Prism background */}
      <div className="absolute inset-0 pointer-events-none">
        <Prism
          animationType="rotate"
          height={prismParams.height}
          baseWidth={prismParams.baseWidth}
          scale={prismParams.scale}
          glow={prismParams.glow}
          bloom={prismParams.bloom}
          noise={0.3}
          colorFrequency={1.2}
          timeScale={0.3}
          hueShift={-0.5}
          transparent={true}
          suspendWhenOffscreen={true}
        />
      </div>
      {/* Gradient overlay to fade the prism towards edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-canvas/30 via-transparent to-canvas pointer-events-none" />
      <div className="flex-1 flex items-start md:items-center justify-center px-5 pt-24 sm:pt-28 md:pt-16">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 border border-grid bg-card px-3 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-success animate-pulse-dot" />
              <span className="label-micro text-ink-secondary">Announcement</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="display-xl text-ink mb-4">
              Panda Terminal <span className="text-accent">2.0</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="font-mono text-base sm:text-lg text-ink-secondary tracking-tight mb-3">
              Built for Execution
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="text-[15px] text-ink-tertiary max-w-md mx-auto mb-10 leading-relaxed">
              One wallet. Every venue. Decentralized-first
              trade execution — reimagined from the ground up.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#waitlist" className="group flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-[13px] font-medium text-white hover:bg-accent-hover transition-colors">
                Get Early Access
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a href="#features" className="flex items-center gap-2 rounded-full border border-accent px-6 py-2.5 text-[13px] font-medium text-accent hover:bg-accent/5 transition-colors">
                Explore Features
                <ChevronDown className="w-3.5 h-3.5" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.45} className="mt-14 sm:mt-16">
            <TerminalPreview />
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-tertiary animate-bounce">
        <ChevronDown className="w-4 h-4" />
      </div>
    </section>
  )
}

/* ─── The Shift (Market Landscape) ─── */

const crowdedBlocks = [
  { x: 2, y: 2, w: 38, h: 22, label: 'Dune' },
  { x: 42, y: 2, w: 34, h: 22, label: 'Nansen' },
  { x: 78, y: 2, w: 40, h: 22, label: 'Messari' },
  { x: 120, y: 2, w: 38, h: 22, label: 'Glassnode' },
  { x: 2, y: 26, w: 46, h: 22, label: 'DefiLlama' },
  { x: 50, y: 26, w: 36, h: 22, label: 'Arkham' },
  { x: 88, y: 26, w: 36, h: 22, label: 'Token T.' },
  { x: 126, y: 26, w: 32, h: 22, label: 'Parsec' },
  { x: 2, y: 50, w: 32, h: 22, label: 'Flipside' },
  { x: 36, y: 50, w: 34, h: 22, label: 'Kaiko' },
  { x: 72, y: 50, w: 44, h: 22, label: 'The Block' },
  { x: 118, y: 50, w: 40, h: 22, label: 'Artemis' },
  { x: 2, y: 74, w: 38, h: 22, label: 'Coingecko' },
  { x: 42, y: 74, w: 42, h: 22, label: 'Santiment' },
  { x: 86, y: 74, w: 36, h: 22, label: 'Amberdata' },
  { x: 124, y: 74, w: 34, h: 22, label: 'IntoTheB.' },
  { x: 2, y: 98, w: 34, h: 22, label: 'ChatGPT' },
  { x: 38, y: 98, w: 40, h: 22, label: 'Perplexity' },
  { x: 80, y: 98, w: 38, h: 22, label: 'Open data' },
  { x: 120, y: 98, w: 38, h: 22, label: '+ dozens' },
]

function CrowdedLandscape() {
  return (
    <svg viewBox="0 0 160 122" fill="none" className="w-full" aria-hidden>
      {crowdedBlocks.map((b, i) => (
        <g key={b.label}>
          <rect
            x={b.x} y={b.y} width={b.w} height={b.h}
            fill={i >= 16 ? '#1A0A0A' : '#0F0F0F'}
            stroke={i >= 16 ? '#3D1515' : '#262626'}
            strokeWidth="0.5"
          />
          <text
            x={b.x + b.w / 2} y={b.y + b.h / 2 + 3}
            textAnchor="middle"
            fill={i >= 16 ? '#663333' : '#404040'}
            fontSize="5.5"
            fontFamily="monospace"
          >
            {b.label}
          </text>
        </g>
      ))}
      {/* Compression arrows on edges */}
      <g opacity="0.4">
        <polygon points="160,40 155,35 155,45" fill="#FF3333" />
        <polygon points="0,80 5,75 5,85" fill="#FF3333" />
        <polygon points="80,122 75,117 85,117" fill="#FF3333" />
        <polygon points="80,0 75,5 85,5" fill="#FF3333" />
      </g>
    </svg>
  )
}

function OpenLandscape() {
  return (
    <svg viewBox="0 0 160 122" fill="none" className="w-full" aria-hidden>
      {/* Subtle grid showing the vast empty space */}
      {[0, 20, 40, 60, 80, 100, 120].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="160" y2={y} stroke="#141414" strokeWidth="0.5" />
      ))}
      {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="122" stroke="#141414" strokeWidth="0.5" />
      ))}
      {/* A few scattered tiny blocks — the only existing players */}
      <rect
        x="105" y="72" width="28" height="14"
        fill="#0F0F0F" stroke="#262626" strokeWidth="0.5"
      />
      <text x="119" y="82" textAnchor="middle" fill="#333" fontSize="4.5" fontFamily="monospace">Basic OMS</text>
      <rect
        x="22" y="30" width="24" height="14"
        fill="#0F0F0F" stroke="#262626" strokeWidth="0.5"
      />
      <text x="34" y="40" textAnchor="middle" fill="#333" fontSize="4.5" fontFamily="monospace">DEX agg</text>
      <rect
        x="70" y="95" width="22" height="14"
        fill="#0F0F0F" stroke="#262626" strokeWidth="0.5"
      />
      <text x="81" y="105" textAnchor="middle" fill="#333" fontSize="4.5" fontFamily="monospace">Perps</text>

      {/* Panda entering — the blue block */}
      <g>
        <rect
          x="60" y="40" width="40" height="20"
          fill="#001A4D" fillOpacity="0.3" stroke="#1464FF" strokeWidth="1"
        />
        <text
          x="80" y="53" textAnchor="middle"
          fill="#1464FF" fontSize="6" fontFamily="monospace" fontWeight="500"
        >
          PANDA 2.0
        </text>
        {/* Pulsing glow */}
        <rect x="60" y="40" width="40" height="20" fill="none" stroke="#1464FF" strokeWidth="0.5" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  )
}

function ShiftSection() {
  return (
    <section className="relative py-20 sm:py-28 px-5">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-6">
            <span className="label-micro text-accent mb-3 block">The Shift</span>
            <h2 className="text-[20px] sm:text-[24px] font-medium text-ink tracking-tight mb-3">
              Markets evolved. So did we.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="text-[15px] text-ink-tertiary max-w-2xl mx-auto text-center mb-14 leading-relaxed">
            The crypto analytics landscape has shifted dramatically. Competition intensified. Revenue models compressed. The cost of intelligence is falling fast. Meanwhile, execution infrastructure remains painfully underdeveloped.
          </p>
        </Reveal>

        {/* Two-panel market landscape */}
        <div className="border border-grid">
          <div className="grid md:grid-cols-2">

            {/* LEFT — Crowded analytics market */}
            <Reveal delay={0.1}>
              <div className="p-6 sm:p-8 md:border-r border-b md:border-b-0 border-grid flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="label-micro text-ink-secondary">Intelligence</span>
                  <span className="label-micro text-signal-error">Crowded</span>
                </div>
                <p className="text-[22px] sm:text-[26px] font-medium text-ink tracking-tight mb-6">
                  The old moat
                </p>

                {/* Landscape visual */}
                <div className="border border-grid p-3 mb-6 bg-[#080808]">
                  <CrowdedLandscape />
                </div>

                <p className="text-[14px] text-ink-tertiary leading-relaxed mb-4">
                  AI and open data are democratizing access to the very insights that once commanded premium pricing. What was once a moat is becoming a commodity.
                </p>

                <div className="mt-auto pt-4 border-t border-grid">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-signal-error shrink-0" />
                    <span className="text-[13px] text-signal-error font-mono">Every block is a competitor. And the space keeps shrinking.</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — Wide-open execution frontier */}
            <Reveal delay={0.2}>
              <div className="p-6 sm:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="label-micro text-ink-secondary">Execution</span>
                  <span className="label-micro text-accent">Wide open</span>
                </div>
                <p className="text-[22px] sm:text-[26px] font-medium text-ink tracking-tight mb-6">
                  The new frontier
                </p>

                {/* Landscape visual */}
                <div className="border border-grid p-3 mb-6 bg-[#080808]">
                  <OpenLandscape />
                </div>

                <p className="text-[14px] text-ink-tertiary leading-relaxed mb-4">
                  Cross-venue execution, prime brokerage workflows, institutional-grade order management across DeFi — the sophistication traders need simply doesn't exist yet.
                </p>

                <div className="mt-auto pt-4 border-t border-grid">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="text-[13px] text-accent font-mono">Nearly empty. This is where we're building.</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bottom: The conclusion */}
          <Reveal delay={0.35}>
            <div className="border-t border-grid p-6 sm:px-8 sm:py-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-px bg-signal-error" />
                  <ArrowRight className="w-4 h-4 text-ink-tertiary" />
                  <div className="w-8 h-px bg-accent" />
                </div>
                <p className="text-[15px] text-ink leading-relaxed">
                  <span className="font-medium">The answer was clear.</span>{' '}
                  <span className="text-ink-tertiary">We're concentrating our energy where it matters most — building the execution infrastructure this industry deserves.</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── Bento Features ─── */

function WalletFlowSvg() {
  return (
    <svg viewBox="0 0 280 100" fill="none" className="w-full" aria-hidden>
      {/* Center wallet */}
      <rect x="115" y="25" width="50" height="50" stroke="#1464FF" strokeWidth="1.5" fill="#001A4D" fillOpacity="0.2" />
      <text x="140" y="54" textAnchor="middle" fill="#1464FF" fontSize="18" fontFamily="monospace">⬡</text>

      {/* Left venues */}
      {[10, 35, 60].map((y, i) => (
        <g key={`l${i}`}>
          <rect x="10" y={y} width="55" height="18" stroke="#262626" strokeWidth="1" fill="#0A0A0A" />
          <text x="37" y={y + 12} textAnchor="middle" fill="#A3A3A3" fontSize="7" fontFamily="monospace">
            {['dYdX', 'GMX', 'Jupiter'][i]}
          </text>
          <line x1="65" y1={y + 9} x2="115" y2="50" stroke="#262626" strokeWidth="0.5" />
        </g>
      ))}

      {/* Right venues */}
      {[10, 35, 60].map((y, i) => (
        <g key={`r${i}`}>
          <rect x="215" y={y} width="55" height="18" stroke="#262626" strokeWidth="1" fill="#0A0A0A" />
          <text x="242" y={y + 12} textAnchor="middle" fill="#A3A3A3" fontSize="7" fontFamily="monospace">
            {['Hyperliquid', 'Uniswap', 'Aevo'][i]}
          </text>
          <line x1="215" y1={y + 9} x2="165" y2="50" stroke="#262626" strokeWidth="0.5" />
        </g>
      ))}
    </svg>
  )
}

function ArchitectureSvg() {
  return (
    <svg viewBox="0 0 200 130" fill="none" className="w-full max-w-[180px]" aria-hidden>
      {/* Stack layers */}
      {[
        { y: 0, label: 'UI LAYER', color: '#1464FF' },
        { y: 32, label: 'EXECUTION ENGINE', color: '#1464FF' },
        { y: 64, label: 'RISK MANAGEMENT', color: '#FFB800' },
        { y: 96, label: 'DATA PIPELINE', color: '#00CC66' },
      ].map((layer) => (
        <g key={layer.label}>
          <rect x="10" y={layer.y} width="180" height="26" stroke={layer.color} strokeWidth="1" fill="#0A0A0A" />
          <text x="100" y={layer.y + 16} textAnchor="middle" fill={layer.color} fontSize="8" fontFamily="monospace">
            {layer.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-28 px-5">
      <div className="max-w-[1200px] mx-auto">
        <Reveal>
          <div className="text-center mb-12">
            <span className="label-micro text-accent mb-3 block">Platform</span>
            <h2 className="text-[20px] sm:text-[24px] font-medium text-ink tracking-tight mb-3">
              Purpose-built for traders
            </h2>
            <p className="text-[15px] text-ink-tertiary max-w-md mx-auto">
              A ground-up reimagining — built for the decentralized economy.
            </p>
          </div>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-grid">

          {/* ── Row 1: Wallet (2-col span) + DeFi ── */}
          <Reveal delay={0.05} className="sm:col-span-2 lg:col-span-2">
            <div className="h-full p-6 sm:p-8 border-b border-r-0 sm:border-r border-grid flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-4 h-4 text-accent" />
                  <span className="label-micro text-accent">Unified</span>
                </div>
                <h3 className="text-[16px] font-medium text-ink mb-2">One wallet. Every venue.</h3>
                <p className="text-[14px] text-ink-tertiary leading-relaxed">
                  Connect a single wallet and trade across DEXes, perpetuals, and on-chain options ecosystems. Zero fragmentation.
                </p>
              </div>
              <div className="w-full lg:w-[55%] shrink-0">
                <WalletFlowSvg />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full p-6 sm:p-8 border-b border-grid">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-signal-success" />
                <span className="label-micro text-signal-success">DeFi</span>
              </div>
              <h3 className="text-[16px] font-medium text-ink mb-2">Decentralized-first</h3>
              <p className="text-[14px] text-ink-tertiary leading-relaxed mb-5">
                Spot swaps, perps, options — all routed and executed on-chain.
              </p>
              <div className="grid grid-cols-3 gap-px bg-grid-element">
                {['Spot', 'Perps', 'Options'].map((label) => (
                  <div key={label} className="bg-card p-2 text-center">
                    <span className="font-mono text-[10px] text-accent">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Row 2: Prime Brokerage + Intelligence + Architecture Diagram ── */}
          <Reveal delay={0.15}>
            <div className="h-full p-6 sm:p-8 border-b border-r-0 sm:border-r border-grid">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-signal-warn" />
                <span className="label-micro text-signal-warn">Institutional</span>
              </div>
              <h3 className="text-[16px] font-medium text-ink mb-2">Prime brokerage</h3>
              <p className="text-[14px] text-ink-tertiary leading-relaxed mb-5">
                Portfolio-level risk management, cross-venue margining, and operational tooling for serious trading desks.
              </p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-ink-tertiary">
                <span className="flex items-center gap-1"><Layers className="w-3 h-3 text-signal-warn" /> Risk Mgmt</span>
                <span className="flex items-center gap-1"><Box className="w-3 h-3 text-signal-warn" /> Margining</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="h-full p-6 sm:p-8 border-b border-r-0 lg:border-r border-grid">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-accent" />
                <span className="label-micro text-accent">Analytics</span>
              </div>
              <h3 className="text-[16px] font-medium text-ink mb-2">Embedded intelligence</h3>
              <p className="text-[14px] text-ink-tertiary leading-relaxed mb-5">
                Orderflow, funding rates, OI, on-chain metrics — woven directly into the execution workflow.
              </p>
              {/* Mini sparkline */}
              <svg viewBox="0 0 160 32" className="w-full" fill="none" aria-hidden>
                <motion.polyline
                  points="0,28 20,22 40,25 60,15 80,18 100,8 120,12 140,4 160,10"
                  stroke="#1464FF"
                  strokeWidth="1.25"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0.45 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
                <motion.circle
                  cx="160"
                  cy="10"
                  r="2.2"
                  fill="#1464FF"
                  initial={{ scale: 0.9, opacity: 0.65 }}
                  whileInView={{ scale: [0.9, 1.15, 0.9], opacity: [0.65, 1, 0.65] }}
                  viewport={{ once: false }}
                  transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="h-full p-6 sm:p-8 border-b border-grid flex flex-col items-center justify-center">
              <ArchitectureSvg />
              <p className="font-mono text-[10px] text-ink-tertiary mt-4 text-center">Full-stack architecture</p>
            </div>
          </Reveal>

          {/* ── Row 3: UX card + CTA accent card ── */}
          <Reveal delay={0.3} className="sm:col-span-2 lg:col-span-2">
            <div className="h-full p-6 sm:p-8 border-r-0 lg:border-r border-grid">
              <div className="flex items-center gap-2 mb-3">
                <Crosshair className="w-4 h-4 text-accent" />
                <span className="label-micro text-accent">UX</span>
              </div>
              <h3 className="text-[16px] font-medium text-ink mb-2">Trader-first design</h3>
              <p className="text-[14px] text-ink-tertiary leading-relaxed mb-5">
                Every screen, every workflow, every data point is optimized for decision-making and execution — not observation.
              </p>
              <div className="grid grid-cols-4 gap-px bg-grid-element">
                {[
                  { label: 'Orderbook', icon: BarChart3 },
                  { label: 'Charts', icon: Activity },
                  { label: 'Positions', icon: Layers },
                  { label: 'Signals', icon: Zap },
                ].map((item) => (
                  <div key={item.label} className="bg-card p-3 flex flex-col items-center gap-1.5">
                    <item.icon className="w-3.5 h-3.5 text-accent" />
                    <span className="font-mono text-[9px] text-ink-secondary">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.35}>
            <div className="h-full p-6 sm:p-8 bg-accent-subtle/20 border-l-0 lg:border-l border-grid flex flex-col items-center justify-center text-center">
              <Terminal className="w-6 h-6 text-accent mb-3" />
              <p className="font-mono text-[12px] text-accent font-medium mb-1">Not just a dashboard.</p>
              <p className="font-mono text-[12px] text-ink-tertiary">A trading machine.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── Roadmap (Visual Timeline) ─── */

const PHASES = [
  {
    q: 'Q1',
    label: 'Architecture',
    desc: 'Ground-up rebuild begins',
    details: ['Core engine', 'Data pipeline', 'Wallet infra'],
    status: 'done' as const,
    icon: Box,
  },
  {
    q: 'Q2',
    label: 'Previews',
    desc: 'Partner integrations & early access',
    details: ['Exchange connectors', 'Architecture previews', 'Early partners'],
    status: 'active' as const,
    icon: Layers,
  },
  {
    q: 'Q3',
    label: 'Beta',
    desc: 'Waitlist members get priority access',
    details: ['Private beta', 'Stress testing', 'Community feedback'],
    status: 'upcoming' as const,
    icon: Shield,
  },
  {
    q: 'Q4',
    label: 'Launch',
    desc: 'Panda Terminal 2.0 goes live',
    details: ['Public launch', 'Full DeFi coverage', 'Prime brokerage'],
    status: 'upcoming' as const,
    icon: Zap,
  },
]

function RoadmapSection() {
  const statusStyle = {
    done: {
      node: 'bg-signal-success border-signal-success',
      line: 'bg-signal-success',
      text: 'text-signal-success',
      card: 'border-signal-success/30',
      badge: 'bg-signal-success/10 text-signal-success border-signal-success/20',
      iconColor: 'text-signal-success',
    },
    active: {
      node: 'bg-accent border-accent animate-pulse-dot',
      line: 'bg-accent',
      text: 'text-accent',
      card: 'border-accent/40',
      badge: 'bg-accent/10 text-accent border-accent/20',
      iconColor: 'text-accent',
    },
    upcoming: {
      node: 'bg-subtle border-grid',
      line: 'bg-grid',
      text: 'text-ink-tertiary',
      card: 'border-grid',
      badge: 'bg-subtle text-ink-tertiary border-grid',
      iconColor: 'text-ink-tertiary',
    },
  }

  return (
    <section className="relative py-20 sm:py-28 px-5 overflow-hidden">
      <div className="max-w-[1000px] mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <span className="label-micro text-accent mb-3 block">Roadmap</span>
            <h2 className="text-[20px] sm:text-[24px] font-medium text-ink tracking-tight mb-3">The path to 2.0</h2>
            <p className="text-[15px] text-ink-tertiary">Heads down building. Q4 2026 launch.</p>
          </div>
        </Reveal>

        {/* ── Desktop: Horizontal timeline ── */}
        <div className="hidden md:block">
          <Reveal delay={0.1}>
            {/* SVG timeline track */}
            <div className="relative mb-10">
              <svg viewBox="0 0 1000 60" className="w-full" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden>
                {/* Background track */}
                <line x1="60" y1="30" x2="940" y2="30" stroke="#262626" strokeWidth="1" />

                {/* Completed segment */}
                <motion.line
                  x1="60" y1="30" x2="280" y2="30"
                  stroke="#00CC66" strokeWidth="2"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}
                />

                {/* Active segment (partial) */}
                <motion.line
                  x1="280" y1="30" x2="400" y2="30"
                  stroke="#1464FF" strokeWidth="2"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.9 }}
                />

                {/* Dashed future */}
                <line x1="500" y1="30" x2="940" y2="30" stroke="#262626" strokeWidth="1" strokeDasharray="6 4" />

                {/* Nodes */}
                {[
                  { cx: 125, fill: '#00CC66', r: 6 },
                  { cx: 375, fill: '#1464FF', r: 7 },
                  { cx: 625, fill: '#141414', r: 5 },
                  { cx: 875, fill: '#141414', r: 5 },
                ].map((n, i) => (
                  <g key={i}>
                    <circle cx={n.cx} cy={30} r={12} fill="#0A0A0A" stroke="#262626" strokeWidth="1" />
                    <motion.circle
                      cx={n.cx} cy={30} r={n.r}
                      fill={n.fill}
                      initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.15 }}
                    />
                  </g>
                ))}

                {/* Quarter labels on the track */}
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => (
                  <text key={q} x={125 + i * 250} y={54} textAnchor="middle" fill="#525252" fontSize="10" fontFamily="monospace">
                    {q}
                  </text>
                ))}
              </svg>
            </div>
          </Reveal>

          {/* Phase cards below the track */}
          <div className="grid grid-cols-4 gap-px bg-grid">
            {PHASES.map((p, i) => {
              const s = statusStyle[p.status]
              return (
                <Reveal key={p.q} delay={0.12 * i}>
                  <div className={`bg-card p-5 h-full border-t-2 ${s.card}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p.icon className={`w-4 h-4 ${s.iconColor}`} />
                      <span className={`label-micro px-2 py-0.5 border ${s.badge}`}>
                        {p.status === 'done' ? 'DONE' : p.status === 'active' ? 'NOW' : '2026'}
                      </span>
                    </div>
                    <h3 className="text-[14px] font-medium text-ink mb-1">{p.label}</h3>
                    <p className="text-[12px] text-ink-tertiary leading-relaxed mb-4">{p.desc}</p>
                    <div className="space-y-1.5">
                      {p.details.map((d) => (
                        <div key={d} className="flex items-center gap-2 text-[11px] font-mono">
                          <span className={`w-1 h-1 rounded-full ${s.node.split(' ')[0]}`} />
                          <span className="text-ink-secondary">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* ── Mobile: Vertical timeline ── */}
        <div className="md:hidden">
          <div className="relative pl-8">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-px bg-grid" />

            {/* Completed segment overlay */}
            <motion.div
              className="absolute left-[11px] top-0 w-px bg-signal-success"
              initial={{ height: 0 }}
              whileInView={{ height: '25%' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />

            <div className="space-y-0">
              {PHASES.map((p, i) => {
                const s = statusStyle[p.status]
                return (
                  <Reveal key={p.q} delay={0.1 * i}>
                    <div className="relative pb-8 last:pb-0">
                      {/* Node */}
                      <div className={`absolute left-[-31px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-canvas ${s.card}`}>
                        <div className={`w-2 h-2 rounded-full ${s.node.split(' ')[0]}`} />
                      </div>

                      {/* Card */}
                      <div className={`border ${s.card} bg-card p-4`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <p.icon className={`w-3.5 h-3.5 ${s.iconColor}`} />
                            <h3 className="text-[13px] font-medium text-ink">{p.label}</h3>
                          </div>
                          <span className={`label-micro px-2 py-0.5 border ${s.badge}`}>
                            {p.q}
                          </span>
                        </div>
                        <p className="text-[12px] text-ink-tertiary mb-3">{p.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {p.details.map((d) => (
                            <span key={d} className="text-[10px] font-mono text-ink-secondary bg-subtle px-2 py-0.5 border border-grid-element">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Stats ─── */

function StatsBar() {
  const stats = [
    { value: '847+', label: 'Trading Pairs' },
    { value: '12+', label: 'DEX Venues' },
    { value: '<50ms', label: 'Execution' },
    { value: "Q4 '26", label: 'Launch' },
  ]

  return (
    <section className="border-y border-grid bg-card/40">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-grid">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={0.08 * i}>
            <div className="py-8 px-5 text-center">
              <div className="font-mono text-lg sm:text-xl font-normal text-ink tabular-nums mb-1">{s.value}</div>
              <div className="label-micro text-ink-tertiary">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ─── Waitlist ─── */

function WaitlistSection() {
  useEffect(() => {
    const cssId = 'getwaitlist-widget-css'
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link')
      link.id = cssId
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css'
      document.head.appendChild(link)
    }

    const scriptId = 'getwaitlist-widget-js'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return (
    <section id="waitlist" className="relative py-20 sm:py-28 px-5">
      <div className="max-w-lg mx-auto text-center relative z-10">
        <Reveal>
          <span className="label-micro text-accent mb-3 block">Early Access</span>
          <h2 className="text-[20px] sm:text-[24px] font-medium text-ink tracking-tight mb-3">Be first in line</h2>
          <p className="text-[15px] text-ink-tertiary mb-8 leading-relaxed">
            Spots are limited. Early members get priority access, a direct line to the team, and the ability to shape the product.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div
            id="getWaitlistContainer"
            data-waitlist_id="32566"
            data-widget_type="WIDGET_1"
            className="getwaitlist-dark min-h-[72px]"
          />
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-6 flex items-center justify-center gap-5 flex-wrap">
            {[
              { icon: Shield, label: 'Priority access' },
              { icon: Zap, label: 'Shape the product' },
              { icon: ExternalLink, label: 'Direct team line' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5 text-[10px] font-mono text-ink-tertiary">
                <item.icon className="w-3 h-3" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function TermsOfServicePage() {
  return (
    <main className="pt-28 pb-20 px-5">
      <section className="max-w-[920px] mx-auto border border-grid bg-card">
        <div className="border-b border-grid px-6 sm:px-8 py-5">
          <p className="label-micro text-accent mb-2">Legal</p>
          <h1 className="text-[26px] sm:text-[34px] leading-tight font-medium text-ink tracking-tight mb-2">
            Terms of Service
          </h1>
          <p className="text-[14px] text-ink-secondary">
            Please review these terms carefully before using PANDA Terminal services.
          </p>
        </div>

        <article className="px-6 sm:px-8 py-7 space-y-8 text-[14px] text-ink-secondary leading-relaxed">
          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">1. Terms of Service: PANDA Terminal</h2>
            <p>
              By visiting our website, creating an account, accessing or downloading PANDA Terminal, and/or using any
              services provided by PANDA Terminal, you agree to be legally bound by these Terms of Service. Questions:
              <a href="mailto:support@pandaterminal.com" className="text-accent hover:text-accent-hover transition-colors ml-1">
                support@pandaterminal.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">2. General</h2>
            <p>
              These Terms govern your access to and use of PANDA Terminal, including websites, applications, tools, and
              related services. Services include trading and market analysis tools, alerts, order functionality,
              automated trading features, educational materials, and analytics.
            </p>
            <p className="mt-3">
              You confirm you have legal capacity and authority, comply with applicable laws, and provide accurate
              information. PANDA Terminal may amend these Terms and the Privacy Policy at any time.
            </p>
            <p className="mt-3">
              We may restrict access in certain jurisdictions and may implement technical controls. You must not
              circumvent restrictions, including with VPNs.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">3. Accounts and Services</h2>
            <p>
              Some Services require account registration. We may request additional information, refuse registration, or
              terminate accounts at our discretion.
            </p>
            <p className="mt-3">
              You must not use the Services to transmit unlawful content, impersonate others, transmit malicious code,
              reverse engineer the Services, or violate third-party rights. You are responsible for activity under your
              account and for safeguarding credentials.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">4. Third-Party Accounts</h2>
            <p>
              Certain features may connect to third-party exchange or broker accounts. You are responsible for those
              accounts, and PANDA Terminal is not responsible for their operation, availability, or termination.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">5. Subscriptions and Pricing</h2>
            <p>
              Subscription plans, pricing, and features are described on our website and may be updated. Subscriptions
              may auto-renew unless otherwise stated. Taxes may apply.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">6. Disclaimers and Limitation of Liability</h2>
            <p>
              Services are provided for informational and functional purposes only. PANDA Terminal does not provide
              investment, financial, or trading advice. Use involves risk and you accept responsibility for outcomes.
            </p>
            <p className="mt-3">
              To the fullest extent permitted by law, PANDA Terminal is not liable for indirect, incidental, or
              consequential damages. Total liability is limited to fees paid in the prior twelve months.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">7. Intellectual Property</h2>
            <p>
              All rights in the Services, software, trademarks, and content belong to PANDA Terminal or its licensors.
              A limited, non-transferable, non-commercial license is granted for personal use only.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">8. Confidentiality</h2>
            <p>
              You agree to maintain confidentiality of non-public information and to secure your credentials and
              devices.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">9. Privacy Policy</h2>
            <p>
              Our Privacy Policy explains data collection and processing and forms part of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">10. Changes to Terms</h2>
            <p>
              We may amend these Terms at any time. Continued use of Services after updates constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">11. Miscellaneous</h2>
            <p>
              These Terms are the entire agreement between you and PANDA Terminal. If any provision is invalid, the
              remaining provisions continue in effect.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">12. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by English law. Disputes are subject to the exclusive jurisdiction of the courts
              of England, unless PANDA Terminal elects arbitration.
            </p>
          </section>
        </article>
      </section>
    </main>
  )
}

function PrivacyPolicyPage() {
  return (
    <main className="pt-28 pb-20 px-5">
      <section className="max-w-[920px] mx-auto border border-grid bg-card">
        <div className="border-b border-grid px-6 sm:px-8 py-5">
          <p className="label-micro text-accent mb-2">Legal</p>
          <h1 className="text-[26px] sm:text-[34px] leading-tight font-medium text-ink tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-[14px] text-ink-secondary">
            How PANDA Terminal collects, uses, stores, and shares personal data.
          </p>
        </div>

        <article className="px-6 sm:px-8 py-7 space-y-8 text-[14px] text-ink-secondary leading-relaxed">
          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">1. Introduction</h2>
            <p>
              PANDA Terminal provides tools that allow users to manage cryptocurrency holdings, including API-based
              software services. This Notice explains how we process personal data when you use our website, app,
              account services, support channels, and marketing communications.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">2. Data Controller</h2>
            <p>
              PANDA Terminal is the controller for the processing described in this Notice. For privacy inquiries or
              to exercise your rights, contact:
              <a href="mailto:support@pandaterminal.com" className="text-accent hover:text-accent-hover transition-colors ml-1">
                support@pandaterminal.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">3. Categories of Personal Data</h2>
            <p>Depending on your use of the platform, we may process:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-accent">
              <li>Main account data (name, email, user ID, legal entity details where relevant).</li>
              <li>Billing data (payment details, wallet addresses, invoice preferences, payment checks).</li>
              <li>Transaction data (API credentials, exchange account metadata, order/transaction details).</li>
              <li>Communication data (message content, platform username, timestamps, conversation IDs).</li>
              <li>Marketing data (consents, campaign attribution, engagement, analytics identifiers).</li>
              <li>Technical and usage data (IP, device/browser metadata, logs, actions, visited pages).</li>
              <li>Cookie data used for product optimization and analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">4. Purposes and Legal Bases</h2>
            <p>We process personal data to:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-accent">
              <li>Provide and operate the service agreement (account creation, payments, core functionality).</li>
              <li>Maintain and improve services, personalize UX, and protect system security/integrity.</li>
              <li>Prevent abuse, fraud, misconduct, and comply with legal, regulatory, and law-enforcement requests.</li>
              <li>Conduct customer support, research, and beta testing.</li>
              <li>Send direct marketing where consent is required and granted.</li>
            </ul>
            <p className="mt-3">
              Where applicable, processing is based on contract necessity, legitimate interests, legal obligations,
              and/or your consent.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">5. Data Sharing and Transfers</h2>
            <p>We may share personal data with:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-accent">
              <li>Public authorities and regulators where required by law.</li>
              <li>Professional advisors (auditors, legal advisors).</li>
              <li>Group companies and potential acquirers in corporate transactions.</li>
              <li>Third-party service providers (core infrastructure, payments, analytics, marketing, attribution).</li>
              <li>Third-party integrations you choose to connect.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">6. Security</h2>
            <p>
              We use reasonable technical and organizational safeguards to protect personal data from unauthorized
              access, misuse, loss, and unlawful processing. No system is fully immune, so users should also secure
              their own accounts and devices.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">7. Retention Periods</h2>
            <p>Typical retention windows include:</p>
            <ul className="mt-3 space-y-2 list-disc pl-5 marker:text-accent">
              <li>Financial/transaction-related data: up to 7 years where required.</li>
              <li>Contract and account-related data: generally up to 3.5 years after termination.</li>
              <li>Communications: generally up to 3.5 years after closure.</li>
              <li>Marketing data: typically removed shortly after consent withdrawal or service termination.</li>
              <li>Technical/usage data: generally short-term operational retention.</li>
            </ul>
            <p className="mt-3">
              Retention may be extended where necessary for legal claims, fraud prevention, or legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">8. Your Rights</h2>
            <p>
              Subject to applicable law, you may request access, correction, deletion, restriction, portability, or
              objection to specific processing. You may also withdraw consent where processing relies on consent.
            </p>
            <p className="mt-3">
              You may have the right to complain to a supervisory authority and to request review of significant
              automated decisions.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">9. External Links</h2>
            <p>
              Our services may link to third-party sites and tools. Their privacy practices are governed by their own
              notices, not this policy.
            </p>
          </section>

          <section>
            <h2 className="text-[17px] font-medium text-ink mb-3">10. Contact</h2>
            <p>
              For questions, rights requests, or privacy concerns:
              <a href="mailto:support@pandaterminal.com" className="text-accent hover:text-accent-hover transition-colors ml-1">
                support@pandaterminal.com
              </a>
            </p>
          </section>
        </article>
      </section>
    </main>
  )
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer className="bg-card border-t border-[#101010] px-5 py-14 sm:py-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="border border-grid bg-subtle/30 p-6 sm:p-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="label-micro text-accent mb-3">Ready to trade smarter</p>
              <h3 className="text-[28px] sm:text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.02em] font-medium text-ink max-w-[760px]">
                Turn unstructured market data into high-conviction trades
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <a href="./" className="inline-flex items-center mb-4">
              <img src={pandaLogo} alt="PANDA Terminal" className="h-24 w-auto" />
            </a>
            <p className="text-[14px] text-ink-tertiary max-w-sm leading-relaxed">
              Execution-first infrastructure for modern crypto traders across DEXes, perps, and options venues.
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="label-micro text-ink-tertiary">Menu</p>
            <a href="./" className="block text-[14px] text-ink hover:text-ink-secondary transition-colors">Home</a>
            <a href="/announcement" className="block text-[14px] text-ink hover:text-ink-secondary transition-colors">Announcement</a>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="label-micro text-ink-tertiary">Legal</p>
            <a href="/termsofservice" className="block text-[14px] text-ink hover:text-ink-secondary transition-colors">Terms of Service</a>
            <a href="/privacy-policy" className="block text-[14px] text-ink hover:text-ink-secondary transition-colors">Privacy Policy</a>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="label-micro text-ink-tertiary">Social</p>
            <div className="space-y-2.5">
              <a
                href="https://x.com/pandaterminal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[14px] text-ink-secondary hover:text-ink transition-colors"
              >
                <span className="inline-flex w-5 justify-center">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4.5 h-4.5 fill-current">
                    <path d="M18.901 1H22l-6.764 7.73L23.2 23h-6.241l-4.889-6.38L6.49 23H3.39l7.233-8.267L.8 1h6.4l4.42 5.816L18.901 1zm-1.094 20.132h1.717L6.266 2.79H4.424l13.383 18.342z" />
                  </svg>
                </span>
                <span>X</span>
              </a>
              <a
                href="https://t.me/pandaterminal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[14px] text-ink-secondary hover:text-ink transition-colors"
              >
                <span className="inline-flex w-5 justify-center">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4.5 h-4.5 fill-current">
                    <path d="M9.036 15.804 8.66 21.1c.538 0 .771-.232 1.05-.51l2.52-2.41 5.223 3.825c.958.529 1.633.252 1.892-.882l3.43-16.077.001-.001c.304-1.42-.513-1.976-1.446-1.629L1.333 11.04C-.03 11.569-.01 12.33 1.101 12.673l5.11 1.593L18.11 6.77c.56-.37 1.07-.166.651.204" />
                  </svg>
                </span>
                <span>Telegram</span>
              </a>
              <a
                href="https://www.linkedin.com/company/panda-terminal"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-[14px] text-ink-secondary hover:text-ink transition-colors"
              >
                <span className="inline-flex w-5 justify-center">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4.5 h-4.5 fill-current">
                    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5 2.5 2.5 0 0 0 4.98 3.5ZM3 9h4v12H3zM9 9h3.8v1.7h.1c.53-1 1.82-2.06 3.75-2.06C20.4 8.64 21 11.1 21 14.2V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21H9z" />
                  </svg>
                </span>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-5 border-t border-grid flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[12px] text-ink-tertiary">© 2026 PANDA Terminal. All rights reserved.</p>
          <p className="text-[12px] font-mono text-ink-tertiary">Built for execution.</p>
        </div>
      </div>
    </footer>
  )
}

/* ─── App ─── */

export default function App() {
  const normalizedPath = typeof window !== 'undefined'
    ? window.location.pathname.replace(/\/+$/, '') || '/'
    : '/'
  const isAnnouncementPage = normalizedPath === '/announcement'
  const isTermsPage = normalizedPath === '/termsofservice'
  const isPrivacyPage = normalizedPath === '/privacy-policy'

  useEffect(() => {
    if (typeof window === 'undefined') return
    applySeoForPath(normalizedPath)
  }, [normalizedPath])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollToHashTarget = () => {
      if (window.location.hash !== '#waitlist') return
      // Delay ensures the section is mounted before attempting scroll.
      window.setTimeout(() => {
        const target = document.getElementById('waitlist')
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 0)
    }

    scrollToHashTarget()
    window.addEventListener('hashchange', scrollToHashTarget)
    return () => window.removeEventListener('hashchange', scrollToHashTarget)
  }, [normalizedPath])

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar />
      {isAnnouncementPage ? (
        <AnnouncementPage />
      ) : isTermsPage ? (
        <TermsOfServicePage />
      ) : isPrivacyPage ? (
        <PrivacyPolicyPage />
      ) : (
        <>
          <HeroSection />
          <ShiftSection />
          <StatsBar />
          <FeaturesSection />
          <RoadmapSection />
          <WaitlistSection />
        </>
      )}
      <Footer />
    </div>
  )
}
