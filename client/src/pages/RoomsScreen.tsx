import CreateRoomDialog from '@/components/CreateRoomDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlayer } from '@/hooks'
import websocketService from '@/services/WebSocketService'
import { useEffect, useRef } from 'react'

function RoomsScreen() {
  const { name } = usePlayer()

  const createRoomDialogRef = useRef(null)

  const rooms = [
    { id: '123', name: 'Sala 1', players_joined: 2, players_max: 7 },
    { id: '456', name: 'Sala 2', players_joined: 5, players_max: 7 },
  ]

  const joinRoom = (roomId: string) => {
    console.log(roomId)
  }

  const createRoom = () => {
    websocketService.send(JSON.stringify({ type: 'create_room', name: name }))
    setTimeout(() => {
      websocketService.send(JSON.stringify({ type: 'get_rooms' }))
    }, 300)
  }

  useEffect(() => {
    websocketService.send(JSON.stringify({ type: 'get_rooms' }))
  }, [])
  
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
          {rooms.map((room) => (
            <Card key={room.id} className='flex-row justify-between items-center'>
              <CardHeader className='w-full'>
                <CardTitle>{room.name}</CardTitle>
                <CardDescription>{room.players_joined} / {room.players_max} jogadores</CardDescription>
              </CardHeader>
              <CardContent>
                {room.players_joined < room.players_max && (
                  <Button onClick={() => joinRoom(room.id)} className='cursor-pointer'>
                    Entrar
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
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
