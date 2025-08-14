import CreateRoomDialog from '@/components/CreateRoomDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlayer } from '@/hooks'
import websocketService from '@/services/WebSocketService'
import type { Room } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RoomsScreen() {
  // @ts-expect-error - TODO: Arrumar isso
  const { player, setCurrentRoom } = usePlayer()
  const navigate = useNavigate()

  const createRoomDialogRef = useRef(null)
  const [rooms, setRooms] = useState<Room[] | null>(null)

  const joinRoom = (roomId: string) => {
    websocketService.send(JSON.stringify({ type: 'join_room', room_id: roomId, player_id: player.id }))
  }

  useEffect(() => {
    const socket = websocketService.getSocket()

    socket?.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)

      if (message.type === 'get_rooms_success') {
        console.log("caiu aqui", message.rooms)
        setRooms(message.rooms)
      }

      if (message.type === 'join_room_success') {
        console.log("caiu aqui 2", message.room)
        setCurrentRoom(message.room)
        // navigate(`/rooms/${message.room_id}`)
      }
    })

    return () => socket?.removeEventListener('message', () => {
      console.log('removendo listener')
    })
  }, [])

  const getRooms = () => websocketService.send(JSON.stringify({ type: 'get_rooms' }))

  const createRoom = (roomName: string) => {
    websocketService.send(JSON.stringify({ type: 'create_room', name: roomName, player_id: player.id }))
  }

  useEffect(() => {
    getRooms()
  }, [])
  
  // @ts-expect-error - TODO: Arrumar isso
  const showCreateRoomDialog = () => createRoomDialogRef.current?.open()

  return (
    <div className="min-h-dvh p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Salas disponíveis</h1>
          <Button
            onClick={showCreateRoomDialog}
          >
            Criar sala
          </Button>
          {/* <span className="font-medium opacity-70">{name}</span> */}
        </div>
        <div className="grid gap-3">
          {rooms?.map((room) => (
            <Card key={room.id} className='flex-row justify-between items-center'>
              <CardHeader className='w-full'>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{room.players.length} / 4 jogadores</CardDescription>
              </CardHeader>
              <CardContent>
                {room.players.length < 4 && (
                  <Button onClick={() => joinRoom(room.id)} className='cursor-pointer'>
                    Entrar
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {!rooms?.length && (
            <p>num tem sala ainda</p>
          )}
        </div>
      </div>
      <CreateRoomDialog 
        ref={createRoomDialogRef}
        onCreate={createRoom}
      />
    </div>
  )
}

export default RoomsScreen
