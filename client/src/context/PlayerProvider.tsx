import type { Player, Room } from '@/types'
import { createContext, useMemo, useState, type ReactNode } from 'react'

export type PlayerContextValue = {
  player: Player | null
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>
  currentRoom: Room | null
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room | null>>
}

// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null)
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null)

  const value = useMemo(() => ({ player, setPlayer, currentRoom, setCurrentRoom }), [player, currentRoom])

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}



