"use client"

import { useEffect, useState } from "react"

// Target date: 28th at 19:30 Thailand time (GMT+7)
function getTargetDate(): Date {
  const now = new Date()
  const thailandTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }))
  
  let targetYear = thailandTime.getFullYear()
  let targetMonth = thailandTime.getMonth()
  
  const thisMonth28 = new Date(targetYear, targetMonth, 28, 19, 30, 0)
  
  if (thailandTime > thisMonth28) {
    targetMonth++
    if (targetMonth > 11) {
      targetMonth = 0
      targetYear++
    }
  }
  
  // 19:30 Thai = 12:30 UTC
  return new Date(Date.UTC(targetYear, targetMonth, 28, 12, 30, 0))
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  const targetDate = getTargetDate()
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl bg-card shadow-lg border border-border flex items-center justify-center">
        <span className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="mt-3 text-sm sm:text-base text-muted-foreground font-light tracking-widest uppercase">
        {label}
      </span>
    </div>
  )
}

export default function CountdownPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-12 text-balance">
          can't wait mA⚡︎ 💖
        </h1>

        {/* Countdown display */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          <CountdownUnit value={timeLeft.days} label="Days" />
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <CountdownUnit value={timeLeft.minutes} label="Minutes" />
          <CountdownUnit value={timeLeft.seconds} label="Seconds" />
        </div>
      </div>
    </main>
  )
}
