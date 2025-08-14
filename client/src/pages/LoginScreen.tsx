import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePlayer } from '@/hooks'
import websocketService from '@/services/WebSocketService'
import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginScreen() {
  const navigate = useNavigate()
  const { player, setPlayer } = usePlayer()
  const [value, setValue] = useState(player?.name ?? '')

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!value.trim()) {
      alert('Por favor, digite um nome')
      return
    }

    try {
      websocketService.send(JSON.stringify({ type: 'register', name: value }))
    } catch {
      alert('num deu pra se conectar no websocket....')
    } 
  }

  useEffect(() => {
    websocketService.connect()
    const socket = websocketService.getSocket()

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data)

      console.log('LISTENER DA TELA DE LOGIN TÁ OUVINDO ESSE SAFADO')

      if (message.type === 'register_success') {
        setPlayer(message.player)
        navigate('/rooms')
      }

      if (message.type === 'join_room_success') {
        console.log("BOSTA ")
      }
    }

    socket?.addEventListener('message', handleMessage)

    return () => socket?.removeEventListener('message', handleMessage)
  }, [navigate])
  
  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 p-6 rounded-xl border bg-card">
        <h1 className="text-2xl font-semibold">Digite seu nome</h1>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Seu nome"
          maxLength={24}
          autoFocus
        />
        <Button type='submit' className='w-full cursor-pointer'>
          Entrar
        </Button>
      </form>
    </div>
  )
}

export default LoginScreen
