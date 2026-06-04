import { useEffect, useMemo, useRef, useState } from 'react'
import type { MatchOutcome, Passage } from '../game/types'
import { score } from '../game/scoring'
import { computeOutcome } from '../game/outcome'
import { Button, Panel, Tag } from './ui'

export interface ResultMeta {
  wpm: number
  seconds: number
  passage: Passage
  finalText: string
}

const noAutocorrect = {
  spellCheck: false,
  autoCorrect: 'off',
  autoCapitalize: 'off',
  autoComplete: 'off',
} as const

function fmtTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export default function Match({
  passage,
  onComplete,
  onQuit,
}: {
  passage: Passage
  onComplete: (outcome: MatchOutcome, meta: ResultMeta) => void
  onQuit: () => void
}) {
  const [phase, setPhase] = useState<'type' | 'proofread'>('type')
  const [typed, setTyped] = useState('')
  const [draft, setDraft] = useState('')
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [typingSeconds, setTypingSeconds] = useState(0)
  const errorsAfterTypingRef = useRef(0)
  const areaRef = useRef<HTMLTextAreaElement>(null)

  // tick the timer during the type phase
  useEffect(() => {
    if (phase !== 'type' || startedAt === null) return
    const id = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 200)
    return () => clearInterval(id)
  }, [phase, startedAt])

  useEffect(() => {
    areaRef.current?.focus()
  }, [phase])

  const targetWords = useMemo(() => passage.text.trim().split(/\s+/).length, [passage])
  const typedWords = typed.trim() ? typed.trim().split(/\s+/).length : 0

  function handleType(v: string) {
    if (startedAt === null && v.length > 0) setStartedAt(Date.now())
    setTyped(v)
  }

  function submitTyping() {
    const secs = startedAt ? (Date.now() - startedAt) / 1000 : 0
    setTypingSeconds(secs)
    const report = score(passage.text, typed)
    errorsAfterTypingRef.current = report.totalErrors
    setDraft(typed)
    setPhase('proofread')
  }

  function submitFinal() {
    const finalReport = score(passage.text, draft)
    const outcome = computeOutcome(finalReport, errorsAfterTypingRef.current)
    const minutes = Math.max(typingSeconds / 60, 1 / 60)
    const wpm = Math.round(typedWords / minutes)
    onComplete(outcome, { wpm, seconds: typingSeconds, passage, finalText: draft })
  }

  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-8 animate-rise">
      <div className="mb-5 flex items-center justify-between">
        <button onClick={onQuit} className="text-sm text-white/50 hover:text-white/80 transition">
          ← Abandon match
        </button>
        <div className="flex items-center gap-3">
          <Tag tone="muted">{passage.topic}</Tag>
          <Tag tone={phase === 'type' ? 'blue' : 'gold'}>
            {phase === 'type' ? 'Match in play' : 'Proofreading'}
          </Tag>
        </div>
      </div>

      {phase === 'type' ? (
        <>
          <Panel className="p-6 md:p-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl font-extrabold tracking-tight">{passage.title}</h2>
              <span className="font-mono text-lg tabular-nums text-blue-glow">{fmtTime(elapsed)}</span>
            </div>
            <p className="font-serif text-[19px] leading-[1.8] text-cream/90 selection:bg-blue-bright/40">
              {passage.text}
            </p>
          </Panel>

          <div className="mt-4">
            <textarea
              ref={areaRef}
              {...noAutocorrect}
              value={typed}
              onChange={(e) => handleType(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              placeholder="Type the passage exactly. No autocorrect — every letter is on you."
              className="h-52 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-[17px] leading-relaxed text-cream outline-none transition focus:border-blue-bright/50 focus:bg-black/40"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-white/45 tabular-nums">
                {typedWords} / {targetWords} words
              </span>
              <Button onClick={submitTyping} disabled={typedWords < Math.max(3, targetWords * 0.5)}>
                Finish & proofread →
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Panel className="border-gold/20 p-6 md:p-8" glow>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl">🔎</span>
              <h2 className="font-display text-2xl font-extrabold tracking-tight">Proofread your team sheet</h2>
            </div>
            <p className="text-[15px] leading-relaxed text-white/65">
              The passage is now <span className="text-gold-bright font-semibold">hidden</span> — just like the exam.
              Read your own writing slowly and fix every spelling, capitalisation and punctuation slip you can find.
              <span className="text-cream"> Errors you catch yourself earn bonus budget.</span>
            </p>
          </Panel>

          <div className="mt-4">
            <textarea
              ref={areaRef}
              {...noAutocorrect}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              className="h-60 w-full resize-none rounded-2xl border border-gold/20 bg-black/30 p-5 text-[17px] leading-relaxed text-cream outline-none transition focus:border-gold/50 focus:bg-black/40"
            />
            <div className="mt-3 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setPhase('type')}>← Back</Button>
              <Button variant="gold" onClick={submitFinal}>Submit final answer ✓</Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
