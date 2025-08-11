import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type PlayerContextValue = {
  name: string
  setName: (name: string) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const PlayerContext = createContext<PlayerContextValue | undefined>(undefined)

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<string>("")

  useEffect(() => {
    const stored = localStorage.getItem('name')
    
    if (stored) setName(stored)
  }, [])

  const _setName = (value: string) => {
    setName(value)
    localStorage.setItem('name', value)
  }

  const value = useMemo(() => ({ name, setName: _setName }), [name])

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}



