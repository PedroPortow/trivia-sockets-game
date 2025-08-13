export interface Player {
  id: string,
  name: string,
  isReady?: boolean
}
export interface Room {
  id: string,
  name: string,
  players?: Player[]
}
