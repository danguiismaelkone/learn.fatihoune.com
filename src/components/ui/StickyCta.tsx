'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

/** Mobile bottom bar that appears once the page's first call-to-action has scrolled out of view. */
export function StickyCta({ href, label, watchId = 'primary-cta' }: { href: string; label: string; watchId?: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const target = document.getElementById(watchId)
    if (!target) {
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0))
    observer.observe(target)
    return () => observer.disconnect()
  }, [watchId])
  return (
    <div className="sticky-cta" data-visible={visible} aria-hidden={!visible}>
      <Link className="btn btn--primary" href={href} tabIndex={visible ? 0 : -1}>
        {label}
      </Link>
    </div>
  )
}
