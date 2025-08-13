import LobbyPlayerCard from "@/components/LobbyPlayerCard"
import { usePlayer } from "@/hooks"
import websocketService from "@/services/WebSocketService"
import type { Player } from "@/types"
import { useEffect, useState } from "react"

/*
  Quando um jogador entrar em uma sala, o servidor vai precisar mandar um broadcast pra todos jogadores (da sala, ou não pra simplificar?)
  Atualizando o status da sala (basicamente o numero de jogadores e se estão pronto pra começar.)

  Cada ação de um jogador (exemplo: clicar no pronto pra começar) tem q ser broadcastada pra todos os jogadores pra atulizar a ui
*/
function RoomLobbyScreen () {
  // @ts-expect-error - TODO: arrumar essa bosta
  const { player, currentRoom, setPlayer } = usePlayer()
  // const [playerIdToReady, setPlayerIdToReady] = useState<Record<string, boolean>>({})
  const [connectedPlayers, setConnectedPlayers] = useState<Player[]>([])

  useEffect(() => {
    const socket = websocketService.getSocket()

    socket?.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'room_status_updated') {
        const currentPlayer = message.room.players.find((p: Player) => p.id === player.id)
        const otherPlayers = message.room.players.filter((p: Player) => p.id !== player.id)

        setPlayer({ ...player, ready: currentPlayer.ready })
        setConnectedPlayers(otherPlayers)
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRoom, player])

  const onPlayerConfirm = () => {
    // manda mensagem informando que o player confirmou
    websocketService.send(JSON.stringify({ 
      type: 'player_ready', 
      player_id: player.id,
      room_id: currentRoom.id
    }))
  }
  
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
