import { useEffect, useState } from 'react'
import type { GameState, MatchOutcome } from './types'
import { missedWords } from './scoring'

const KEY = 'stamford-type-save-v1'

export const INITIAL_STATE: GameState = {
  version: 1,
  managerName: 'Manager',
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

/** Apply a finished match to the save. */
export function applyMatch(
  state: GameState,
  outcome: MatchOutcome,
  passageId: string,
): GameState {
  const next: GameState = {
    ...state,
    budget: Math.round((state.budget + outcome.budgetEarned) * 10) / 10,
    matchday: state.matchday + 1,
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
  }
  for (const w of missedWords(outcome.report)) {
    next.weakWords[w] = (next.weakWords[w] ?? 0) + 1
  }
  return next
}

export function buyPlayer(state: GameState, playerId: string, price: number): GameState {
  if (state.squad.includes(playerId) || state.budget < price) return state
  return {
    ...state,
    budget: Math.round((state.budget - price) * 10) / 10,
    squad: [...state.squad, playerId],
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
