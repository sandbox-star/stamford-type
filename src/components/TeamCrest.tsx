import type { Team } from '../game/types'

/** A distinct club badge per team, tinted with its colours. */
export function TeamCrest({ team, size = 36 }: { team: Team; size?: number }) {
  const id = `crest-${team.id}`
  // pick a motif from the team id so badges look varied
  const motif = team.short.charCodeAt(0) % 3
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 100 112" fill="none" aria-hidden className="shrink-0">
      <path
        d="M50 3 94 16v40c0 32-22 49-44 56C28 105 6 88 6 56V16L50 3Z"
        fill={`url(#${id})`}
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2.5"
      />
      {/* motif band */}
      {motif === 0 && (
        <path d="M6 44h88v14H6z" fill="rgba(255,255,255,0.18)" />
      )}
      {motif === 1 && (
        <path d="M50 3 60 16H40L50 3ZM6 16h22L6 40Zm88 0H72l22 24Z" fill="rgba(255,255,255,0.16)" />
      )}
      {motif === 2 && (
        <circle cx="50" cy="42" r="13" fill="rgba(255,255,255,0.14)" />
      )}
      <text
        x="50" y={motif === 2 ? 48 : 78} textAnchor="middle"
        fontFamily="Barlow Condensed, sans-serif" fontWeight="800" fontSize="30"
        fill="#fff" letterSpacing="1"
      >{team.short}</text>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor={team.primary} />
          <stop offset="1" stopColor={team.secondary} />
        </linearGradient>
      </defs>
    </svg>
  )
}
