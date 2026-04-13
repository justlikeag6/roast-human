'use client'

import { setManualUnlocked } from './GatedManual'

interface Props {
  roastId: string
  href: string
  label: string
  style?: React.CSSProperties
}

// X share button — also writes the manual-unlock flag for this roastId so the
// user isn't asked to share twice.
export function ShareButton({ roastId, href, label, style }: Props) {
  function handleClick() {
    setManualUnlocked(roastId)
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick} style={style}>
      {label}
    </a>
  )
}
