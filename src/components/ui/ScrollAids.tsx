'use client'

import { useEffect, useRef, useState } from 'react'

/** Red signature rule under the header, filled as the page is read. Full when the page does not scroll. */
export function ReadingProgress() {
  const bar = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1
      if (bar.current) bar.current.style.transform = `scaleX(${ratio})`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <div className="progress" aria-hidden="true">
      <span ref={bar} className="progress__bar" />
    </div>
  )
}

/** Appears after two screens of scrolling; returns to the top and moves focus to the main content. */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 2)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      type="button"
      className="to-top"
      data-visible={visible}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label="Revenir en haut de la page"
      onClick={() => {
        window.scrollTo({ top: 0 })
        document.getElementById('contenu')?.focus({ preventScroll: true })
      }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
