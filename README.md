# Stamford Type ⚽️⌨️

A Chelsea / Football-Manager-themed typing & **proofreading** trainer. Built to fix one
specific problem: making spelling mistakes when typing under exam conditions (no autocorrect),
while doubling as AQA Politics (USA + comparative) revision.

## The idea

Every match is a typing challenge:

1. **Type phase** — retype an AQA-style politics passage. No autocorrect, no safety net.
2. **Proofread phase** — the passage is *hidden* (just like the exam) and you must find & fix
   your own mistakes. **Errors you catch yourself earn bonus budget** — this trains the exact
   skill that loses marks.
3. **Result** — accuracy (not speed) decides the scoreline and your transfer budget.
4. **Transfer market** — spend the budget signing players and building the squad.

Accuracy is scored exam-realistically: spelling, capitalisation and punctuation all count,
with a word-by-word corrections report. Words you keep missing are tracked on the
**Training ground** for future spaced-repetition drills.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5180 . Progress saves automatically in the browser (localStorage).

## Tech

React + TypeScript + Vite + Tailwind v4. Fully client-side — no backend, no accounts, private.

## Code map

- `src/game/scoring.ts` — word-alignment (Needleman–Wunsch) + error classification engine
- `src/game/outcome.ts` — accuracy → scoreline → transfer budget, rewards self-caught errors
- `src/game/state.ts` — persistent save (localStorage)
- `src/data/passages.ts` — AQA US/comparative politics passages
- `src/data/players.ts` — transfer market
- `src/components/` — Hub, Match (type + proofread), Results, Transfers

## Next up (post-slice ideas)

- Dedicated **Training ground** drills on weak words (spaced repetition)
- Season/league table, opponents, cup runs, trophies
- More passages + difficulty curve; "dictation" mode (audio → type) for harder challenge
- Squad screen / formation; player ratings affect match flavour
- Streaks, daily targets, and an end-of-summer progress report
