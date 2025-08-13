import { usePlayer } from "@/hooks"
import websocketService from "@/services/WebSocketService"
import { useEffect } from "react"

function RoomLobbyScreen () {
  const { currentRoom } = usePlayer()

  useEffect(() => {
    if (!currentRoom) return

    console.log("entrou no useEffect")

    const socket = websocketService.getSocket()

    socket?.send(JSON.stringify({ type: 'get_room_status', room_id: currentRoom.id }))

    socket?.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'get_room_status_success') {
        console.log({message})
      }
    })
  }, [currentRoom])


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
