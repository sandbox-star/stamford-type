import type { MatchOutcome } from '../game/types'
import type { ResultMeta } from './Match'
import { Button, Panel, Stat, Tag } from './ui'

const KIND_LABELS: Record<string, string> = {
  spelling: 'Spelling',
  capitalisation: 'Capitals',
  punctuation: 'Punctuation',
  missing: 'Missed words',
  extra: 'Extra words',
}

export default function Results({
  outcome,
  meta,
  onContinue,
  onTransfers,
}: {
  outcome: MatchOutcome
  meta: ResultMeta
  onContinue: () => void
  onTransfers: () => void
}) {
  const { report } = outcome
  const resultText = outcome.result === 'W' ? 'WIN' : outcome.result === 'D' ? 'DRAW' : 'LOSS'
  const resultColor =
    outcome.result === 'W' ? 'text-good' : outcome.result === 'D' ? 'text-warn' : 'text-bad'

  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-8 animate-rise">
      {/* Scoreboard */}
      <Panel className="overflow-hidden p-0" glow>
        <div className="bg-gradient-to-b from-blue/30 to-transparent p-7 text-center">
          <div className={`font-display text-sm font-black uppercase tracking-[0.4em] ${resultColor}`}>
            {resultText}
          </div>
          <div className="mt-2 flex items-center justify-center gap-6">
            <span className="font-display text-xl font-bold text-white/70">Stamford</span>
            <span className="font-display text-6xl font-black tabular-nums tracking-tighter">
              {outcome.goalsFor}<span className="mx-2 text-white/30">–</span>{outcome.goalsAgainst}
            </span>
            <span className="font-display text-xl font-bold text-white/70">{meta.passage.topic.split(' ')[0]} XI</span>
          </div>
          {outcome.motm && (
            <div className="mt-3 inline-flex"><Tag tone="gold">★ Clean sheet — Man of the Match</Tag></div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/10 p-6 md:grid-cols-4">
          <Stat
            label="Accuracy"
            value={`${report.accuracy.toFixed(1)}%`}
            accent={report.accuracy >= 98 ? 'text-good text-3xl' : report.accuracy >= 92 ? 'text-warn text-3xl' : 'text-bad text-3xl'}
          />
          <Stat label="Speed" value={<span className="text-3xl">{meta.wpm}<span className="ml-1 text-sm text-white/40">wpm</span></span>} />
          <Stat label="Self-caught" value={<span className="text-3xl text-good">+{outcome.saves}</span>} />
          <Stat
            label="Budget earned"
            value={<span className="text-3xl text-gold-bright">£{outcome.budgetEarned}m</span>}
          />
        </div>
      </Panel>

      {/* Error breakdown */}
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.4fr]">
        <Panel className="p-6">
          <h3 className="mb-4 font-display text-lg font-extrabold">Match report</h3>
          <div className="space-y-3">
            {(Object.keys(KIND_LABELS) as Array<keyof typeof KIND_LABELS>).map((k) => {
              const n = report.errorsByKind[k as keyof typeof report.errorsByKind]
              return (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-sm text-white/60">{KIND_LABELS[k]}</span>
                  <span className={`font-mono text-sm tabular-nums ${n === 0 ? 'text-good' : 'text-bad'}`}>
                    {n === 0 ? '✓ 0' : `${n}`}
                  </span>
                </div>
              )
            })}
            <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-sm font-semibold text-white/80">Marks lost</span>
              <span className="font-mono text-lg font-bold tabular-nums text-bad">{outcome.missed}</span>
            </div>
          </div>
        </Panel>

        <Panel className="p-6">
          <h3 className="mb-4 font-display text-lg font-extrabold">Corrections</h3>
          <p className="font-serif text-[16px] leading-[1.9]">
            {report.tokens.map((t, i) => {
              if (t.ok) return <span key={i} className="text-cream/85">{t.typed} </span>
              if (t.kind === 'missing')
                return <span key={i} className="mx-0.5 rounded bg-warn/15 px-1 text-warn">[{t.target}] </span>
              if (t.kind === 'extra')
                return <span key={i} className="text-bad/60 line-through">{t.typed} </span>
              return (
                <span key={i} className="whitespace-nowrap">
                  <span className="text-bad line-through">{t.typed}</span>
                  <span className="mx-0.5 rounded bg-good/15 px-1 font-semibold text-good">{t.target}</span>{' '}
                </span>
              )
            })}
          </p>
          {report.totalErrors === 0 && (
            <p className="mt-2 text-sm text-good">Flawless. Not a single mistake — exam-ready.</p>
          )}
        </Panel>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Button variant="ghost" onClick={onContinue}>Back to club</Button>
        <Button variant="gold" onClick={onTransfers}>Spend £{outcome.budgetEarned}m in the market →</Button>
      </div>
    </div>
  )
}
