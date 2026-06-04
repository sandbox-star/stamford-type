export type ErrorKind =
  | 'spelling'
  | 'capitalisation'
  | 'punctuation'
  | 'missing'
  | 'extra'

export interface TokenResult {
  target: string | null   // null = extra word typed
  typed: string | null    // null = word missing
  ok: boolean
  kind: ErrorKind | null  // null when ok
}

export interface ScoreReport {
  tokens: TokenResult[]
  totalTargetWords: number
  correctWords: number
  accuracy: number          // 0..100, word-level
  charAccuracy: number      // 0..100, char-level
  errorsByKind: Record<ErrorKind, number>
  totalErrors: number
}

export interface MatchOutcome {
  report: ScoreReport
  saves: number             // errors present after typing, fixed during proofread
  missed: number            // errors that survived proofread
  goalsFor: number
  goalsAgainst: number
  result: 'W' | 'D' | 'L'
  budgetEarned: number      // in £m, one decimal
  motm: boolean             // man of the match (clean sheet-ish)
}

export interface Player {
  id: string
  name: string
  pos: 'GK' | 'DEF' | 'MID' | 'FWD'
  rating: number            // 0..99
  price: number             // £m
  nation: string
}

export interface Passage {
  id: string
  title: string
  topic: string             // e.g. "US Government", "Comparative Politics"
  difficulty: 1 | 2 | 3
  text: string
}

export interface GameState {
  version: number
  managerName: string
  budget: number            // £m
  squad: string[]           // player ids owned
  matchday: number
  points: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  weakWords: Record<string, number>   // lowercased word -> times missed
  bestAccuracy: number
  completedPassages: string[]
}
