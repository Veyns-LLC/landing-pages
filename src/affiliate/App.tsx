import { useState, useEffect, type FormEvent } from 'react'

import { joinWaitlist } from './loops'

// ─── Brand tokens ──────────────────────────────────────────────────────────────
const VEYNS_BLUE = '#2B5BA8'
const VEYNS_DARK = '#1A3D7A'
const VEYNS_LIGHT = '#EEF4FF'
const VEYNS_ACCENT = '#A8C4E0'
const NAVY = '#0D1B2A'

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
function VeynsIconMark({ primary = VEYNS_BLUE, secondary = VEYNS_ACCENT, size = 38 }: { primary?: string; secondary?: string; size?: number }) {
  return (
    <svg viewBox="0 0 114 108" width={size} height={size * 108 / 114} fill="none" aria-hidden="true">
      {/* Left arm */}
      <path d="M0 6 L25 6 L56 98 L31 98 Z" fill={primary} />
      {/* Right arm */}
      <path d="M31 98 L56 98 L90 6 L65 6 Z" fill={primary} />
      {/* Central molecule node */}
      <circle cx="72" cy="27" r="4.5" fill={secondary} />
      {/* Upper-left arm + node */}
      <line x1="69" y1="23" x2="58" y2="10" stroke={secondary} strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="57" cy="9" r="4" fill={secondary} />
      {/* Right arm to hexagon */}
      <line x1="76" y1="25" x2="87" y2="18" stroke={secondary} strokeWidth="2.3" strokeLinecap="round" />
      {/* Benzene hexagon */}
      <path d="M87 8 L97 13 L97 24 L87 29 L77 24 L77 13 Z" stroke={secondary} strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Hexagon right arm */}
      <line x1="97" y1="24" x2="107" y2="29" stroke={secondary} strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="108" cy="30" r="3.8" fill={secondary} />
      {/* Hexagon top arm */}
      <line x1="87" y1="8" x2="83" y2="0" stroke={secondary} strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="82" cy="0" r="3.5" fill={secondary} />
    </svg>
  )
}

