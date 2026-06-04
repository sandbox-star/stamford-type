import type { ReactNode } from 'react'

export function Crest({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" fill="none" aria-hidden>
      <path
        d="M50 4 92 18v34c0 30-20 47-42 54C28 99 8 82 8 52V18L50 4Z"
        fill="url(#cg)"
        stroke="var(--color-gold)"
        strokeWidth="3"
      />
      <path
        d="M50 14 84 25v27c0 24-16 38-34 44C32 90 16 76 16 52V25L50 14Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1"
      />
      <text
        x="50" y="58" textAnchor="middle"
        fontFamily="Archivo" fontWeight="900" fontSize="34"
        fill="var(--color-gold-bright)" letterSpacing="-1"
      >ST</text>
      <text
        x="50" y="80" textAnchor="middle"
        fontFamily="Archivo" fontWeight="700" fontSize="9"
        fill="rgba(255,255,255,0.55)" letterSpacing="3"
      >TYPE</text>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a5bc0" />
          <stop offset="1" stopColor="#022a5e" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Panel({
  children,
  className = '',
  glow = false,
}: {
  children: ReactNode
  className?: string
  glow?: boolean
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] ${glow ? 'animate-glow' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'gold'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-display font-bold tracking-wide transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed select-none'
  const styles = {
    primary:
      'bg-gradient-to-b from-[#1d6fe0] to-[#034694] text-white shadow-[0_8px_24px_-8px_rgba(29,111,224,0.8)] hover:from-[#3a8dff] hover:to-[#0a5bc0]',
    gold:
      'bg-gradient-to-b from-[#f1d28a] to-[#d9b46a] text-[#1a1206] shadow-[0_8px_24px_-8px_rgba(217,180,106,0.7)] hover:brightness-110',
    ghost:
      'bg-white/5 text-cream border border-white/10 hover:bg-white/10',
  }[variant]
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  )
}

export function Stat({ label, value, accent }: { label: string; value: ReactNode; accent?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-semibold">{label}</span>
      <span className={`font-display font-extrabold tabular-nums leading-tight ${accent ?? 'text-cream'}`}>{value}</span>
    </div>
  )
}

export function Tag({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'gold' | 'muted' }) {
  const tones = {
    blue: 'bg-blue-bright/15 text-blue-glow border-blue-bright/30',
    gold: 'bg-gold/15 text-gold-bright border-gold/30',
    muted: 'bg-white/5 text-white/55 border-white/10',
  }[tone]
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] ${tones}`}>
      {children}
    </span>
  )
}
