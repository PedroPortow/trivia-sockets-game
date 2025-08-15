import LobbyPlayerCard from "@/components/LobbyPlayerCard"
import { usePlayer } from "@/hooks"
import websocketService from "@/services/WebSocketService"
import type { Player } from "@/types"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function RoomLobbyScreen () {
  // @ts-expect-error - TODO: arrumar essa bosta
  const { player, currentRoom, setPlayer, setCurrentRoom } = usePlayer()
  const [connectedPlayers, setConnectedPlayers] = useState<Player[]>(currentRoom?.players.filter((p: Player) => p.id !== player.id) ?? [])
  const navigate = useNavigate()

  useEffect(() => {
    const socket = websocketService.getSocket()

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data)

      if (message.type === 'START_GAME_SUCCESS') {
        // aqui já traz as perguntas...
        setCurrentRoom(message.room)
        navigate(`/rooms/${message.room.id}/game`)
      }

      if (message.type === 'ROOM_STATUS_UPDATED') {
        if (message.room.game_started) {
          socket?.send(JSON.stringify({ type: 'START_GAME', room_id: currentRoom.id }))
        }

        console.log(message)

        const currentPlayer = message.room.players.find((p: Player) => p.id === player.id)
        const otherPlayers = message.room.players.filter((p: Player) => p.id !== player.id)

        console.log({otherPlayers})

        setPlayer({ ...player, ready: currentPlayer.ready })
        setConnectedPlayers(otherPlayers)
      }
    }

    socket?.addEventListener('message', handleMessage)

    return () => socket?.removeEventListener('message', handleMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, currentRoom])

  const onPlayerConfirm = () => {
    // manda mensagem informando que o player confirmou
    websocketService.send(JSON.stringify({ 
      type: 'PLAYER_READY', 
      player_id: player?.id,
      room_id: currentRoom?.id
    }))
  }

  console.log({connectedPlayers})
  
  return (
    <div className="min-h-dvh p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Sala {currentRoom?.name ?? 'Sem nome'}</h1>
        <div className="space-y-3">
          <LobbyPlayerCard player={player} onConfirm={onPlayerConfirm} isCurrentPlayer />
          {connectedPlayers.map(otherPlayer => (
            <LobbyPlayerCard key={otherPlayer.id} player={otherPlayer} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoomLobbyScreen
