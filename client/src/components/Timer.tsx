import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

export type TimerRef = {
  reset: () => void
}

interface TimerProps {
  duration: number
  onFinish: () => void
}

const Timer = forwardRef<TimerRef, TimerProps>(({ duration, onFinish }, ref) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  useImperativeHandle(ref, () => ({
    reset: () => { setTimeLeft(duration) }
  }))

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish()
      return 
    }

    const countdown = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearInterval(countdown)
  }, [timeLeft, onFinish])
  
  return (
    <p className="text-sm text-muted-foreground">{timeLeft}</p>
  )
})

export default Timer
