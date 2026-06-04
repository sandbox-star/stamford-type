import { useState } from 'react'
import type { MatchOutcome } from './game/types'
import { applyMatch, buyPlayer, useGame } from './game/state'
import { passageForMatchday } from './data/passages'
import Hub from './components/Hub'
import Match, { type ResultMeta } from './components/Match'
import Results from './components/Results'
import Transfers from './components/Transfers'

type Screen = 'hub' | 'match' | 'results' | 'transfers'

export default function App() {
  const [state, setState] = useGame()
  const [screen, setScreen] = useState<Screen>('hub')
  const [result, setResult] = useState<{ outcome: MatchOutcome; meta: ResultMeta } | null>(null)

  function handleComplete(outcome: MatchOutcome, meta: ResultMeta) {
    setState((s) => applyMatch(s, outcome, meta.passage.id))
    setResult({ outcome, meta })
    setScreen('results')
  }

  return (
    <div className="min-h-full">
      {screen === 'hub' && (
        <Hub state={state} onPlay={() => setScreen('match')} onTransfers={() => setScreen('transfers')} />
      )}

      {screen === 'match' && (
        <Match
          passage={passageForMatchday(state.matchday)}
          onComplete={handleComplete}
          onQuit={() => setScreen('hub')}
        />
      )}

      {screen === 'results' && result && (
        <Results
          outcome={result.outcome}
          meta={result.meta}
          onContinue={() => setScreen('hub')}
          onTransfers={() => setScreen('transfers')}
        />
      )}

      {screen === 'transfers' && (
        <Transfers
          state={state}
          onBuy={(id, price) => setState((s) => buyPlayer(s, id, price))}
          onBack={() => setScreen('hub')}
        />
      )}
    </div>
  )
}
