import type { MatchOutcome, Team } from '../game/types'
import type { ResultMeta } from './Match'
import { Button, Crest, Panel } from './ui'
import { TeamCrest } from './TeamCrest'

const KIND_LABELS: Record<string, string> = {
  spelling: 'Spelling',
  capitalisation: 'Capitals',
  punctuation: 'Punctuation',
  missing: 'Missed words',
  extra: 'Extra words',
}

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function commentary(o: MatchOutcome, meta: ResultMeta): string[] {
  const lines: string[] = []
  const acc = o.report.accuracy
  if (o.motm) lines.push(`A masterclass — not a single error past the proofread. The ${meta.opponent.short} keeper had no chance.`)
  else if (o.result === 'W') lines.push(`Stamford take the points with ${acc.toFixed(1)}% accuracy. Composed under the lights.`)
  else if (o.result === 'D') lines.push(`Honours even. A few sloppy touches cost a famous win.`)
  else lines.push(`A chastening afternoon — ${o.missed} error${o.missed === 1 ? '' : 's'} slipped through and ${meta.opponent.name} punished them.`)

  if (o.saves > 0) lines.push(`★ ${o.saves} error${o.saves === 1 ? '' : 's'} clawed back in proofreading — that's £${(o.saves * 0.5).toFixed(1)}m of bonus and the habit the gaffer wants.`)
  else if (o.missed > 0) lines.push(`Nothing salvaged at the back — slow down and re-read before submitting next time.`)

  lines.push(`Tempo: ${meta.wpm} wpm.`)
  return lines
}

function Confetti() {
  const colors = ['#1d6fe0', '#f1d28a', '#34d399', '#3a8dff', '#ffffff']
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 h-2.5 w-1.5 rounded-[1px]"
          style={{
            left: `${(i * 37) % 100}%`,
            background: colors[i % colors.length],
            animation: `confettiFall ${2.2 + (i % 5) * 0.4}s linear ${(i % 7) * 0.18}s 1 both`,
          }}
        />
      ))}
    </div>
  )
}

