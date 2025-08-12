import { useImperativeHandle, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'

export type CreateRoomDialogRef = {
  open: () => void
  close: () => void
}

type CreateRoomDialogProps = {
  onCreate?: (name: string) => void
  ref?: React.Ref<CreateRoomDialogRef>
}

export default function CreateRoomDialog({ onCreate, ref }: CreateRoomDialogProps) {
  const [open, setOpen] = useState(false)
  const [roomName, setRoomName] = useState('')

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }), [])

  const handleCreate = () => {
    const trimmed = roomName.trim()
    
    if (!trimmed) return

    onCreate?.(trimmed)
    closeAndReset()
  }

  const closeAndReset = () => {
    setRoomName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar sala</DialogTitle>
          <DialogDescription>Escolha um nome para a sala.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Nome da sala"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" className="cursor-pointer" onClick={closeAndReset}>Cancelar</Button>
            <Button className="cursor-pointer" onClick={handleCreate}>Criar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
