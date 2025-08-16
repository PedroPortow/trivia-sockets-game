import CreateRoomDialog, { type CreateRoomDialogRef } from '@/components/CreateRoomDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePlayer } from '@/hooks'
import websocketService from '@/services/WebSocketService'
import type { Room } from '@/types'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RoomsScreen() {
  const { player, setCurrentRoom } = usePlayer()
  const navigate = useNavigate()

  const createRoomDialogRef = useRef<CreateRoomDialogRef>(null)
  const [rooms, setRooms] = useState<Room[] | null>(null)

  const joinRoom = (roomId: string) => {
    websocketService.send(JSON.stringify({ type: 'JOIN_ROOM', room_id: roomId, player_id: player?.id }))
  }

  useEffect(() => {
    const socket = websocketService.getSocket()

    function handleMessage(event: MessageEvent) {
      const message = JSON.parse(event.data)

      console.log(JSON.stringify(message, null, 2))

        if (message.type === 'GET_ROOMS_SUCCESS') {
          setRooms(message.rooms)
        }
  
        if (message.type === 'JOIN_ROOM_SUCCESS') {
          setCurrentRoom(message.room)
          navigate(`/rooms/${message.room.id}`)
      }
    }

    socket?.addEventListener('message', handleMessage)

    return () => socket?.removeEventListener('message', handleMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate])

  const getRooms = () => websocketService.send(JSON.stringify({ type: 'GET_ROOMS' }))

  const createRoom = (roomName: string) => {
    websocketService.send(JSON.stringify({ type: 'CREATE_ROOM', name: roomName, player_id: player?.id }))
  }

  useEffect(() => {
    getRooms()
  }, [])
  
  const showCreateRoomDialog = () => createRoomDialogRef.current?.open()

  return (
    <div className="min-h-dvh p-6">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Salas</h1>
          {!rooms?.length && (
              <Button
              onClick={showCreateRoomDialog}
            >
              Criar sala
            </Button>
          )}
          {/* <span className="font-medium opacity-70">{name}</span> */}
        </div>
        <div className="grid gap-3">
          {rooms?.map((room) => (
            <Card key={room.id} className='flex-row justify-between items-center'>
              <CardHeader className='w-full'>
                <CardTitle>{room.name}</CardTitle>
                {/* @ts-expect-error - Typescript para de reclamar porfavor, eu n quero arrumar isso */}
                <CardDescription>{room.players.length} / 4 jogadores</CardDescription>
              </CardHeader>
              <CardContent>
                {/* @ts-expect-error - Typescript para de reclamar porfavor, eu n quero arrumar isso */}
                {room.players.length < 4 && !room.game_started && (
                  <Button onClick={() => joinRoom(room.id)} className='cursor-pointer'>
                    Entrar
                  </Button>
                )}
                {room.game_started && (
                  <p className='text-sm text-muted-foreground text-nowrap'>Jogo em andamento</p>
                )}
              </CardContent>
            </Card>
          ))}
          {!rooms?.length && (
            <p className='text-center text-muted-foreground mt-16'>
              Ainda não há salas disponíveis 😢
              <br />
              Crie uma!
            </p>
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
