import type { Team, TeamRecord } from '../game/types'

/**
 * The Spelling Premier League — ten politics-themed clubs.
 * Stamford Type FC (the player) sits in the middle of the pack and must
 * climb the table through accurate typing.
 */
export const PLAYER_TEAM_ID = 'sta'

export const TEAMS: Team[] = [
  { id: 'sta', name: 'Stamford Type FC', short: 'STA', nickname: 'The Blues', primary: '#1d6fe0', secondary: '#0a2a52', strength: 78 },
  { id: 'cap', name: 'Capitol United', short: 'CAP', nickname: 'The Eagles', primary: '#e23744', secondary: '#3a0c10', strength: 86 },
  { id: 'fed', name: 'Federalist FC', short: 'FED', nickname: 'The Founders', primary: '#3f7fe0', secondary: '#0c1f44', strength: 84 },
  { id: 'wes', name: 'Westminster Wanderers', short: 'WES', nickname: 'The Whips', primary: '#9b59d0', secondary: '#2a1340', strength: 82 },
  { id: 'sov', name: 'Sovereign Spurs', short: 'SOV', nickname: 'The Crown', primary: '#f2c14e', secondary: '#3a2c08', strength: 80 },
  { id: 'con', name: 'Congress City', short: 'CON', nickname: 'The Hill', primary: '#2bb39a', secondary: '#0a312a', strength: 77 },
  { id: 'sen', name: 'Senate Rovers', short: 'SEN', nickname: 'The Chamber', primary: '#8fa3b3', secondary: '#1c2730', strength: 75 },
  { id: 'whi', name: 'Whitehall Athletic', short: 'WHI', nickname: 'The Mandarins', primary: '#c0392b', secondary: '#350f0a', strength: 73 },
  { id: 'ele', name: 'Electoral Town', short: 'ELE', nickname: 'The Voters', primary: '#ef8c2b', secondary: '#3a2206', strength: 70 },
  { id: 'fil', name: 'Filibuster FC', short: 'FIL', nickname: 'The Stallers', primary: '#46b04a', secondary: '#0c2e0e', strength: 68 },
]

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(TEAMS.map((t) => [t.id, t]))

export function emptyRecord(): TeamRecord {
  return { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, form: [] }
}

export function initialStandings(): Record<string, TeamRecord> {
  return Object.fromEntries(TEAMS.map((t) => [t.id, emptyRecord()]))
}

/* ---- deterministic RNG so the league is stable across reloads ---- */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Circle-method round robin. Team index 0 (the player) is fixed; the rest
 * rotate. Round r (0-based) returns the 5 pairings for that matchday.
 */
function roundPairings(round: number): Array<[number, number]> {
  const n = TEAMS.length
  const rest = Array.from({ length: n - 1 }, (_, i) => i + 1)
  const r = round % (n - 1)
  const rotated = [...rest.slice(rest.length - r), ...rest.slice(0, rest.length - r)]
  const arr = [0, ...rotated]
  const pairs: Array<[number, number]> = []
  for (let i = 0; i < n / 2; i++) pairs.push([arr[i], arr[n - 1 - i]])
  return pairs
}

export function opponentForMatchday(matchday: number): Team {
  const pairs = roundPairings(matchday - 1)
  // pairs[0] always contains the player (index 0)
  const [a, b] = pairs[0]
  const oppIndex = a === 0 ? b : a
  return TEAMS[oppIndex]
}

function sampleGoals(lambda: number, rng: () => number): number {
  const noise = (rng() + rng() + rng() - 1.5) * 1.2
  return Math.max(0, Math.min(6, Math.round(lambda + noise)))
}

function simulate(a: number, b: number, seed: number): [number, number] {
  const rng = mulberry32(seed)
  const sa = TEAMS[a].strength
  const sb = TEAMS[b].strength
  const ga = sampleGoals(1.35 + (sa - sb) / 28, rng)
  const gb = sampleGoals(1.35 + (sb - sa) / 28, rng)
  return [ga, gb]
}

export function applyResult(rec: TeamRecord, scored: number, conceded: number) {
  rec.p += 1
  rec.gf += scored
  rec.ga += conceded
  const r = scored > conceded ? 'W' : scored === conceded ? 'D' : 'L'
  if (r === 'W') rec.w += 1
  else if (r === 'D') rec.d += 1
  else rec.l += 1
  rec.form = [...rec.form, r].slice(-5)
}

/**
 * Advance the *rest* of the league for a given matchday (the player's own
 * fixture is applied separately from their typing result). Mutates a copy.
 */
export function simulateOtherFixtures(
  standings: Record<string, TeamRecord>,
  matchday: number,
): Record<string, TeamRecord> {
  const next: Record<string, TeamRecord> = Object.fromEntries(
    Object.entries(standings).map(([k, v]) => [k, { ...v, form: [...v.form] }]),
  )
  const pairs = roundPairings(matchday - 1)
  pairs.slice(1).forEach(([a, b], i) => {
    const [ga, gb] = simulate(a, b, matchday * 7919 + i * 104729)
    applyResult(next[TEAMS[a].id], ga, gb)
    applyResult(next[TEAMS[b].id], gb, ga)
  })
  return next
}

export interface TableRow {
  pos: number
  team: Team
  rec: TeamRecord
  gd: number
  pts: number
}

export function buildTable(standings: Record<string, TeamRecord>): TableRow[] {
  return TEAMS.map((team) => {
    const rec = standings[team.id] ?? emptyRecord()
    return { team, rec, gd: rec.gf - rec.ga, pts: rec.w * 3 + rec.d }
  })
    .sort(
      (x, y) =>
        y.pts - x.pts ||
        y.gd - x.gd ||
        y.rec.gf - x.rec.gf ||
        x.team.name.localeCompare(y.team.name),
    )
    .map((row, i) => ({ ...row, pos: i + 1 }))
}

export function positionOf(standings: Record<string, TeamRecord>, teamId: string): number {
  return buildTable(standings).find((r) => r.team.id === teamId)?.pos ?? TEAMS.length
}
