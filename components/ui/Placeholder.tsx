import type { ReactNode } from 'react'

// Visible marker for unfilled content. Bronze + bracketed so reviewers and
// grep can find every slot before launch. Inherits surrounding font.
export default function Placeholder({ children }: { children: ReactNode }) {
  return <span className="text-[var(--color-bronze-soft)]">[{children}]</span>
}
