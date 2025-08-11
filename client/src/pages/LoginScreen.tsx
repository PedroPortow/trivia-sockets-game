import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePlayer } from '@/hooks'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function LoginScreen() {
  const navigate = useNavigate()
  const { name, setName } = usePlayer()
  const [value, setValue] = useState(name ?? '')

  useEffect(() => {
    setValue(name ?? '')
  }, [name])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!value.trim()) {
      alert('Por favor, digite um nome')
      return
    }

    setName(value)
    navigate('/rooms')
  }

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
