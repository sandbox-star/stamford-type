import { useState } from 'react'
import type { MatchOutcome } from './game/types'
import { applyMatch, buyPlayer, useGame } from './game/state'
import { passageForMatchday } from './data/passages'
import { PLAYER_TEAM_ID, opponentForMatchday, positionOf } from './data/league'
import Hub from './components/Hub'
import Match, { type ResultMeta } from './components/Match'
import Results from './components/Results'
import Transfers from './components/Transfers'
import Squad from './components/Squad'

type Screen = 'hub' | 'match' | 'results' | 'transfers' | 'squad'

export default function App() {
  const [state, setState] = useGame()
  const [screen, setScreen] = useState<Screen>('hub')
  const [result, setResult] = useState<{ outcome: MatchOutcome; meta: ResultMeta; position: number } | null>(null)

  function handleComplete(outcome: MatchOutcome, meta: ResultMeta) {
    const nextState = applyMatch(state, outcome, meta.passage.id)
    setState(nextState)
    setResult({ outcome, meta, position: positionOf(nextState.standings, PLAYER_TEAM_ID) })
    setScreen('results')
  }

  return (
    <div className="min-h-full">
      {screen === 'hub' && (
        <Hub
          state={state}
          onPlay={() => setScreen('match')}
          onTransfers={() => setScreen('transfers')}
          onSquad={() => setScreen('squad')}
        />
      )}

      {screen === 'match' && (
        <Match
          passage={passageForMatchday(state.matchday)}
          opponent={opponentForMatchday(state.matchday)}
          onComplete={handleComplete}
          onQuit={() => setScreen('hub')}
        />
      )}

      {screen === 'results' && result && (
        <Results
          outcome={result.outcome}
          meta={result.meta}
          opponent={result.meta.opponent}
          position={result.position}
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

      {screen === 'squad' && (
        <Squad state={state} onBack={() => setScreen('hub')} onTransfers={() => setScreen('transfers')} />
      )}
    </div>
  )
}