export default function Results({
  outcome,
  meta,
  position,
  onContinue,
  onTransfers,
}: {
  outcome: MatchOutcome
  meta: ResultMeta
  opponent: Team
  position: number
  onContinue: () => void
  onTransfers: () => void
}) {
  const { report } = outcome
  const won = outcome.result === 'W'
  const resultText = won ? 'VICTORY' : outcome.result === 'D' ? 'DRAW' : 'DEFEAT'
  const resultColor = won ? 'text-good' : outcome.result === 'D' ? 'text-warn' : 'text-bad'
  const momentum = Math.max(4, Math.min(96, report.accuracy)) // bar fill toward Stamford

  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-6 animate-rise">
      {/* SCOREBOARD */}
      <Panel className="relative overflow-hidden p-0" glow>
        {won && <Confetti />}
        <div className="relative bg-gradient-to-b from-blue/30 to-transparent px-6 pt-6 pb-5">
          <div className={`text-center font-poster text-lg tracking-[0.35em] ${resultColor}`}>{resultText}</div>

          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <Crest size={56} />
              <span className="font-condensed text-base font-bold uppercase tracking-wide text-cream">Stamford</span>
            </div>
            <div className="animate-score flex items-center gap-3 font-poster text-7xl tabular-nums leading-none">
              <span className={won ? 'text-good' : 'text-cream'}>{outcome.goalsFor}</span>
              <span className="text-white/25">:</span>
              <span className="text-cream">{outcome.goalsAgainst}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TeamCrest team={meta.opponent} size={56} />
              <span className="font-condensed text-base font-bold uppercase tracking-wide text-cream">{meta.opponent.short}</span>
            </div>
          </div>

          {/* momentum bar */}
          <div className="mx-auto mt-5 max-w-md">
            <div className="flex h-2.5 overflow-hidden rounded-full bg-bad/40">
              <div className="bg-gradient-to-r from-blue-bright to-good" style={{ width: `${momentum}%` }} />
            </div>
            <div className="mt-1 flex justify-between font-condensed text-[11px] uppercase tracking-widest text-white/40">
              <span>Possession (accuracy)</span>
              <span>{report.accuracy.toFixed(1)}%</span>
            </div>
          </div>

          {outcome.motm && (
            <div className="mt-4 flex justify-center">
              <span className="rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 font-condensed text-sm font-bold uppercase tracking-widest text-gold-bright">★ Man of the Match · Clean Sheet</span>
            </div>
          )}
        </div>

        {/* key numbers */}
        <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 sm:grid-cols-4">
          {[
            ['Accuracy', `${report.accuracy.toFixed(1)}%`, report.accuracy >= 98 ? 'text-good' : report.accuracy >= 92 ? 'text-warn' : 'text-bad'],
            ['Self-caught', `+${outcome.saves}`, 'text-good'],
            ['Budget won', `£${outcome.budgetEarned}m`, 'text-gold-bright'],
            ['Now', ordinal(position), position <= 3 ? 'text-ucl' : 'text-cream'],
          ].map(([label, val, color]) => (
            <div key={label} className="px-3 py-3 text-center">
              <div className="font-condensed text-[11px] uppercase tracking-widest text-white/40">{label}</div>
              <div className={`font-poster text-2xl ${color}`}>{val}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* commentary */}
      <Panel className="mt-4 p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg">🎙️</span>
          <h3 className="font-condensed text-sm font-bold uppercase tracking-widest text-white/50">Full-time report</h3>
        </div>
        <div className="space-y-1.5">
          {commentary(outcome, meta).map((l, i) => (
            <p key={i} className="font-serif text-[15px] leading-relaxed text-cream/85">{l}</p>
          ))}
        </div>
      </Panel>

      {/* breakdown + corrections */}
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <Panel className="p-5">
          <h3 className="mb-4 font-display text-lg font-extrabold">Stat sheet</h3>
          <div className="space-y-2.5">
            {(Object.keys(KIND_LABELS) as Array<keyof typeof KIND_LABELS>).map((k) => {
              const n = report.errorsByKind[k as keyof typeof report.errorsByKind]
              return (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{KIND_LABELS[k]}</span>
                  <span className={`font-mono text-sm tabular-nums ${n === 0 ? 'text-good' : 'text-bad'}`}>{n === 0 ? '✓ 0' : n}</span>
                </div>
              )
            })}
            <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-sm font-semibold text-white/80">Marks lost</span>
              <span className="font-mono text-lg font-bold tabular-nums text-bad">{outcome.missed}</span>
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <h3 className="mb-4 font-display text-lg font-extrabold">The replay — your corrections</h3>
          <p className="font-serif text-[16px] leading-[1.9]">
            {report.tokens.map((t, i) => {
              if (t.ok) return <span key={i} className="text-cream/85">{t.typed} </span>
              if (t.kind === 'missing') return <span key={i} className="mx-0.5 rounded bg-warn/15 px-1 text-warn">[{t.target}] </span>
              if (t.kind === 'extra') return <span key={i} className="text-bad/60 line-through">{t.typed} </span>
              return (
                <span key={i} className="whitespace-nowrap">
                  <span className="text-bad line-through">{t.typed}</span>
                  <span className="mx-0.5 rounded bg-good/15 px-1 font-semibold text-good">{t.target}</span>{' '}
                </span>
              )
            })}
          </p>
          {report.totalErrors === 0 && <p className="mt-2 text-sm text-good">Flawless. Not a single mistake — exam-ready.</p>}
        </Panel>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="ghost" onClick={onContinue}>Back to club</Button>
        <Button variant="gold" onClick={onTransfers}>Spend £{outcome.budgetEarned}m in the market →</Button>
      </div>
    </div>
  )
}
