import { Button } from "@/components/ui/button"
import { usePlayer } from "@/hooks"
import websocketService from "@/services/WebSocketService"
import { useEffect } from "react"



function GameScreen() {
  // @ts-expect-error - TODO: arrumar isso
  const { currentRoom } = usePlayer()

  useEffect(() => {
    const socket = websocketService.getSocket()
    
    websocketService.send(JSON.stringify({ type: 'get_questions', room_id: currentRoom.id }))
    
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data)

      // if (message.type === 'room_status_updated') {
      //   console.log(message.room)
      // }
    }

    socket?.addEventListener('message', handleMessage)

    return () => socket?.removeEventListener('message', handleMessage)
  }, [])

  const handleAnswer = (questionId: string, answerId: string) => {
    websocketService.send(JSON.stringify({ type: 'answer_question', room_id: currentRoom.id, question_id: questionId, answer_id: answerId }))
  }

  return (
    <div className="min-h-dvh pt-16 items-center justify-center flex flex-col gap-16">
      {currentRoom?.questions.map((question) => (
        <div key={question.id} className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{question.question}</h1>
          <div className="grid grid-cols-2 gap-2">
            {question.answers.map((answer) => (
              <Button 
                key={answer.id} 
                className="text-sm cursor-pointer"
                variant="outline"
                onClick={() => handleAnswer(question.id, answer.id)}
              >
                {answer.name}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default GameScreen
