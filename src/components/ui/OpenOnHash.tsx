'use client'

import { useEffect } from 'react'

/** Opens a closed <details> when the URL hash (or an in-page link) targets it or something inside it. */
export function OpenOnHash() {
  useEffect(() => {
    const open = (hash: string) => {
      if (!hash || hash === '#') return
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      const details = target?.closest('details')
      if (details && !details.open) {
        details.open = true
        target!.scrollIntoView()
      }
    }
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (link) open(link.getAttribute('href') ?? '')
    }
    open(window.location.hash)
    const onHash = () => open(window.location.hash)
    window.addEventListener('hashchange', onHash)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('hashchange', onHash)
      document.removeEventListener('click', onClick)
    }
  }, [])
  return null
}
