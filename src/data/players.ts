import type { Player } from '../game/types'

/** Transfer-market targets. Chelsea-flavoured squad to collect. */
export const TRANSFER_MARKET: Player[] = [
  { id: 'p-gk-1', name: 'R. Sánchez', pos: 'GK', rating: 82, price: 18, nation: 'ESP' },
  { id: 'p-gk-2', name: 'F. Jörgensen', pos: 'GK', rating: 79, price: 12, nation: 'DEN' },
  { id: 'p-def-1', name: 'L. Colwill', pos: 'DEF', rating: 83, price: 45, nation: 'ENG' },
  { id: 'p-def-2', name: 'W. Fofana', pos: 'DEF', rating: 84, price: 50, nation: 'FRA' },
  { id: 'p-def-3', name: 'M. Cucurella', pos: 'DEF', rating: 83, price: 40, nation: 'ESP' },
  { id: 'p-def-4', name: 'R. James', pos: 'DEF', rating: 86, price: 65, nation: 'ENG' },
  { id: 'p-mid-1', name: 'E. Fernández', pos: 'MID', rating: 85, price: 75, nation: 'ARG' },
  { id: 'p-mid-2', name: 'M. Caicedo', pos: 'MID', rating: 86, price: 80, nation: 'ECU' },
  { id: 'p-mid-3', name: 'C. Palmer', pos: 'MID', rating: 89, price: 120, nation: 'ENG' },
  { id: 'p-mid-4', name: 'R. Lavia', pos: 'MID', rating: 81, price: 38, nation: 'BEL' },
  { id: 'p-fwd-1', name: 'N. Jackson', pos: 'FWD', rating: 81, price: 42, nation: 'SEN' },
  { id: 'p-fwd-2', name: 'C. Nkunku', pos: 'FWD', rating: 85, price: 70, nation: 'FRA' },
  { id: 'p-fwd-3', name: 'P. Neto', pos: 'FWD', rating: 83, price: 55, nation: 'POR' },
  { id: 'p-fwd-4', name: 'J. Madueke', pos: 'FWD', rating: 80, price: 35, nation: 'ENG' },
]

export function playerById(id: string): Player | undefined {
  return TRANSFER_MARKET.find((p) => p.id === id)
}

/** Squad strength = average rating of owned players (0 if none). */
export function squadStrength(squad: string[]): number {
  if (squad.length === 0) return 0
  const total = squad.reduce((sum, id) => sum + (playerById(id)?.rating ?? 0), 0)
  return Math.round(total / squad.length)
}
