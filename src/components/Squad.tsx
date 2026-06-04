import type { GameState, Player } from '../game/types'
import { playerById, squadStrength } from '../data/players'
import { Button, Panel } from './ui'

const ROWS: Array<{ pos: Player['pos']; label: string; slots: number }> = [
  { pos: 'FWD', label: 'Attack', slots: 3 },
  { pos: 'MID', label: 'Midfield', slots: 3 },
  { pos: 'DEF', label: 'Defence', slots: 4 },
  { pos: 'GK', label: 'Goalkeeper', slots: 1 },
]

function PlayerCard({ player }: { player: Player }) {
  return (
    <div className="animate-pop flex w-24 flex-col items-center rounded-xl border border-white/15 bg-gradient-to-b from-blue/40 to-black/40 px-2 py-2 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)] backdrop-blur">
      <span className="font-poster text-2xl leading-none text-gold-bright">{player.rating}</span>
      <span className="mt-1 truncate text-center font-condensed text-sm font-bold uppercase tracking-wide text-cream">{player.name}</span>
      <span className="text-[10px] uppercase tracking-widest text-white/45">{player.nation}</span>
    </div>
  )
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="flex h-[74px] w-24 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-center">
      <span className="text-lg text-white/20">+</span>
      <span className="px-1 text-[10px] uppercase tracking-wider text-white/30">{label}</span>
    </div>
  )
}

export default function Squad({ state, onBack, onTransfers }: { state: GameState; onBack: () => void; onTransfers: () => void }) {
  const owned = state.squad.map((id) => playerById(id)).filter(Boolean) as Player[]
  const strength = squadStrength(state.squad)

  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-6 animate-rise">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-white/50 transition hover:text-white/80">← Back to club</button>
        <div className="text-right">
          <div className="font-condensed text-xs uppercase tracking-widest text-white/45">Squad rating</div>
          <div className="font-poster text-2xl text-blue-glow">{strength || '—'}</div>
        </div>
      </div>

      <h1 className="mb-4 font-poster text-3xl tracking-tight">FIRST TEAM · 4-3-3</h1>

      {/* pitch */}
      <Panel className="relative overflow-hidden p-6">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              'repeating-linear-gradient(180deg, rgba(20,90,50,0.55) 0 56px, rgba(16,78,44,0.55) 56px 112px)',
          }}
        />
        <div className="pointer-events-none absolute inset-4 rounded-xl border-2 border-white/15" />
        <div className="pointer-events-none absolute left-1/2 top-4 bottom-4 w-px -translate-x-1/2 bg-white/15" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/15" />

        <div className="relative flex flex-col gap-5 py-2">
          {ROWS.map((row) => {
            const players = owned.filter((p) => p.pos === row.pos)
            const slots = Array.from({ length: Math.max(row.slots, players.length) })
            return (
              <div key={row.pos} className="flex flex-wrap items-center justify-center gap-3">
                {slots.map((_, i) =>
                  players[i] ? <PlayerCard key={players[i].id} player={players[i]} /> : <EmptySlot key={i} label={row.label} />,
                )}
              </div>
            )
          })}
        </div>
      </Panel>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-white/50">
          {owned.length === 0
            ? 'Your XI is empty. Win matches, bank the budget, and sign your stars.'
            : `${owned.length} player${owned.length === 1 ? '' : 's'} signed. Keep winning to complete the squad.`}
        </p>
        <Button variant="gold" onClick={onTransfers}>Sign players →</Button>
      </div>
    </div>
  )
}
