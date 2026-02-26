import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Wallet,
  Layers,
  Shield,
  BarChart3,
  Crosshair,
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Zap,
  Globe,
  Terminal,
  TrendingUp,
  ArrowDownRight,
  Clock,
} from 'lucide-react'

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-bg animate-grid-fade" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-panda-brand/[0.04] blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
    </div>
  )
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-panda-border-dim' : ''}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-panda-surface-mid border border-panda-border-med flex items-center justify-center">
            <span className="font-mono font-bold text-sm text-panda-brand">P</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">PANDA</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-panda-brand/10 text-panda-brand border border-panda-brand/20">v2.0</span>
        </div>
        <a
          href="#waitlist"
          className="text-xs font-medium px-4 py-2 rounded-md bg-panda-brand text-white hover:bg-panda-brand/90 transition-colors"
        >
          Join Waitlist
        </a>
      </div>
    </nav>
  )
}

function TickerBar() {
  const items = [
    { label: 'BTC/USDT', value: '97,432.50', change: '+2.4%', bull: true },
    { label: 'ETH/USDT', value: '3,841.20', change: '+1.8%', bull: true },
    { label: 'SOL/USDT', value: '248.65', change: '-0.6%', bull: false },
    { label: 'AVAX/USDT', value: '42.18', change: '+5.2%', bull: true },
    { label: 'ARB/USDT', value: '1.847', change: '-1.2%', bull: false },
    { label: 'OP/USDT', value: '3.24', change: '+3.1%', bull: true },
  ]

  const doubled = [...items, ...items]

  return (
    <div className="w-full overflow-hidden border-b border-panda-border-dim bg-panda-surface-low/50">
      <div className="animate-ticker flex whitespace-nowrap py-2">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-6 text-[11px] font-mono">
            <span className="text-panda-text-secondary">{item.label}</span>
            <span className="text-panda-text-primary font-medium">${item.value}</span>
            <span className={item.bull ? 'text-panda-bull' : 'text-panda-bear'}>{item.change}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col">
      <GridBackground />
      <TickerBar />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-14">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-panda-border-med bg-panda-surface-mid/50 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-panda-bull animate-pulse-glow" />
              <span className="text-[11px] font-mono text-panda-text-secondary tracking-wide uppercase">Announcement</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="gradient-text">Panda Terminal</span>
              <br />
              <span className="text-panda-text-primary">2.0</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg sm:text-xl md:text-2xl font-mono font-medium text-panda-text-secondary mb-4">
              Built for Execution
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-sm sm:text-base text-panda-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
              The next chapter of Panda. One wallet. Every venue.
              <br className="hidden sm:block" />
              Decentralized-first trade execution.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#waitlist"
                className="group flex items-center gap-2 px-6 py-3 rounded-md bg-panda-brand text-white font-medium text-sm hover:bg-panda-brand/90 transition-all glow-brand-strong"
              >
                Get Early Access
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#features"
                className="flex items-center gap-2 px-6 py-3 rounded-md border border-panda-border-med text-panda-text-secondary text-sm hover:border-panda-border-bright hover:text-white transition-all"
              >
                See What's New
                <ChevronDown className="w-4 h-4" />
              </a>
            </div>
          </AnimatedSection>

          {/* Terminal Preview Mock */}
          <AnimatedSection delay={0.6} className="mt-16 sm:mt-20">
            <TerminalPreview />
          </AnimatedSection>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-panda-text-muted" />
      </div>
    </section>
  )
}

