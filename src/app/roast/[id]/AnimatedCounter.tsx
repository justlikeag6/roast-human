'use client'

import { useState, useEffect, useRef } from 'react'

export default function AnimatedCounter({ target, delay = 0 }: { target: number; delay?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return

    const timer = setTimeout(() => {
      const duration = 800
      const steps = 20
      const increment = target / steps
      let current = 0
      let step = 0

      const interval = setInterval(() => {
        step++
        // Ease out
        const progress = step / steps
        const eased = 1 - Math.pow(1 - progress, 3)
        current = Math.round(target * eased)
        setCount(current)

        if (step >= steps) {
          setCount(target)
          clearInterval(interval)
        }
      }, duration / steps)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [started, target, delay])

  return <span ref={ref}>{count}</span>
}
