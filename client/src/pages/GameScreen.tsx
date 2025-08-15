import Timer, { type TimerRef } from "@/components/Timer"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/hooks"
import websocketService from "@/services/WebSocketService"
import type { Question } from "@/types"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"



function GameScreen() {
  // @ts-expect-error - TODO: arrumar isso
  const { currentRoom, player } = usePlayer()
  const [currentQuestion, setCurrentQuestion] = useState<Question>(currentRoom.questions[0])
  const [currentAnswerId, setCurrentAnswerId] = useState<number | null>(null)
  const timerRef = useRef<TimerRef>(null)
  const navigate = useNavigate()
  useEffect(() => {
    const socket = websocketService.getSocket()
    
    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data)
    }
    
    socket?.addEventListener('message', handleMessage)

    return () => socket?.removeEventListener('message', handleMessage)
  }, [currentRoom])
  
  const onTimerFinish = () => {
    // manda a resposta pro servidort, ele q decide se ta certa ou nem
    if (currentAnswerId) {
      websocketService.send(JSON.stringify({ 
        type: 'ANSWER_QUESTION', 
        room_id: currentRoom.id, 
        question_id: currentQuestion?.id, 
        answer_id: currentAnswerId,
        player_id: player.id
      }))
    }
    
    const currentQuestionIndex = currentRoom.questions.findIndex(q => q.id === currentQuestion.id)

    if (currentQuestionIndex === currentRoom.questions.length - 1) {
      navigate(`/rooms/${currentRoom.id}/game/result`)
      return
    }
      
    timerRef.current?.reset()
    setCurrentQuestion(currentRoom.questions[currentQuestionIndex + 1])
    setCurrentAnswerId(null)
  }

  const currentQuestionIndex = useMemo(() => {
    return currentRoom.questions.findIndex(q => q.id === currentQuestion.id)
  }, [currentRoom.questions, currentQuestion])


  return (
    <div className="min-h-dvh pt-16 items-center justify-center flex flex-col gap-16">
      <p>Pergunta {currentQuestionIndex + 1} de {currentRoom.questions.length}</p>
      <Timer duration={15} onFinish={onTimerFinish} ref={timerRef} />
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">{currentQuestion?.question}</h1>
        <div className="grid grid-cols-2 gap-2">
          {currentQuestion?.answers.map((answer, index) => (
            <Button 
              key={index}
              className="text-sm cursor-pointer"
              variant={currentAnswerId === answer.id ? 'default' : 'outline'}
              onClick={() => setCurrentAnswerId(answer.id)}
            >
              {answer.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameScreen
