'use client'

import { useEffect } from 'react'
import anime from 'animejs'

export default function ResultAnimations() {
  useEffect(() => {
    const hero = document.querySelector('.hero-card') as HTMLElement | null
    if (!hero) return

    // ── Phase 1: Hero card entrance ──
    const tl = anime.timeline({
      easing: 'easeOutCubic',
      complete: () => {
        // Clear inline transforms anime.js left behind
        hero.style.transform = ''
        const title = hero.querySelector('.arch-title') as HTMLElement | null
        if (title) title.style.transform = ''
      },
    })

    tl.add({
      targets: hero,
      opacity: [0, 1],
      translateY: [50, 0],
      duration: 600,
    })

    // Title slam — scale bounce
    const titleEl = hero.querySelector('.arch-title')
    if (titleEl) {
      tl.add({
        targets: titleEl,
        scale: [1.3, 1],
        duration: 400,
        easing: 'easeOutBack',
      }, '-=200')
    }

    // ── Phase 2: Action row + share cards ──
    anime({
      targets: '.action-row',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
      easing: 'easeOutCubic',
      delay: 600,
      complete: (anim) => {
        anim.animatables.forEach((a) => { (a.target as HTMLElement).style.transform = '' })
      },
    })

    anime({
      targets: '.share-cards',
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
      easing: 'easeOutCubic',
      delay: 800,
      complete: (anim) => {
        anim.animatables.forEach((a) => { (a.target as HTMLElement).style.transform = '' })
      },
    })

    // ── Phase 3: Detail sections on scroll ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            anime({
              targets: entry.target,
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 500,
              easing: 'easeOutCubic',
              complete: (anim) => {
                anim.animatables.forEach((a) => { (a.target as HTMLElement).style.transform = '' })
              },
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.detail-section').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}
