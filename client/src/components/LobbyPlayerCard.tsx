import type { Player } from "@/types"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface LobbyPlayerCardProps {
  player: Player
  isCurrentPlayer?: boolean
  onConfirm?: () => void
}

const LobbyPlayerCard = ({ player, isCurrentPlayer = false, onConfirm }: LobbyPlayerCardProps) => {

  return (
    <Card key={player.id} className="flex-row justify-between items-center">
      <CardHeader className="w-full">
        <CardTitle className="flex items-center justify-between">
          {player.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isCurrentPlayer ? (
          <Button 
            onClick={onConfirm} 
            className='cursor-pointer' 
            disabled={player.ready}
            variant={player.ready ? 'default' : 'outline'}
          >
            {player.ready ? 'Confirmou' : 'Confirmar'}
          </Button>
        ) :
        <p className="text-sm text-gray-500 text-nowrap">
          {player.ready ? 'Confirmou' : 'Não confirmou'}
        </p>
        }
      </CardContent>
    </Card>
  )
}

export default LobbyPlayerCard
