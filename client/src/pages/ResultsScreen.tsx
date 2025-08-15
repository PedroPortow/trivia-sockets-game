import { Button } from "@/components/ui/button"
import { usePlayer } from "@/hooks"
import websocketService from "@/services/WebSocketService"
import type { Player } from "@/types"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

function ResultsScreen() {
  const { currentRoom } = usePlayer()
  const [results, setResults] = useState<Record<string, number>>({})
  const navigate = useNavigate()
  const { sortedPlayersWithScores, winnerPlayerId } = useMemo(() => {
    if (!results || Object.keys(results).length === 0) return { sortedPlayersWithScores: [], winnerPlayerId: null }
    
    const sortedPlayersWithScores = currentRoom?.players
      .map((player: Player) => ({
        ...player,
        score: results[player.id] || 0
      }))
      .sort((a, b) => b.score - a.score)

    const winnerPlayerId = sortedPlayersWithScores.length > 0 ? sortedPlayersWithScores[0].id : null

    return { sortedPlayersWithScores, winnerPlayerId }
  }, [currentRoom?.players, results])

  useEffect(() => {
    const socket = websocketService.getSocket()

    socket?.send(JSON.stringify({ type: 'GET_RESULTS', room_id: currentRoom.id }))

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data)

      if (message.type === 'GET_RESULTS_SUCCESS') {
        setResults(message.results)
      }
    }

    socket?.addEventListener('message', handleMessage)

    return () => socket?.removeEventListener('message', handleMessage)
  }, [currentRoom])

  const handleGameFinished = () => {
    websocketService.send(JSON.stringify({ type: 'GAME_FINISHED', room_id: currentRoom.id }))
    navigate('/rooms')
  }

  return (
    <div className="min-h-dvh pt-16 items-center justify-center flex flex-col gap-16">
      <h1 className="text-2xl font-semibold">Resultados</h1>
      <div className="space-y-4 mt-4 w-full max-w-md">
        {sortedPlayersWithScores.map((player, index) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between gap-4 p-4 rounded-lg border ${
              winnerPlayerId === player.id ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center bg-yellow-500 text-white`}>
                {index + 1}
              </span>
              <h2 className={`text-lg font-semibold ${winnerPlayerId === player.id ? 'text-green-600' : ''}`}>
                {player.name}
                {winnerPlayerId === player.id && <span className="text-green-500 ml-2">🎉</span>}
              </h2>
            </div>
            <p className="text-lg font-bold">{player.score} pts</p>
          </div>
        ))}
      </div>
      <Button onClick={handleGameFinished}>
        Voltar pro lobby
      </Button>
    </div>
  )
}

export default ResultsScreen
