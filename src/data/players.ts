import type { Player } from '../game/types'

/**
 * STARTING SQUAD — the current Chelsea first team, owned from day one.
 * £25m alone could never build this, so the club begins fully staffed and
 * the transfer market becomes about chasing upgrades and superstars.
 */
export const STARTING_SQUAD: Player[] = [
  // Goalkeepers
  { id: 'cfc-sanchez', name: 'R. Sánchez', pos: 'GK', rating: 82, price: 18, nation: 'ESP' },
  { id: 'cfc-jorgensen', name: 'F. Jörgensen', pos: 'GK', rating: 79, price: 12, nation: 'DEN' },
  // Defenders
  { id: 'cfc-james', name: 'R. James (C)', pos: 'DEF', rating: 86, price: 65, nation: 'ENG' },
  { id: 'cfc-colwill', name: 'L. Colwill', pos: 'DEF', rating: 83, price: 45, nation: 'ENG' },
  { id: 'cfc-fofana', name: 'W. Fofana', pos: 'DEF', rating: 84, price: 50, nation: 'FRA' },
  { id: 'cfc-cucurella', name: 'M. Cucurella', pos: 'DEF', rating: 83, price: 40, nation: 'ESP' },
  { id: 'cfc-gusto', name: 'M. Gusto', pos: 'DEF', rating: 81, price: 38, nation: 'FRA' },
  { id: 'cfc-tosin', name: 'Tosin', pos: 'DEF', rating: 80, price: 30, nation: 'ENG' },
  { id: 'cfc-badiashile', name: 'B. Badiashile', pos: 'DEF', rating: 79, price: 28, nation: 'FRA' },
  { id: 'cfc-acheampong', name: 'J. Acheampong', pos: 'DEF', rating: 72, price: 14, nation: 'ENG' },
  // Midfielders
  { id: 'cfc-palmer', name: 'C. Palmer', pos: 'MID', rating: 89, price: 130, nation: 'ENG' },
  { id: 'cfc-caicedo', name: 'M. Caicedo', pos: 'MID', rating: 86, price: 85, nation: 'ECU' },
  { id: 'cfc-enzo', name: 'E. Fernández', pos: 'MID', rating: 85, price: 80, nation: 'ARG' },
  { id: 'cfc-lavia', name: 'R. Lavia', pos: 'MID', rating: 81, price: 38, nation: 'BEL' },
  { id: 'cfc-santos', name: 'A. Santos', pos: 'MID', rating: 77, price: 26, nation: 'BRA' },
  // Forwards
  { id: 'cfc-neto', name: 'P. Neto', pos: 'FWD', rating: 83, price: 55, nation: 'POR' },
  { id: 'cfc-joaopedro', name: 'João Pedro', pos: 'FWD', rating: 82, price: 50, nation: 'BRA' },
  { id: 'cfc-nkunku', name: 'C. Nkunku', pos: 'FWD', rating: 85, price: 65, nation: 'FRA' },
  { id: 'cfc-jackson', name: 'N. Jackson', pos: 'FWD', rating: 81, price: 42, nation: 'SEN' },
  { id: 'cfc-madueke', name: 'N. Madueke', pos: 'FWD', rating: 80, price: 35, nation: 'ENG' },
  { id: 'cfc-estevao', name: 'Estêvão', pos: 'FWD', rating: 78, price: 34, nation: 'BRA' },
]

/**
 * TRANSFER MARKET — elite targets to chase with the budget you earn by typing
 * cleanly. A couple of affordable wonderkids for an early hit; the galácticos
 * are something to save towards across a season.
 */
export const TRANSFER_MARKET: Player[] = [
  // affordable risers (early signings)
  { id: 'mk-doue', name: 'D. Doué', pos: 'MID', rating: 82, price: 22, nation: 'FRA' },
  { id: 'mk-mainoo', name: 'K. Mainoo', pos: 'MID', rating: 81, price: 24, nation: 'ENG' },
  { id: 'mk-guiu', name: 'M. Guiu', pos: 'FWD', rating: 78, price: 16, nation: 'ESP' },
  { id: 'mk-neves', name: 'J. Neves', pos: 'MID', rating: 84, price: 70, nation: 'POR' },
  { id: 'mk-donnarumma', name: 'G. Donnarumma', pos: 'GK', rating: 88, price: 60, nation: 'ITA' },
  // superstars (save up)
  { id: 'mk-isak', name: 'A. Isak', pos: 'FWD', rating: 87, price: 110, nation: 'SWE' },
  { id: 'mk-pedri', name: 'Pedri', pos: 'MID', rating: 87, price: 100, nation: 'ESP' },
  { id: 'mk-saka', name: 'B. Saka', pos: 'FWD', rating: 88, price: 130, nation: 'ENG' },
  { id: 'mk-wirtz', name: 'F. Wirtz', pos: 'MID', rating: 89, price: 140, nation: 'GER' },
  { id: 'mk-rodri', name: 'Rodri', pos: 'MID', rating: 90, price: 130, nation: 'ESP' },
  { id: 'mk-yamal', name: 'L. Yamal', pos: 'FWD', rating: 89, price: 160, nation: 'ESP' },
  { id: 'mk-vinicius', name: 'Vinícius Jr', pos: 'FWD', rating: 90, price: 170, nation: 'BRA' },
  { id: 'mk-bellingham', name: 'J. Bellingham', pos: 'MID', rating: 90, price: 180, nation: 'ENG' },
  { id: 'mk-haaland', name: 'E. Haaland', pos: 'FWD', rating: 91, price: 180, nation: 'NOR' },
  { id: 'mk-mbappe', name: 'K. Mbappé', pos: 'FWD', rating: 91, price: 190, nation: 'FRA' },
]

/** Every player the game knows about (squad + market). */
export const ALL_PLAYERS: Player[] = [...STARTING_SQUAD, ...TRANSFER_MARKET]

export const STARTING_SQUAD_IDS: string[] = STARTING_SQUAD.map((p) => p.id)

export function playerById(id: string): Player | undefined {
  return ALL_PLAYERS.find((p) => p.id === id)
}

/** Squad strength = average rating of the best 11 owned players. */
export function squadStrength(squad: string[]): number {
  if (squad.length === 0) return 0
  const ratings = squad
    .map((id) => playerById(id)?.rating ?? 0)
    .sort((a, b) => b - a)
    .slice(0, 11)
  const total = ratings.reduce((sum, r) => sum + r, 0)
  return Math.round(total / ratings.length)
}
