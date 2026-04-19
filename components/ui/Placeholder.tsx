import type { ReactNode } from 'react'

// Visible marker for unfilled content. Amber + bracketed so reviewers and
// grep can find every slot before launch. Inherits the surrounding font so
// typography previews match the real content that will replace it.
export default function Placeholder({ children }: { children: ReactNode }) {
  return <span className="text-amber-400/90">[{children}]</span>
}
