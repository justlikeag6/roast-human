interface Props {
  href: string
  label: string
  style?: React.CSSProperties
}

export function ShareButton({ href, label, style }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {label}
    </a>
  )
}
