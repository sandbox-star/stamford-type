import type { ErrorKind, ScoreReport, TokenResult } from './types'

function tokenize(s: string): string[] {
  return s.trim().split(/\s+/).filter(Boolean)
}

function alnumLower(x: string): string {
  return x.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function classify(target: string, typed: string): ErrorKind | null {
  if (target === typed) return null
  if (alnumLower(target) === alnumLower(typed)) {
    // same letters ignoring case + punctuation
    if (target.toLowerCase() === typed.toLowerCase()) return 'capitalisation'
    return 'punctuation'
  }
  return 'spelling'
}

/** Needleman–Wunsch alignment of two token sequences. */
function align(target: string[], typed: string[]): TokenResult[] {
  const m = target.length
  const n = typed.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const sub = dp[i - 1][j - 1] + (target[i - 1] === typed[j - 1] ? 0 : 1)
      const del = dp[i - 1][j] + 1
      const ins = dp[i][j - 1] + 1
      dp[i][j] = Math.min(sub, del, ins)
    }
  }
  // backtrack, preferring diagonal on ties to keep words aligned
  const out: TokenResult[] = []
  let i = m
  let j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const sub = dp[i - 1][j - 1] + (target[i - 1] === typed[j - 1] ? 0 : 1)
      if (dp[i][j] === sub) {
        const t = target[i - 1]
        const y = typed[j - 1]
        const kind = classify(t, y)
        out.push({ target: t, typed: y, ok: kind === null, kind })
        i--; j--; continue
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      out.push({ target: target[i - 1], typed: null, ok: false, kind: 'missing' })
      i--; continue
    }
    out.push({ target: null, typed: typed[j - 1], ok: false, kind: 'extra' })
    j--
  }
  out.reverse()
  return out
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  let prev = new Array(n + 1)
  let curr = new Array(n + 1)
  for (let j = 0; j <= n; j++) prev[j] = j
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    ;[prev, curr] = [curr, prev]
  }
  return prev[n]
}

const EMPTY_KINDS: Record<ErrorKind, number> = {
  spelling: 0,
  capitalisation: 0,
  punctuation: 0,
  missing: 0,
  extra: 0,
}

export function score(targetText: string, typedText: string): ScoreReport {
  const target = tokenize(targetText)
  const typed = tokenize(typedText)
  const tokens = align(target, typed)

  const errorsByKind = { ...EMPTY_KINDS }
  let correctWords = 0
  for (const t of tokens) {
    if (t.ok) correctWords++
    else if (t.kind) errorsByKind[t.kind]++
  }
  const totalTargetWords = target.length
  const totalErrors = tokens.filter((t) => !t.ok).length
  const accuracy = totalTargetWords === 0 ? 100 : (correctWords / totalTargetWords) * 100

  const dist = levenshtein(targetText.trim(), typedText.trim())
  const charAccuracy = targetText.trim().length === 0
    ? 100
    : Math.max(0, (1 - dist / targetText.trim().length) * 100)

  return {
    tokens,
    totalTargetWords,
    correctWords,
    accuracy,
    charAccuracy,
    errorsByKind,
    totalErrors,
  }
}

/** Words the player got wrong (for the weak-word trainer). */
export function missedWords(report: ScoreReport): string[] {
  const words: string[] = []
  for (const t of report.tokens) {
    if (!t.ok && t.target) {
      const w = alnumLower(t.target)
      if (w.length > 1) words.push(w)
    }
  }
  return words
}