function TerminalPreview() {
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="glow-brand rounded-lg">
        <div className="bg-panda-surface-low border border-panda-border-med rounded-lg overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-panda-border-dim bg-panda-surface-mid/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-panda-bear/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-panda-warn/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-panda-bull/60" />
              </div>
              <span className="text-[10px] font-mono text-panda-text-muted ml-2">panda-terminal-v2.0</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-panda-text-muted">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-panda-bull" /> Connected</span>
            </div>
          </div>

          {/* Mock terminal content */}
          <div className="p-4 sm:p-6 text-left space-y-3 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-panda-brand">$</span>
              <span className="text-panda-text-primary">panda connect --wallet 0x...a3f7</span>
            </div>
            <div className="text-panda-bull">✓ Wallet connected across 12 venues</div>
            <div className="flex items-center gap-2">
              <span className="text-panda-brand">$</span>
              <span className="text-panda-text-primary">panda scan --markets perps,spot,options</span>
            </div>
            <div className="text-panda-text-secondary">
              <span className="text-panda-warn">⚡</span> Scanning 847 pairs across dYdX, GMX, Hyperliquid, Jupiter...
            </div>
            <div className="text-panda-bull">✓ Orderflow signals loaded · Funding rates synced</div>
            <div className="flex items-center gap-2">
              <span className="text-panda-brand">$</span>
              <span className="text-panda-text-primary">panda execute --ready</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-panda-bull animate-pulse-glow">█</span>
              <span className="text-panda-text-muted">Awaiting your command...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShiftSection() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="text-[11px] font-mono text-panda-brand uppercase tracking-widest">The Shift</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">Markets Evolved. So Did We.</h2>
            <p className="text-sm text-panda-text-muted max-w-lg mx-auto">
              The cost of intelligence is falling fast. What was once a moat is becoming a commodity. Trade execution is the new frontier.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <AnimatedSection delay={0.1}>
            <div className="group relative p-6 sm:p-8 rounded-lg bg-panda-surface-mid border border-panda-border-dim hover:border-panda-bear/30 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-panda-bear/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-panda-bear/10 border border-panda-bear/20 flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-5 h-5 text-panda-bear" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2">Analytics Commoditized</h3>
                  <p className="text-xs text-panda-text-muted leading-relaxed">
                    AI and open data are democratizing insights that once commanded premium pricing. Competition compressed. Revenue models shrunk.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-panda-bear">
                  <TrendingUp className="w-3 h-3 rotate-180" />
                  <span>Revenue compression</span>
                </div>
                <div className="flex items-center gap-1.5 text-panda-text-muted">
                  <Layers className="w-3 h-3" />
                  <span>High competition</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="group relative p-6 sm:p-8 rounded-lg bg-panda-surface-mid border border-panda-border-dim hover:border-panda-bull/30 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-panda-bull/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-panda-bull/10 border border-panda-bull/20 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5 text-panda-bull" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2">Execution Underserved</h3>
                  <p className="text-xs text-panda-text-muted leading-relaxed">
                    Cross-venue execution, prime brokerage workflows, institutional-grade order management across DeFi — still painfully underdeveloped.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 text-[10px] font-mono">
                <div className="flex items-center gap-1.5 text-panda-bull">
                  <TrendingUp className="w-3 h-3" />
                  <span>Massive opportunity</span>
                </div>
                <div className="flex items-center gap-1.5 text-panda-text-muted">
                  <Globe className="w-3 h-3" />
                  <span>Open frontier</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  {
    icon: Wallet,
    title: 'One Wallet. Every Venue.',
    desc: 'Connect a single wallet and trade across DEXes, perps, and on-chain options. No fragmentation.',
    tag: 'UNIFIED',
    color: 'brand' as const,
  },
  {
    icon: Globe,
    title: 'Decentralized-First',
    desc: 'All-in on DeFi. Spot swaps, perps, options — routed and executed on-chain with speed traders need.',
    tag: 'DEFI',
    color: 'bull' as const,
  },
  {
    icon: Shield,
    title: 'Prime Brokerage',
    desc: 'Portfolio-level risk management, cross-venue margining, and operational tooling for serious desks.',
    tag: 'INSTITUTIONAL',
    color: 'warn' as const,
  },
  {
    icon: BarChart3,
    title: 'Embedded Intelligence',
    desc: 'Orderflow, funding rates, OI, on-chain metrics — woven into the execution workflow at the point of action.',
    tag: 'ANALYTICS',
    color: 'info' as const,
  },
  {
    icon: Crosshair,
    title: 'Trader-First Design',
    desc: 'Every screen, workflow, and data point optimized for decision-making and execution — not observation.',
    tag: 'UX',
    color: 'brand' as const,
  },
]

