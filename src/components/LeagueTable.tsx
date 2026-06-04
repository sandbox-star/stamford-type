import type { GameState } from '../game/types'
import { buildTable, PLAYER_TEAM_ID, TEAMS } from '../data/league'
import { TeamCrest } from './TeamCrest'

const formDot = (r: string) =>
  r === 'W' ? 'bg-good' : r === 'D' ? 'bg-warn' : 'bg-bad'

function FormGuide({ form }: { form: string[] }) {
  const padded = [...Array(Math.max(0, 5 - form.length)).fill(''), ...form].slice(-5)
  return (
    <div className="flex items-center justify-end gap-1">
      {padded.map((r, i) =>
        r ? (
          <span
            key={i}
            title={r}
            className={`grid h-4 w-4 place-items-center rounded-[3px] text-[9px] font-bold text-black/80 ${formDot(r)}`}
          >
            {r}
          </span>
        ) : (
          <span key={i} className="h-4 w-4 rounded-[3px] bg-white/5" />
        ),
      )}
    </div>
  )
}

export default function LeagueTable({
  state,
  highlightTeam = PLAYER_TEAM_ID,
  showForm = true,
  maxRows,
}: {
  state: GameState
  highlightTeam?: string
  showForm?: boolean
  maxRows?: number
}) {
  const table = buildTable(state.standings)
  const rows = maxRows ? table.slice(0, maxRows) : table
  const n = TEAMS.length

  return (
    <div className="overflow-hidden">
      {/* header */}
      <div className="grid grid-cols-[2rem_1fr_repeat(5,1.5rem)_auto] items-center gap-x-2 border-b border-white/10 px-3 py-2 font-condensed text-[12px] font-bold uppercase tracking-wider text-white/40">
        <span className="text-center">#</span>
        <span>Club</span>
        <span className="text-center">P</span>
        <span className="text-center">W</span>
        <span className="text-center">D</span>
        <span className="text-center">L</span>
        <span className="text-center text-white/60">Pts</span>
        {showForm && <span className="text-right">Form</span>}
        {!showForm && <span />}
      </div>

      <div>
        {rows.map((row) => {
          const isPlayer = row.team.id === highlightTeam
          const zone =
            row.pos <= 3
              ? 'border-l-ucl'
              : row.pos === n
                ? 'border-l-bad'
                : 'border-l-transparent'
          return (
            <div
              key={row.team.id}
              className={`grid grid-cols-[2rem_1fr_repeat(5,1.5rem)_auto] items-center gap-x-2 border-l-[3px] px-3 py-2 transition ${zone} ${
                isPlayer
                  ? 'bg-blue-bright/15 ring-1 ring-inset ring-blue-bright/30'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              <span className={`text-center font-condensed text-lg font-bold tabular-nums ${row.pos <= 3 ? 'text-ucl' : row.pos === n ? 'text-bad' : 'text-white/55'}`}>
                {row.pos}
              </span>
              <div className="flex min-w-0 items-center gap-2.5">
                <TeamCrest team={row.team} size={22} />
                <span className={`truncate font-display font-bold ${isPlayer ? 'text-cream' : 'text-white/85'}`}>
                  {row.team.name}
                  {isPlayer && <span className="ml-2 align-middle text-[10px] font-black uppercase tracking-widest text-blue-glow">YOU</span>}
                </span>
              </div>
              <span className="text-center font-mono text-sm tabular-nums text-white/55">{row.rec.p}</span>
              <span className="text-center font-mono text-sm tabular-nums text-white/75">{row.rec.w}</span>
              <span className="text-center font-mono text-sm tabular-nums text-white/55">{row.rec.d}</span>
              <span className="text-center font-mono text-sm tabular-nums text-white/55">{row.rec.l}</span>
              <span className="text-center font-condensed text-lg font-extrabold tabular-nums text-gold-bright">{row.pts}</span>
              {showForm ? <FormGuide form={row.rec.form} /> : <span />}
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 px-3 py-2 text-[10px] uppercase tracking-wider text-white/35">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-1 rounded-sm bg-ucl" /> Europe</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-1 rounded-sm bg-bad" /> Relegation</span>
      </div>
    </div>
  )
}
