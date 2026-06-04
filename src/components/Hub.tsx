import type { GameState } from '../game/types'
import { passageForMatchday } from '../data/passages'
import { squadStrength } from '../data/players'
import { Button, Crest, Panel, Stat, Tag } from './ui'

export default function Hub({
  state,
  onPlay,
  onTransfers,
}: {
  state: GameState
  onPlay: () => void
  onTransfers: () => void
}) {
  const fixture = passageForMatchday(state.matchday)
  const strength = squadStrength(state.squad)
  const weak = Object.entries(state.weakWords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-8 animate-rise">
      {/* Club header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Crest size={56} />
          <div>
            <h1 className="font-display text-3xl font-black leading-none tracking-tight">Stamford Type FC</h1>
            <p className="mt-1 text-sm text-white/50">Spelling Premier League · Matchday {state.matchday}</p>
          </div>
        </div>
        <Panel className="px-5 py-3 text-right">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-semibold">Transfer budget</div>
          <div className="font-display text-2xl font-black tabular-nums text-gold-bright">£{state.budget}m</div>
        </Panel>
      </header>

      {/* Top stats strip */}
      <Panel className="mb-4 grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 md:grid-cols-6">
        <Stat label="Points" value={<span className="text-2xl">{state.points}</span>} />
        <Stat label="Record" value={<span className="text-2xl">{state.won}-{state.drawn}-{state.lost}</span>} />
        <Stat label="Goals" value={<span className="text-2xl">{state.goalsFor}:{state.goalsAgainst}</span>} />
        <Stat label="Squad OVR" value={<span className="text-2xl text-blue-glow">{strength || '—'}</span>} />
        <Stat label="Signings" value={<span className="text-2xl">{state.squad.length}</span>} />
        <Stat
          label="Best accuracy"
          value={<span className="text-2xl text-good">{state.bestAccuracy ? `${state.bestAccuracy.toFixed(0)}%` : '—'}</span>}
        />
      </Panel>

      <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
        {/* Next fixture */}
        <Panel className="flex flex-col p-6" glow>
          <div className="mb-3 flex items-center justify-between">
            <Tag tone="blue">Next fixture</Tag>
            <Tag tone="muted">{'★'.repeat(fixture.difficulty)}{'☆'.repeat(3 - fixture.difficulty)} difficulty</Tag>
          </div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">{fixture.title}</h2>
          <p className="text-sm text-white/45">{fixture.topic}</p>
          <p className="mt-3 line-clamp-3 font-serif text-[15px] leading-relaxed text-cream/70">
            {fixture.text.slice(0, 180)}…
          </p>
          <div className="mt-auto pt-5">
            <Button onClick={onPlay} className="w-full text-lg">▶ Kick off — play the match</Button>
            <p className="mt-2 text-center text-xs text-white/40">
              Type it clean, then proofread. Accuracy wins games & earns budget.
            </p>
          </div>
        </Panel>

        {/* Side column */}
        <div className="flex flex-col gap-4">
          <Panel className="p-6">
            <h3 className="mb-3 font-display text-lg font-extrabold">Training ground</h3>
            {weak.length === 0 ? (
              <p className="text-sm text-white/50">No weak words yet — play a match and we'll track the words that trip you up here.</p>
            ) : (
              <>
                <p className="mb-3 text-sm text-white/50">Words you keep missing:</p>
                <div className="flex flex-wrap gap-2">
                  {weak.map(([w, n]) => (
                    <span key={w} className="rounded-lg border border-bad/25 bg-bad/10 px-2.5 py-1 font-mono text-sm text-bad/90">
                      {w} <span className="text-bad/50">×{n}</span>
                    </span>
                  ))}
                </div>
              </>
            )}
          </Panel>

          <Panel className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-display text-lg font-extrabold">Transfer market</h3>
              <p className="text-sm text-white/50">Sign players with your budget</p>
            </div>
            <Button variant="gold" onClick={onTransfers} className="px-4 py-2">Open</Button>
          </Panel>
        </div>
      </div>
    </div>
  )
}
