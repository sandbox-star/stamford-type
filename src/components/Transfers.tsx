import type { GameState } from '../game/types'
import { TRANSFER_MARKET } from '../data/players'
import { Button, Panel, Tag } from './ui'

const POS_COLOR: Record<string, string> = {
  GK: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
  DEF: 'bg-sky-400/20 text-sky-300 border-sky-400/30',
  MID: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
  FWD: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
}

export default function Transfers({
  state,
  onBuy,
  onBack,
}: {
  state: GameState
  onBuy: (id: string, price: number) => void
  onBack: () => void
}) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-8 animate-rise">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={onBack} className="text-sm text-white/50 hover:text-white/80 transition">
            ← Back to club
          </button>
          <h1 className="mt-1 font-display text-3xl font-black tracking-tight">Transfer Market</h1>
        </div>
        <Panel className="px-5 py-3">
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/45 font-semibold">Budget</div>
          <div className="font-display text-2xl font-black tabular-nums text-gold-bright">£{state.budget}m</div>
        </Panel>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TRANSFER_MARKET.map((p) => {
          const owned = state.squad.includes(p.id)
          const affordable = state.budget >= p.price
          return (
            <Panel key={p.id} className={`p-5 transition ${owned ? 'border-good/30' : ''}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${POS_COLOR[p.pos]}`}>{p.pos}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">{p.nation}</span>
                  </div>
                  <div className="mt-2 font-display text-xl font-extrabold">{p.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wider text-white/40">OVR</div>
                  <div className="font-display text-3xl font-black tabular-nums text-blue-glow">{p.rating}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-lg font-bold tabular-nums text-gold-bright">£{p.price}m</span>
                {owned ? (
                  <Tag tone="muted">✓ Signed</Tag>
                ) : (
                  <Button
                    variant={affordable ? 'primary' : 'ghost'}
                    disabled={!affordable}
                    onClick={() => onBuy(p.id, p.price)}
                    className="px-4 py-2 text-sm"
                  >
                    {affordable ? 'Sign' : 'Too dear'}
                  </Button>
                )}
              </div>
            </Panel>
          )
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <Button variant="gold" onClick={onBack}>Done — back to club</Button>
      </div>
    </div>
  )
}
