'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const OPEN_EVENT = 'nav-dropdown:open'
const CLOSE_DELAY = 180 // ms: lets the pointer travel from the label to the panel

/**
 * Main-menu drop-down: opens on hover (mouse), on click/tap and with the keyboard (Enter, Space).
 * Escape closes it and returns focus to the label. Opening one closes the others.
 */
export function NavDropdown({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  const show = () => {
    clear()
    setOpen(true)
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }))
  }
  const hide = (delay = 0) => {
    clear()
    if (delay) timer.current = setTimeout(() => setOpen(false), delay)
    else setOpen(false)
  }

  // Another drop-down opened: close this one.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id) setOpen(false)
    }
    window.addEventListener(OPEN_EVENT, onOther)
    return () => window.removeEventListener(OPEN_EVENT, onOther)
  }, [id])

  // Navigating closes the panel.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false)
  }, [pathname])

  useEffect(() => clear, [])

  return (
    <div
      ref={root}
      className="nav__dropdown"
      data-open={open}
      // Hover only for mouse and pen: on touch screens the label is tapped (onClick).
      onPointerEnter={(e) => (e.pointerType === 'touch' ? undefined : show())}
      onPointerLeave={(e) => (e.pointerType === 'touch' ? undefined : hide(CLOSE_DELAY))}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation()
          hide()
          button.current?.focus()
        }
      }}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) hide()
      }}
    >
      <button
        ref={button}
        type="button"
        className="nav__trigger"
        aria-expanded={open}
        aria-controls={`mega-${id}`}
        onClick={() => (open ? hide() : show())}
      >
        {label} <span aria-hidden="true" className="nav__chevron" />
      </button>
      <div
        id={`mega-${id}`}
        className="mega"
        hidden={!open}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) hide()
        }}
      >
        {children}
      </div>
    </div>
  )
}