const colorMap = {
  brand: { bg: 'bg-panda-brand/10', border: 'border-panda-brand/20', text: 'text-panda-brand' },
  bull: { bg: 'bg-panda-bull/10', border: 'border-panda-bull/20', text: 'text-panda-bull' },
  warn: { bg: 'bg-panda-warn/10', border: 'border-panda-warn/20', text: 'text-panda-warn' },
  info: { bg: 'bg-panda-info/10', border: 'border-panda-info/20', text: 'text-panda-info' },
}

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 grid-bg opacity-[0.03]" />
      <div className="max-w-6xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="text-[11px] font-mono text-panda-brand uppercase tracking-widest">What's New</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">
              Purpose-Built for Traders
            </h2>
            <p className="text-sm text-panda-text-muted max-w-lg mx-auto">
              A ground-up reimagining of the platform — built for the decentralized economy.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const colors = colorMap[f.color]
            return (
              <AnimatedSection key={f.title} delay={0.1 * i}>
                <div className="group h-full relative p-6 rounded-lg bg-panda-surface-low border border-panda-border-dim hover:border-panda-border-med transition-all">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-panda-brand/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-md ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}>
                      <f.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className={`text-[9px] font-mono font-semibold tracking-wider px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {f.tag}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
                  <p className="text-xs text-panda-text-muted leading-relaxed">{f.desc}</p>
                </div>
              </AnimatedSection>
            )
          })}

          {/* Large visual card filling last slot */}
          <AnimatedSection delay={0.5}>
            <div className="h-full relative p-6 rounded-lg bg-gradient-to-br from-panda-brand/5 to-panda-surface-low border border-panda-brand/20 flex flex-col justify-center items-center text-center">
              <Terminal className="w-8 h-8 text-panda-brand mb-3" />
              <p className="font-mono text-xs text-panda-brand font-medium">
                Not just a dashboard.
              </p>
              <p className="font-mono text-xs text-panda-text-muted mt-1">
                A trading machine.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

function RoadmapSection() {
  const milestones = [
    { quarter: 'Q1 2026', label: 'Architecture & Core', desc: 'Ground-up rebuild begins', status: 'done' },
    { quarter: 'Q2 2026', label: 'Early Previews', desc: 'Partner integrations & architecture previews', status: 'active' },
    { quarter: 'Q3 2026', label: 'Beta Access', desc: 'Waitlist members get priority access', status: 'upcoming' },
    { quarter: 'Q4 2026', label: 'Full Launch', desc: 'Panda Terminal 2.0 goes live', status: 'upcoming' },
  ]

  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="text-[11px] font-mono text-panda-brand uppercase tracking-widest">Roadmap</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">The Path to 2.0</h2>
            <p className="text-sm text-panda-text-muted max-w-lg mx-auto">
              Heads down building. Q4 2026 launch.
            </p>
          </div>
        </AnimatedSection>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-panda-border-dim sm:-translate-x-px" />

          <div className="space-y-8 sm:space-y-12">
            {milestones.map((m, i) => (
              <AnimatedSection key={m.quarter} delay={0.1 * i}>
                <div className={`relative flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      m.status === 'done'
                        ? 'bg-panda-bull border-panda-bull'
                        : m.status === 'active'
                          ? 'bg-panda-brand border-panda-brand animate-pulse-glow'
                          : 'bg-panda-surface-high border-panda-border-bright'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className={`ml-10 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                    <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide mb-2 ${
                      m.status === 'done'
                        ? 'bg-panda-bull/10 text-panda-bull border border-panda-bull/20'
                        : m.status === 'active'
                          ? 'bg-panda-brand/10 text-panda-brand border border-panda-brand/20'
                          : 'bg-panda-surface-high text-panda-text-muted border border-panda-border-dim'
                    }`}>
                      {m.quarter}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{m.label}</h3>
                    <p className="text-xs text-panda-text-muted">{m.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { value: '847+', label: 'Trading Pairs', icon: TrendingUp },
    { value: '12+', label: 'DEX Venues', icon: Globe },
    { value: '<50ms', label: 'Execution Speed', icon: Zap },
    { value: 'Q4 2026', label: 'Launch Target', icon: Clock },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 border-y border-panda-border-dim bg-panda-surface-low/30">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {stats.map((s, i) => (
          <AnimatedSection key={s.label} delay={0.1 * i}>
            <div className="text-center">
              <s.icon className="w-5 h-5 text-panda-brand mx-auto mb-3" />
              <div className="font-mono text-xl sm:text-2xl font-bold text-panda-text-primary mb-1">{s.value}</div>
              <div className="text-[11px] font-mono text-panda-text-muted uppercase tracking-wider">{s.label}</div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

function WaitlistSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section id="waitlist" className="relative py-24 sm:py-32 px-4 sm:px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-panda-brand/[0.03] blur-[100px]" />
      </div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        <AnimatedSection>
          <span className="text-[11px] font-mono text-panda-brand uppercase tracking-widest">Early Access</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4">Be First in Line</h2>
          <p className="text-sm text-panda-text-muted mb-8 leading-relaxed">
            Spots are limited for the initial launch. Early members get priority access, a direct line to the team, and the ability to shape the product.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="flex-1 px-4 py-3 rounded-md bg-panda-surface-mid border border-panda-border-med text-sm text-white placeholder:text-panda-text-muted focus:outline-2 focus:outline-panda-brand focus:outline-offset-1 transition-colors font-mono"
              />
              <button
                type="submit"
                className="group flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-panda-brand text-white font-medium text-sm hover:bg-panda-brand/90 transition-all glow-brand-strong shrink-0"
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-lg bg-panda-bull/5 border border-panda-bull/20"
            >
              <div className="text-panda-bull font-mono text-sm font-medium mb-1">✓ You're on the list</div>
              <p className="text-xs text-panda-text-muted">We'll reach out with early access details before Q4 2026.</p>
            </motion.div>
          )}
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono text-panda-text-muted">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" />
              <span>Priority access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3" />
              <span>Shape the product</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ExternalLink className="w-3 h-3" />
              <span>Direct team line</span>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-panda-border-dim py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-panda-surface-mid border border-panda-border-med flex items-center justify-center">
            <span className="font-mono font-bold text-[10px] text-panda-brand">P</span>
          </div>
          <span className="text-xs font-medium text-panda-text-secondary">PANDA Terminal</span>
          <span className="text-[10px] text-panda-text-muted">© 2026</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-panda-text-muted">
          <span>Since 2022</span>
          <span className="text-panda-border-bright">·</span>
          <span>Intelligence → Execution</span>
          <span className="text-panda-border-bright">·</span>
          <span className="text-panda-brand">Q4 2026</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-panda-base text-panda-text-primary noise-overlay">
      <Navbar />
      <HeroSection />
      <ShiftSection />
      <StatsBar />
      <FeaturesSection />
      <RoadmapSection />
      <WaitlistSection />
      <Footer />
    </div>
  )
}
