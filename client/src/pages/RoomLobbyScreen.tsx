import { usePlayer } from "@/hooks"
import websocketService from "@/services/WebSocketService"
import { useEffect } from "react"

/*
  Quando um jogador entrar em uma sala, o servidor vai precisar mandar um broadcast pra todos jogadores (da sala, ou não pra simplificar?)
  Atualizando o status da sala (basicamente o numero de jogadores e se estão pronto pra começar.)

  Cada ação de um jogador (exemplo: clicar no pronto pra começar) tem q ser broadcastada pra todos os jogadores pra atulizar a ui
*/
function RoomLobbyScreen () {
  const { currentRoom } = usePlayer()

  //   if (!currentRoom) return

  //   console.log("entrou no useEffect")

  //   const socket = websocketService.getSocket()

  //   socket?.send(JSON.stringify({ type: 'get_room_status', room_id: currentRoom.id }))

  //   socket?.addEventListener('message', (event) => {
  //     const message = JSON.parse(event.data)

  //     if (message.type === 'get_room_status_success') {
  //       console.log({message})
  //     }
  //   })
  // }, [currentRoom])


  useEffect(() => {
    if (!currentRoom) return

    websocketService.send(JSON.stringify({ type: 'get_room_status', room_id: currentRoom.id }))
  }, [currentRoom])

  return (
    <div className="min-h-dvh p-6">
      <h1>Sala {currentRoom?.name}</h1> 
      
    </div>
  )
}

export default RoomLobbyScreen
