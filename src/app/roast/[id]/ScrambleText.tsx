'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

interface Props {
  text: string
  className?: string
  style?: React.CSSProperties
  delay?: number
  duration?: number
  onVisible?: boolean // trigger when scrolled into view
}

export default function ScrambleText({ text, className, style, delay = 0, duration = 800, onVisible }: Props) {
  const upper = text.toUpperCase()
  const [display, setDisplay] = useState(upper)
  const [started, setStarted] = useState(false)
  const rafRef = useRef<number>(0)
  const elRef = useRef<HTMLSpanElement>(null)

  // Trigger on mount or on visibility
  useEffect(() => {
    if (!onVisible) {
      setStarted(true)
      return
    }
    const el = elRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onVisible])

  // Run scramble
  useEffect(() => {
    if (!started) return
    const len = upper.length

    const timeout = setTimeout(() => {
      const start = performance.now()

      const step = (now: number) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const locked = Math.floor(progress * len)

        let result = ''
        for (let i = 0; i < len; i++) {
          if (upper[i] === ' ') {
            result += ' '
          } else if (i < locked) {
            result += upper[i]
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)]
          }
        }
        setDisplay(result)

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step)
        } else {
          setDisplay(upper)
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafRef.current)
    }
  }, [started, upper, delay, duration])

  return <span ref={elRef} className={className} style={style}>{display}</span>
}
