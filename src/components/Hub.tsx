import type { GameState } from '../game/types'
import { passageForMatchday } from '../data/passages'
import { squadStrength } from '../data/players'
import { PLAYER_TEAM_ID, TEAMS, opponentForMatchday, positionOf } from '../data/league'
import { Button, Crest, Panel } from './ui'
import { TeamCrest } from './TeamCrest'
import LeagueTable from './LeagueTable'

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function MiniForm({ form }: { form: string[] }) {
  const padded = [...Array(Math.max(0, 5 - form.length)).fill(''), ...form].slice(-5)
  return (
    <div className="flex gap-1">
      {padded.map((r, i) =>
        r ? (
          <span key={i} className={`grid h-5 w-5 place-items-center rounded text-[10px] font-black text-black/80 ${r === 'W' ? 'bg-good' : r === 'D' ? 'bg-warn' : 'bg-bad'}`}>{r}</span>
        ) : (
          <span key={i} className="h-5 w-5 rounded bg-white/5" />
        ),
      )}
    </div>
  )
}

export default function Hub({
  state,
  onPlay,
  onTransfers,
  onSquad,
}: {
  state: GameState
  onPlay: () => void
  onTransfers: () => void
  onSquad: () => void
}) {
  const fixture = passageForMatchday(state.matchday)
  const opp = opponentForMatchday(state.matchday)
  const strength = squadStrength(state.squad)
  const pos = positionOf(state.standings, PLAYER_TEAM_ID)
  const myForm = state.standings[PLAYER_TEAM_ID]?.form ?? []
  const oppForm = state.standings[opp.id]?.form ?? []
  const weak = Object.entries(state.weakWords).sort((a, b) => b[1] - a[1]).slice(0, 10)

  return (
    <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 animate-rise">
      {/* HERO BANNER */}
      <Panel className="relative mb-5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue/40 via-transparent to-gold/10" />
        <div className="sheen pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative flex flex-col items-center gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <Crest size={62} />
            <div>
              <h1 className="font-poster text-3xl leading-none tracking-tight text-cream sm:text-4xl">STAMFORD TYPE FC</h1>
              <p className="mt-1 font-condensed text-sm font-semibold uppercase tracking-[0.25em] text-blue-glow">
                The Blues · Spelling Premier League
              </p>
            </div>
          </div>
          <div className="flex items-stretch gap-3">
            <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-2 text-center">
              <div className="font-condensed text-[11px] uppercase tracking-widest text-white/45">Position</div>
              <div className={`font-poster text-3xl leading-none ${pos <= 3 ? 'text-ucl' : pos >= TEAMS.length ? 'text-bad' : 'text-cream'}`}>{ordinal(pos)}</div>
            </div>
            <div className="rounded-xl border border-gold/20 bg-black/30 px-5 py-2 text-center">
              <div className="font-condensed text-[11px] uppercase tracking-widest text-white/45">Transfer kitty</div>
              <div className="font-poster text-3xl leading-none text-gold-bright">£{state.budget}m</div>
            </div>
          </div>
        </div>
        {/* stat ribbon */}
        <div className="relative grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 sm:grid-cols-6">
          {[
            ['Played', state.played],
            ['Won', state.won],
            ['Drawn', state.drawn],
            ['Lost', state.lost],
            ['Squad OVR', strength || '—'],
            ['Best Acc', state.bestAccuracy ? `${state.bestAccuracy.toFixed(0)}%` : '—'],
          ].map(([label, val]) => (
            <div key={label as string} className="px-3 py-2.5 text-center">
              <div className="font-condensed text-[11px] uppercase tracking-widest text-white/40">{label}</div>
              <div className="font-poster text-xl text-cream">{val}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
        {/* LEFT: fixture + actions */}
        <div className="flex flex-col gap-5">
          <Panel className="relative overflow-hidden p-0" glow>
            <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-5 py-2.5">
              <span className="font-condensed text-sm font-bold uppercase tracking-widest text-white/50">Matchday {state.matchday}</span>
              <span className="font-condensed text-sm font-bold uppercase tracking-widest text-gold-bright">{'★'.repeat(fixture.difficulty)}{'☆'.repeat(3 - fixture.difficulty)}</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 py-5">
              <div className="flex flex-col items-center gap-2">
                <Crest size={50} />
                <span className="text-center font-condensed text-sm font-bold uppercase tracking-wide text-cream">Stamford</span>
                <MiniForm form={myForm} />
              </div>
              <div className="px-2 text-center">
                <div className="font-poster text-2xl text-white/30">VS</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <TeamCrest team={opp} size={50} />
                <span className="text-center font-condensed text-sm font-bold uppercase tracking-wide text-cream">{opp.short}</span>
                <MiniForm form={oppForm} />
              </div>
            </div>
            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-center font-condensed text-sm uppercase tracking-wider text-white/45">{opp.name} · {opp.nickname}</p>
              <div className="mt-1 text-center">
                <span className="font-serif text-[15px] italic text-cream/70">“{fixture.title}”</span>
                <span className="ml-1 text-xs text-white/40">— {fixture.topic}</span>
              </div>
              <Button onClick={onPlay} className="mt-4 w-full text-lg">▶ Kick off</Button>
              <p className="mt-2 text-center text-xs text-white/40">Type it clean, then proofread to win the points.</p>
            </div>
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            <Panel className="flex items-center justify-between p-4 transition hover:bg-white/[0.06]">
              <div>
                <h3 className="font-display font-extrabold">Squad</h3>
                <p className="text-xs text-white/45">{state.squad.length} signed</p>
              </div>
              <Button variant="ghost" onClick={onSquad} className="px-3 py-2 text-sm">View</Button>
            </Panel>
            <Panel className="flex items-center justify-between p-4 transition hover:bg-white/[0.06]">
              <div>
                <h3 className="font-display font-extrabold">Transfers</h3>
                <p className="text-xs text-white/45">£{state.budget}m to spend</p>
              </div>
              <Button variant="gold" onClick={onTransfers} className="px-3 py-2 text-sm">Open</Button>
            </Panel>
          </div>

          {/* Training ground */}
          <Panel className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <h3 className="font-display text-lg font-extrabold">Training ground</h3>
            </div>
            {weak.length === 0 ? (
              <p className="text-sm text-white/50">No weak words yet — play a match and the words that trip you up get logged here for drills.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {weak.map(([w, n]) => (
                  <span key={w} className="rounded-lg border border-bad/25 bg-bad/10 px-2.5 py-1 font-mono text-sm text-bad/90">
                    {w} <span className="text-bad/50">×{n}</span>
                  </span>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* RIGHT: league table + news */}
        <div className="flex flex-col gap-5">
          <Panel className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue/30 to-transparent px-4 py-3">
              <h2 className="font-poster text-xl tracking-tight text-cream">LEAGUE TABLE</h2>
              <span className="font-condensed text-xs font-bold uppercase tracking-widest text-white/45">After MD {Math.max(0, state.matchday - 1)}</span>
            </div>
            <LeagueTable state={state} />
          </Panel>

          <Panel className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">📰</span>
              <h3 className="font-display text-lg font-extrabold">Newsroom</h3>
            </div>
            <div className="flex flex-col gap-2">
              {state.news.slice(0, 6).map((item, i) => (
                <div
                  key={i}
                  className={`rounded-lg border-l-[3px] bg-white/[0.03] px-3 py-2 text-sm ${
                    item.tone === 'result' ? 'border-l-blue-bright' : item.tone === 'transfer' ? 'border-l-gold' : 'border-l-white/30'
                  }`}
                >
                  <span className="text-cream/85">{item.text}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  )
}