function VeynsLogo({ variant = 'dark', size = 'md' }: { variant?: 'dark' | 'light'; size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = { sm: 26, md: 34, lg: 46 }[size]
  const textCls = { sm: 'text-[13px]', md: 'text-[16px]', lg: 'text-[22px]' }[size]
  const primary = variant === 'light' ? '#ffffff' : VEYNS_BLUE
  const secondary = variant === 'light' ? 'rgba(255,255,255,0.65)' : VEYNS_ACCENT
  return (
    <div className="flex items-center gap-2 select-none">
      <VeynsIconMark primary={primary} secondary={secondary} size={iconSize} />
      <span className={`font-bold tracking-[0.22em] uppercase ${textCls}`} style={{ color: primary, fontFamily: 'Inter, sans-serif' }}>
        VEYNS
      </span>
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #E4EBF9' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <VeynsLogo />
        <nav className="hidden md:flex items-center gap-8">
          {[['how-it-works', 'How It Works'], ['why-veyns', 'Why Veyns'], ['faq', 'FAQ']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-medium text-body hover:text-veyns transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={focusWaitlistForm}
            className="hidden md:flex items-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95"
            style={{ background: VEYNS_BLUE }}
          >
            Join the Waitlist
          </button>
          <button
            className="md:hidden p-2 rounded-lg text-charcoal"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d={menuOpen ? 'M4 4 L18 18 M18 4 L4 18' : 'M3 6 H19 M3 11 H19 M3 16 H19'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-4">
          {[['how-it-works', 'How It Works'], ['why-veyns', 'Why Veyns'], ['faq', 'FAQ']].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-left text-sm font-medium text-body">
              {label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); focusWaitlistForm() }}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: VEYNS_BLUE }}
          >
            Join the Waitlist
          </button>
        </div>
      )}
    </header>
  )
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="relative flex justify-center">
      {/* Floating card — earnings */}
      <div
        className="absolute -left-4 md:-left-12 top-20 z-20 bg-white rounded-2xl p-3.5 w-36 border border-border"
        style={{ boxShadow: '0 8px 32px rgba(43,91,168,0.12)' }}
      >
        <p className="text-muted text-[11px] font-medium mb-0.5">This Month</p>
        <p className="text-navy text-lg font-bold font-mono">$250.00</p>
        <p className="text-green text-[11px] font-medium mt-0.5 flex items-center gap-0.5">
          <span>↑</span> +18% vs last
        </p>
      </div>

      {/* Floating card — referrals */}
      <div
        className="absolute -right-2 md:-right-10 bottom-32 z-20 bg-white rounded-2xl p-3.5 w-32 border border-border"
        style={{ boxShadow: '0 8px 32px rgba(43,91,168,0.12)' }}
      >
        <p className="text-muted text-[11px] font-medium mb-0.5">Referrals</p>
        <p className="text-navy text-lg font-bold font-mono">34</p>
        <p className="text-[11px] font-medium" style={{ color: VEYNS_BLUE }}>Active users</p>
      </div>

      {/* Phone frame */}
      <div
        className="relative w-64 h-[520px] rounded-[44px] overflow-hidden"
        style={{
          background: NAVY,
          border: `2px solid #1a2d4a`,
          boxShadow: `0 40px 96px rgba(13,27,42,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset`,
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-7 rounded-b-2xl z-10" style={{ background: NAVY }} />

        <div className="absolute inset-0 overflow-y-auto p-4" style={{ scrollbarWidth: 'none' }}>
          {/* Status + header */}
          <div className="flex justify-between items-center mb-4 pt-9 px-1">
            <span className="text-white/40 text-[11px] font-mono">9:41</span>
            <VeynsLogo variant="light" size="sm" />
            <div className="w-8" />
          </div>

          {/* Health score card */}
          <div className="rounded-2xl p-3.5 mb-2.5" style={{ background: '#132035' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/50 text-[11px] mb-1">Health Score</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white font-mono">87</span>
                  <span className="text-green text-xs font-semibold">↑ +3</span>
                </div>
                <p className="text-white/40 text-[11px] mt-0.5">Excellent range</p>
              </div>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="21" stroke="#1e3a5f" strokeWidth="5.5" />
                <circle cx="28" cy="28" r="21" stroke={VEYNS_BLUE} strokeWidth="5.5"
                  strokeDasharray="116 31" strokeDashoffset="29" strokeLinecap="round"
                  transform="rotate(-90 28 28)" />
                <text x="28" y="33" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="DM Mono">87</text>
              </svg>
            </div>
          </div>

          {/* Two metric cards */}
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            <div className="rounded-xl p-3" style={{ background: '#132035' }}>
              <p className="text-white/50 text-[10px] mb-1">Heart Rate</p>
              <p className="text-white text-lg font-bold font-mono">72 <span className="text-[10px] font-normal text-white/40">bpm</span></p>
              <div className="flex gap-0.5 mt-1.5 items-end h-4">
                {[40, 60, 45, 80, 55, 90, 60, 75].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 0.16}px`, background: i === 5 ? VEYNS_BLUE : '#2B5BA840' }} />
                ))}
              </div>
            </div>
            <div className="rounded-xl p-3" style={{ background: '#132035' }}>
              <p className="text-white/50 text-[10px] mb-1">Recovery</p>
              <p className="text-white text-lg font-bold font-mono">92%</p>
              <div className="mt-1.5 h-1.5 rounded-full" style={{ background: '#1e3a5f' }}>
                <div className="h-full rounded-full" style={{ width: '92%', background: '#22c55e' }} />
              </div>
              <p className="text-green text-[10px] mt-1">Optimal</p>
            </div>
          </div>

          {/* Sleep card */}
          <div className="rounded-xl p-3 mb-2.5" style={{ background: '#132035' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/50 text-[10px] mb-1">Sleep</p>
                <p className="text-white text-base font-bold font-mono">7h 42m</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: VEYNS_ACCENT, background: `${VEYNS_BLUE}22` }}>
                  Deep: 2h 10m
                </span>
              </div>
            </div>
            <div className="flex gap-1 mt-2 items-end h-5">
              {[20, 35, 45, 40, 60, 75, 70, 85, 78, 65, 50, 40].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm"
                  style={{ height: `${h * 0.25}px`, background: i > 5 ? '#5B8DD960' : `${VEYNS_BLUE}30` }} />
              ))}
            </div>
          </div>

          {/* Biomarkers */}
          <div className="rounded-xl p-3" style={{ background: '#132035' }}>
            <p className="text-white/50 text-[10px] mb-2">Biomarkers</p>
            <div className="flex gap-1.5">
              {[
                { name: 'Vit D', color: '#f59e0b', status: 'Low' },
                { name: 'Iron', color: '#22c55e', status: 'OK' },
                { name: 'HbA1c', color: '#22c55e', status: 'OK' },
                { name: 'B12', color: '#3b82f6', status: 'High' },
              ].map(b => (
                <div key={b.name} className="flex-1 rounded-lg p-1.5 text-center" style={{ background: `${b.color}15` }}>
                  <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: b.color }} />
                  <p className="text-white/60 text-[9px] font-medium">{b.name}</p>
                  <p className="text-[8px]" style={{ color: b.color }}>{b.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Waitlist Form ────────────────────────────────────────────────────────────

/** Sends the visitor to the hero signup form and puts the cursor in it. */
function focusWaitlistForm() {
  document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  // Focus once the smooth scroll has settled, so the browser doesn't jump.
  window.setTimeout(() => {
    document.getElementById('waitlist-first-name')?.focus({ preventScroll: true })
  }, 550)
}

const inputCls =
  'w-full rounded-xl border border-border bg-white px-4 py-3.5 text-[15px] text-charcoal ' +
  'placeholder:text-muted/70 outline-none transition-all duration-200 ' +
  'focus:border-veyns focus:ring-4 focus:ring-veyns/12 disabled:opacity-60'

function WaitlistForm() {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  const submitting = status === 'submitting'

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submitting) return
    setError(null)
    setStatus('submitting')

    const result = await joinWaitlist(firstName, email, company)
    if (result.ok) {
      setStatus('done')
    } else {
      setError(result.message)
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div
        id="waitlist-form"
        className="animate-rise rounded-2xl p-7 text-center"
        style={{
          background: `linear-gradient(160deg, ${VEYNS_LIGHT} 0%, #ffffff 100%)`,
          border: `1px solid ${VEYNS_BLUE}25`,
          boxShadow: `0 10px 40px ${VEYNS_BLUE}14`,
        }}
      >
        <div
          className="animate-pop mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: VEYNS_BLUE, boxShadow: `0 6px 20px ${VEYNS_BLUE}50` }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5 L9.5 18 L20 6.5" />
          </svg>
        </div>
        <p className="text-navy text-lg font-bold" role="status">
          You're on the list{firstName.trim() ? `, ${firstName.trim()}` : ''}.
        </p>
        <p className="text-body mt-2 text-sm leading-relaxed">
          We'll email you the moment early affiliate spots open up — keep an eye on your inbox.
        </p>
      </div>
    )
  }

  return (
    <form
      id="waitlist-form"
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl bg-white p-5"
      style={{ border: '1px solid #E4EBF9', boxShadow: `0 8px 32px ${VEYNS_BLUE}12` }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="waitlist-first-name" className="sr-only">First name</label>
          <input
            id="waitlist-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
          <input
            id="waitlist-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            required
            aria-invalid={error ? true : undefined}
            className={inputCls}
          />
        </div>
      </div>

      {/* Honeypot — bots fill it, humans never see it. Matches the field
          name the waiting-list form uses. */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
      />

      <button
        type="submit"
        disabled={submitting}
        className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
        style={{ background: VEYNS_BLUE, boxShadow: `0 4px 20px ${VEYNS_BLUE}40` }}
      >
        {submitting
          ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="white" strokeOpacity="0.3" strokeWidth="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Joining…
            </>
          )
          : (
            <>
              Join the Affiliate Waitlist
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </>
          )}
      </button>

      <p className="text-muted mt-3 flex items-center justify-center gap-1.5 text-center text-xs" aria-live="polite">
        {error
          ? <span className="font-medium text-red-600">{error}</span>
          : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={VEYNS_BLUE} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12.5 L9.5 18 L20 6.5" />
              </svg>
              Free to join · No commitment · Unsubscribe anytime
            </>
          )}
      </p>
    </form>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden" style={{ background: '#ffffff' }}>
      {/* Background gradient blob */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${VEYNS_LIGHT} 0%, transparent 70%)`, transform: 'translate(20%, -30%)' }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left */}
          <div className="max-w-lg">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase mb-6"
              style={{ background: VEYNS_LIGHT, color: VEYNS_BLUE, border: `1px solid ${VEYNS_BLUE}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: VEYNS_BLUE }} />
              Limited Early Affiliate Spots
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-black leading-[1.08] tracking-tight text-navy mb-6">
              Earn 40% Recurring Commission With{' '}
              <span style={{ color: VEYNS_BLUE }}>Veyns</span>
            </h1>
            <p className="text-body text-lg leading-relaxed mb-8">
              Join the Veyns Affiliate Program and earn recurring revenue for 12 months on every customer you refer. Early affiliates get access to our limited 40% commission rate.
            </p>
            <WaitlistForm />
            <button
              onClick={() => scrollTo('how-it-works')}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity duration-200 hover:opacity-70"
              style={{ color: VEYNS_BLUE }}
            >
              See how it works ↓
            </button>
            <div className="flex items-center gap-6 mt-8 pt-8 border-t border-border">
              {[['40%', 'Recurring commission'], ['12 months', 'Paid per customer'], ['$15/mo', 'Subscription price']].map(([val, label]) => (
                <div key={val}>
                  <p className="text-lg font-bold text-navy font-mono">{val}</p>
                  <p className="text-muted text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Commission Highlight ─────────────────────────────────────────────────────
function CommissionSection() {
  return (
    <section style={{ background: NAVY }} className="py-24 md:py-32 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${VEYNS_BLUE}20 0%, transparent 70%)`
      }} />
      <div className="max-w-7xl mx-auto px-6 text-center relative">
        <p className="text-veyns-accent text-sm font-semibold tracking-widest uppercase mb-4">Commission Structure</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-6">40% Recurring. For 12 Months.</h2>
        <div className="relative inline-flex flex-col items-center mb-12">
          <span
            className="font-black leading-none select-none"
            style={{
              fontSize: 'clamp(120px, 18vw, 200px)',
              color: 'transparent',
              WebkitTextStroke: `2px ${VEYNS_BLUE}`,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
              textShadow: `0 0 80px ${VEYNS_BLUE}40`,
            }}
          >
            40%
          </span>
          <p className="text-white/60 text-base -mt-2">of subscription revenue from every customer you refer, for their first 12 months</p>
        </div>

        {/* Calculation flow */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-0 max-w-2xl mx-auto">
          {[
            { label: 'Subscription', value: '$15', unit: '/month', sub: 'Customer pays' },
            null,
            { label: 'Your Earnings', value: '$6.00', unit: '/month', sub: 'You receive 40%', highlight: true },
            null,
            { label: 'Over 12 Months', value: '$72', unit: 'total', sub: 'Per customer' },
          ].map((item, i) =>
            item === null ? (
              <div key={i} className="text-white/30 text-2xl font-light px-2 md:px-4 rotate-90 md:rotate-0">
                →
              </div>
            ) : (
              <div
                key={i}
                className="flex-1 rounded-2xl p-6 text-center transition-transform hover:-translate-y-1"
                style={{
                  background: item.highlight ? `${VEYNS_BLUE}` : '#132035',
                  border: `1px solid ${item.highlight ? VEYNS_BLUE : '#1e3a5f'}`,
                  maxWidth: '180px',
                }}
              >
                <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">{item.label}</p>
                <p className="font-black text-white font-mono" style={{ fontSize: '2rem' }}>{item.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{item.unit}</p>
                <p className="text-white/50 text-[11px] mt-2">{item.sub}</p>
              </div>
            )
          )}
        </div>

        <p className="text-white/40 text-sm mt-10 max-w-xl mx-auto leading-relaxed">
          You earn commission for up to 12 months from the date each referred customer subscribes, and only for as long as they remain a paying subscriber. If you leave or are removed from the program, no further commission is paid.
        </p>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Join', desc: 'Join the Veyns Affiliate Waitlist and register your interest.' },
    { num: '02', title: 'Get Your Link', desc: 'Once the affiliate program launches, receive your unique referral link through your affiliate dashboard.' },
    { num: '03', title: 'Share Veyns', desc: 'Share Veyns with your audience through content, social media, communities, newsletters, or other approved channels.' },
    { num: '04', title: 'Earn Recurring Revenue', desc: 'Earn 40% recurring commission for up to 12 months from each eligible customer you refer.' },
  ]
  return (
    <section id="how-it-works" className="py-24 md:py-32" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: VEYNS_BLUE }}>Process</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy">How the Veyns Affiliate Program Works</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px" style={{ background: `linear-gradient(to right, transparent, ${VEYNS_BLUE}30, transparent)` }} />
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ background: VEYNS_LIGHT, border: `1px solid ${VEYNS_BLUE}18` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-bold text-white text-sm font-mono relative z-10"
                style={{ background: VEYNS_BLUE }}
              >
                {step.num}
              </div>
              <h3 className="text-navy font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-body text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Who Should Join ──────────────────────────────────────────────────────────
function AudienceSection() {
  const audiences = [
    { icon: '🔬', title: 'Biohackers', desc: 'Obsessed with optimizing every health metric and biomarker.' },
    { icon: '🏋️', title: 'Fitness Creators', desc: 'Building audiences around performance, recovery, and results.' },
    { icon: '🌿', title: 'Health & Wellness Creators', desc: 'Teaching audiences to live and feel better every day.' },
    { icon: '👨‍⚕️', title: 'Doctors & Health Professionals', desc: 'Helping patients understand their own health data.' },
    { icon: '💪', title: 'Personal Trainers', desc: 'Coaching clients who care deeply about tracking progress.' },
    { icon: '👥', title: 'Health Communities', desc: 'Running spaces where people share health optimization journeys.' },
    { icon: '📧', title: 'Newsletter Creators', desc: 'Writing for health-conscious, data-driven readers.' },
    { icon: '📱', title: 'Content Creators', desc: 'Producing content for audiences who want to understand their bodies.' },
  ]
  return (
    <section className="py-24 md:py-32" style={{ background: '#F7F9FF' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-4">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: VEYNS_BLUE }}>Ideal Affiliates</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy mb-4">Built For People Who Influence Better Health Decisions</h2>
          <p className="text-body text-base max-w-lg mx-auto">
            If your audience cares about understanding their health, performance, recovery, or biomarkers, Veyns could be a natural fit.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {audiences.map((a, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-default"
              style={{ border: `1px solid ${VEYNS_BLUE}14` }}
            >
              <div className="text-2xl mb-4">{a.icon}</div>
              <h3 className="font-bold text-navy text-base mb-2 group-hover:text-veyns transition-colors">{a.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Veyns ────────────────────────────────────────────────────────────────
function WhyVeynsSection() {
  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={VEYNS_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Real Product',
      desc: 'Veyns is building a health-focused platform designed around personal health data — not a generic supplement or ebook.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={VEYNS_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22V12M12 12V2" /><path d="M17 7l-5-5-5 5" /><path d="M17 17l-5 5-5-5" />
        </svg>
      ),
      title: 'Recurring Revenue',
      desc: 'Earn from customers you refer month after month for a full year — not a one-time flat fee that disappears.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={VEYNS_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      title: 'Growing Category',
      desc: 'Health optimization, wearable data, and personalized insights are among the fastest-growing areas in consumer tech.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={VEYNS_BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: 'Early Partner Advantage',
      desc: 'Join during the early stage and secure the limited 40% commission offer before spots are filled.',
    },
  ]
  return (
    <section id="why-veyns" className="py-24 md:py-32" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: VEYNS_BLUE }}>Why Us</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy">More Than Another Affiliate Product</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
              style={{ background: '#ffffff', border: `1px solid #E4EBF9` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: VEYNS_LIGHT }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-navy text-lg mb-2">{f.title}</h3>
              <p className="text-body text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Dashboard Preview ────────────────────────────────────────────────────────
function DashboardPreview() {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText('https://veyns.com/?ref=creatorname')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const stats = [
    { label: 'Total Earnings', value: '$1,027.60', sub: 'All time', trend: '+$250.00 this month', up: true },
    { label: 'Active Customers', value: '34', sub: 'Paying subscribers', trend: '+4 this month', up: true },
    { label: 'Link Clicks', value: '1,842', sub: 'Unique clicks', trend: '+186 this week', up: true },
    { label: 'Conversion Rate', value: '7.8%', sub: 'Clicks → customers', trend: '+0.4% vs avg', up: true },
    { label: 'Recurring Revenue', value: '$204.00', sub: 'Monthly run rate', trend: '+$24 vs last', up: true },
    { label: 'Avg. LTV', value: '$30.22', sub: 'Per customer', trend: 'Stable', up: false },
  ]

  return (
    <section className="py-24 md:py-32" style={{ background: '#F7F9FF' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: VEYNS_BLUE }}>Dashboard Preview</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy mb-3">Know Exactly What You're Earning</h2>
          <p className="text-muted text-base">Your affiliate dashboard gives you real-time visibility into every metric that matters.</p>
        </div>

        {/* Browser mockup */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E4EBF9', boxShadow: '0 24px 80px rgba(43,91,168,0.10)' }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 py-3.5" style={{ background: '#F0F4FB', borderBottom: '1px solid #E4EBF9' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: '#fc5f57' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#fdbc2c' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#29ca41' }} />
            <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-white text-xs text-muted font-mono border border-border max-w-xs">
              dashboard.veyns.com
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-6 md:p-8 bg-white">
            {/* Topbar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-navy text-lg">Affiliate Dashboard</h3>
                <p className="text-muted text-sm">September 2026</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
                <span className="text-green text-xs font-medium">Program Active</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 md:p-5 transition-all hover:shadow-md"
                  style={{ background: i === 0 ? VEYNS_BLUE : '#F7F9FF', border: `1px solid ${i === 0 ? VEYNS_BLUE : '#E4EBF9'}` }}
                >
                  <p className={`text-xs font-medium uppercase tracking-wider mb-1.5 ${i === 0 ? 'text-white/70' : 'text-muted'}`}>{s.label}</p>
                  <p className={`text-xl md:text-2xl font-black font-mono ${i === 0 ? 'text-white' : 'text-navy'}`}>{s.value}</p>
                  <p className={`text-xs mt-1 ${i === 0 ? 'text-white/50' : 'text-muted'}`}>{s.sub}</p>
                  <p className={`text-xs mt-2 font-medium ${s.up ? 'text-green' : 'text-muted'} ${i === 0 ? '!text-white/70' : ''}`}>
                    {s.up && s.trend !== 'Stable' ? '↑ ' : ''}{s.trend}
                  </p>
                </div>
              ))}
            </div>

            {/* Referral link card */}
            <div className="rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ background: VEYNS_LIGHT, border: `1px solid ${VEYNS_BLUE}20` }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: VEYNS_BLUE }}>Your Referral Link</p>
                <p className="text-navy font-mono text-sm font-medium truncate">veyns.com/?ref=creatorname</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: copied ? '#22c55e' : VEYNS_BLUE }}
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="2 7 6 11 12 3" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="5" width="8" height="8" rx="2" />
                      <path d="M9 5V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <p className="text-muted text-xs text-center mt-4">Visual concept only — dashboard will be available when the affiliate program launches.</p>
      </div>
    </section>
  )
}

// ─── Early Access ─────────────────────────────────────────────────────────────
function EarlyAccessSection() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0f2545 60%, ${VEYNS_DARK} 100%)`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 80% at 50% 50%, ${VEYNS_BLUE}25 0%, transparent 65%)`
      }} />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '48px 48px'
      }} />
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <div
          className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase mb-8"
          style={{ background: `${VEYNS_BLUE}30`, color: VEYNS_ACCENT, border: `1px solid ${VEYNS_BLUE}50` }}
        >
          Early Affiliate Rate
        </div>

        <div className="flex justify-center mb-6">
          <span
            className="font-black leading-none"
            style={{
              fontSize: 'clamp(100px, 16vw, 180px)',
              color: 'transparent',
              WebkitTextStroke: `2px ${VEYNS_BLUE}`,
              textShadow: `0 0 100px ${VEYNS_BLUE}60`,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            40%
          </span>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-white mb-5">The 40% Commission Is Limited</h2>
        <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          We're reserving a limited number of early affiliate spots at the 40% recurring commission rate. Once these spots are filled, the commission rate for new affiliates may be significantly reduced.
        </p>
        <button
          onClick={focusWaitlistForm}
          className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base text-white transition-all duration-200 hover:opacity-90 hover:shadow-2xl active:scale-95 mb-4"
          style={{ background: VEYNS_BLUE, boxShadow: `0 8px 32px ${VEYNS_BLUE}60` }}
        >
          Reserve My Spot
        </button>
        <p className="text-white/40 text-sm">No commitment required during the waitlist stage.</p>
      </div>
    </section>
  )
}

// ─── Requirements ─────────────────────────────────────────────────────────────
function RequirementsSection() {
  const reqs = [
    'Generate at least 2 paying customers per month to remain an active affiliate.',
    'Create authentic, relevant content that accurately represents Veyns.',
    'Follow advertising and platform guidelines.',
    'Do not make misleading health claims or promises.',
    'Do not use spam, fraudulent traffic, or deceptive marketing.',
    'Veyns may review affiliate performance and promotional activity.',
    'Commission is paid only while you are an active affiliate. If you leave or are removed from the program, no further commission is paid.',
  ]
  return (
    <section className="py-24 md:py-32" style={{ background: '#ffffff' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: VEYNS_BLUE }}>Requirements</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy">A Few Things We Ask From Our Affiliates</h2>
        </div>
        <div className="space-y-3">
          {reqs.map((req, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl p-5 transition-all hover:shadow-sm"
              style={{ background: VEYNS_LIGHT, border: `1px solid ${VEYNS_BLUE}15` }}
            >
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                style={{ background: VEYNS_BLUE }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1.5 6 4.5 9 10.5 3" />
                </svg>
              </div>
              <p className="text-body text-sm leading-relaxed">{req}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="text-sm font-semibold underline underline-offset-4 transition-colors hover:opacity-70" style={{ color: VEYNS_BLUE }}>
            View Full Affiliate Policy
          </button>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    {
      q: 'How much commission do I earn?',
      a: 'Early affiliates can earn 40% recurring commission on eligible subscription revenue generated through their referrals.',
    },
    {
      q: 'How long do I earn commission?',
      a: 'For up to 12 months from the date each referred customer subscribes, and only while they remain a paying subscriber. After 12 months, commission on that customer ends.',
    },
    {
      q: 'When will I get my affiliate link?',
      a: "You'll receive access to your affiliate dashboard and unique referral link once the affiliate program launches.",
    },
    {
      q: 'Can I join before Veyns launches?',
      a: "Yes. Join the affiliate waiting list now and we'll contact you when the program is ready.",
    },
    {
      q: 'Is the 40% commission guaranteed for everyone?',
      a: 'The 40% rate is a limited early-affiliate offer. New affiliates may receive a lower commission rate after the early spots are filled.',
    },
    {
      q: "What happens if I don't get 2 sales in a month?",
      a: "Veyns reviews affiliate performance regularly. Affiliates who consistently don't meet the minimum requirement may be removed from the active program.",
    },
    {
      q: 'What happens to my commission if I leave or am removed?',
      a: 'Commission is paid only while you are an active affiliate. If you leave the program or are removed from it, no further commission is paid — including on customers you referred earlier.',
    },
  ]
  return (
    <section id="faq" className="py-24 md:py-32" style={{ background: '#F7F9FF' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase mb-3" style={{ color: VEYNS_BLUE }}>FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#ffffff', border: `1px solid ${open === i ? VEYNS_BLUE + '40' : '#E4EBF9'}` }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-navy text-sm md:text-base pr-4 group-hover:text-veyns transition-colors">{faq.q}</span>
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: open === i ? VEYNS_BLUE : VEYNS_LIGHT,
                    color: open === i ? 'white' : VEYNS_BLUE,
                    transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 4 6 8 10 4" />
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: open === i ? '200px' : '0px' }}
              >
                <p className="px-6 pb-5 text-body text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="py-24 md:py-36" style={{ background: NAVY }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <VeynsLogo variant="light" size="lg" />
        <h2 className="text-4xl md:text-5xl font-black text-white mt-10 mb-4 leading-tight">
          Build With Veyns.<br />Earn With Veyns.
        </h2>
        <p className="text-white/60 text-lg leading-relaxed mb-10">
          Join the early affiliate community and secure your opportunity to earn 40% recurring commission.
        </p>
        <button
          onClick={focusWaitlistForm}
          className="inline-flex items-center justify-center px-9 py-4 rounded-xl font-semibold text-base text-white transition-all duration-200 hover:opacity-90 hover:shadow-2xl active:scale-95 mb-4"
          style={{ background: VEYNS_BLUE, boxShadow: `0 8px 32px ${VEYNS_BLUE}50` }}
        >
          Join the Affiliate Waitlist
        </button>
        <p className="text-white/30 text-sm">Limited 40% commission spots available.</p>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: '#070f1a', borderTop: '1px solid #1a2d4a' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <VeynsLogo variant="light" size="md" />
            <p className="text-white/40 text-sm mt-3 mb-6">Health Data. Better Decisions.</p>
            <div className="flex gap-4">
              {[
                {
                  label: 'Instagram',
                  svg: <path d="M17.5 6.5h.01M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 110 10A5 5 0 0112 7z" />,
                },
                {
                  label: 'LinkedIn',
                  svg: <><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
                },
                {
                  label: 'X',
                  svg: <path d="M4 4l16 16M20 4L4 20" />,
                },
              ].map(social => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:opacity-80 hover:-translate-y-0.5"
                  style={{ background: '#132035', border: '1px solid #1e3a5f' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {social.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>
          {/* Links */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {['About Veyns', 'Affiliate Program', 'Affiliate Policy'].map(link => (
                <li key={link}>
                  <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map(link => (
                <li key={link}>
                  <a href="#" className="text-white/50 text-sm hover:text-white transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #1a2d4a' }}>
          <p className="text-white/25 text-xs">© 2026 Veyns LLC. All rights reserved.</p>
          <p className="text-white/20 text-xs">Health Data. Better Decisions.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <HeroSection />
        <CommissionSection />
        <HowItWorksSection />
        <AudienceSection />
        <WhyVeynsSection />
        <DashboardPreview />
        <EarlyAccessSection />
        <RequirementsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  )
}
