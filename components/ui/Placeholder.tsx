import type { ReactNode } from 'react'

// Visible marker for unfilled content. Monospace + amber so reviewers and
// grep can find every slot before launch. Do NOT style these to blend in —
// the whole point is that they look wrong on the page.
export default function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.92em] text-amber-400/85">[{children}]</span>
  )
}
