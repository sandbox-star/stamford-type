import type { MatchOutcome, ScoreReport } from './types'

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n))
const round1 = (n: number) => Math.round(n * 10) / 10

/**
 * Turn a proofread-final score into a match result + transfer budget.
 * Accuracy (not speed) drives everything. Self-caught errors ("saves")
 * are explicitly rewarded — that's the proofreading habit we're training.
 */
export function computeOutcome(
  finalReport: ScoreReport,
  errorsAfterTyping: number,
): MatchOutcome {
  const acc = finalReport.accuracy
  const finalErrors = finalReport.totalErrors
  const saves = Math.max(0, errorsAfterTyping - finalErrors)

  const goalsFor = clamp(Math.round((acc - 84) / 3), 0, 6)
  const goalsAgainst = clamp(Math.round(finalErrors / 2), 0, 6)

  const result: MatchOutcome['result'] =
    goalsFor > goalsAgainst ? 'W' : goalsFor === goalsAgainst ? 'D' : 'L'

  const motm = result !== 'L' && finalErrors === 0

  const base = 2.0
  const accBonus = Math.max(0, acc - 85) * 0.4
  const winBonus = result === 'W' ? 4 : result === 'D' ? 1.5 : 0
  const saveBonus = saves * 0.5
  const motmBonus = motm ? 3 : 0
  const budgetEarned = round1(base + accBonus + winBonus + saveBonus + motmBonus)

  return {
    report: finalReport,
    saves,
    missed: finalErrors,
    goalsFor,
    goalsAgainst,
    result,
    budgetEarned,
    motm,
  }
}
