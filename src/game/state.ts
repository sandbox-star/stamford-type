import { useEffect, useState } from 'react'
import type { GameState, MatchOutcome, NewsItem } from './types'
import { missedWords } from './scoring'
import {
  PLAYER_TEAM_ID,
  TEAMS_BY_ID,
  applyResult,
  initialStandings,
  opponentForMatchday,
  positionOf,
  simulateOtherFixtures,
} from '../data/league'
import { playerById } from '../data/players'

const KEY = 'stamford-type-save-v2'

export const INITIAL_STATE: GameState = {
  version: 2,
  managerName: 'Boss',
  budget: 25, // starting transfer kitty (£m)
  squad: [],
  matchday: 1,
  points: 0,
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  weakWords: {},
  bestAccuracy: 0,
  completedPassages: [],
  standings: initialStandings(),
  news: [
    { md: 1, tone: 'info', text: 'Welcome to Stamford Type FC. The board want promotion-winning accuracy — type clean, proofread harder, and climb the league.' },
  ],
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return INITIAL_STATE
    const parsed = JSON.parse(raw) as GameState
    if (parsed.version !== INITIAL_STATE.version) return INITIAL_STATE
    return { ...INITIAL_STATE, ...parsed }
  } catch {
    return INITIAL_STATE
  }
}

export function saveState(s: GameState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* storage full / disabled — ignore */
  }
}

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/** Apply a finished match to the save, then advance the rest of the league. */
export function applyMatch(
  state: GameState,
  outcome: MatchOutcome,
  passageId: string,
): GameState {
  const md = state.matchday
  const opp = opponentForMatchday(md)

  // record the player's club + the opponent (mirror), then simulate the rest
  let standings: GameState['standings'] = Object.fromEntries(
    Object.entries(state.standings).map(([k, v]) => [k, { ...v, form: [...v.form] }]),
  )
  applyResult(standings[PLAYER_TEAM_ID], outcome.goalsFor, outcome.goalsAgainst)
  applyResult(standings[opp.id], outcome.goalsAgainst, outcome.goalsFor)
  standings = simulateOtherFixtures(standings, md)

  const newPos = positionOf(standings, PLAYER_TEAM_ID)
  const verb = outcome.result === 'W' ? 'beat' : outcome.result === 'D' ? 'drew with' : 'lost to'
  const resultNews: NewsItem = {
    md,
    tone: 'result',
    text: `MD${md}: Stamford ${verb} ${opp.name} ${outcome.goalsFor}-${outcome.goalsAgainst}${
      outcome.motm ? ' — flawless display, clean sheet!' : ''
    } You sit ${ordinal(newPos)}.`,
  }

  const next: GameState = {
    ...state,
    budget: Math.round((state.budget + outcome.budgetEarned) * 10) / 10,
    matchday: md + 1,
    played: state.played + 1,
    won: state.won + (outcome.result === 'W' ? 1 : 0),
    drawn: state.drawn + (outcome.result === 'D' ? 1 : 0),
    lost: state.lost + (outcome.result === 'L' ? 1 : 0),
    points: state.points + (outcome.result === 'W' ? 3 : outcome.result === 'D' ? 1 : 0),
    goalsFor: state.goalsFor + outcome.goalsFor,
    goalsAgainst: state.goalsAgainst + outcome.goalsAgainst,
    bestAccuracy: Math.max(state.bestAccuracy, outcome.report.accuracy),
    weakWords: { ...state.weakWords },
    completedPassages: state.completedPassages.includes(passageId)
      ? state.completedPassages
      : [...state.completedPassages, passageId],
    standings,
    news: [resultNews, ...state.news].slice(0, 30),
  }
  for (const w of missedWords(outcome.report)) {
    next.weakWords[w] = (next.weakWords[w] ?? 0) + 1
  }
  return next
}

export function buyPlayer(state: GameState, playerId: string, price: number): GameState {
  if (state.squad.includes(playerId) || state.budget < price) return state
  const p = playerById(playerId)
  const news: NewsItem = {
    md: state.matchday,
    tone: 'transfer',
    text: `✍️ DONE DEAL: ${p?.name ?? 'New signing'} joins ${TEAMS_BY_ID[PLAYER_TEAM_ID].name} for £${price}m.`,
  }
  return {
    ...state,
    budget: Math.round((state.budget - price) * 10) / 10,
    squad: [...state.squad, playerId],
    news: [news, ...state.news].slice(0, 30),
  }
}

/** React hook: persisted game state. */
export function useGame() {
  const [state, setState] = useState<GameState>(loadState)
  useEffect(() => {
    saveState(state)
  }, [state])
  return [state, setState] as const
}
