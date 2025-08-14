export interface Player {
  id: string,
  name: string,
  ready?: boolean
}

export interface Question {
  id: number,
  question: string,
  answers: Answer[]
}

export interface Answer {
  id: number,
  name: string,
  correct: boolean
}
export interface Room {
  id: string,
  name: string,
  players?: Player[],
  questions?: Question[],
  player_scores?: Record<string, number>,
  game_started?: boolean
}
