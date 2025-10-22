'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()

  // Don't show navbar on the home page (hero experience) or showcase (uses TopNav)
  if (pathname === '/' || pathname.startsWith('/showcase')) {
    return null
  }

  const navItems = [
    { href: '/', label: 'Home', icon: '👁️' },
    { href: '/showcase', label: 'Showcase' },
    { href: '/panorama', label: 'Panorama' },
    { href: '/mint', label: 'Mint' },
    { href: '/reveal', label: 'Reveal' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="navbar" data-navbar="true">
      <div className="w-full px-4 h-full flex items-center">
        {/* Logo/Home Link */}
        <Link
          href="/"
          className="flex items-center gap-2 mr-6 transition-colors hover:text-[var(--color-accent-primary)]"
        >
          <span className="text-lg">👁️</span>
          <span className="font-semibold text-sm">Artisan's Eye</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-medium text-sm transition-colors hover:text-[var(--color-accent-primary)] ${
                isActive(item.href)
                  ? 'text-[var(--color-accent-primary)]'
                  : 'text-[var(--color-text-primary)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <button className="p-2 text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden absolute left-0 right-0 top-14 w-full border-t border-[var(--color-glass-border)] bg-[var(--color-background-primary)]/95 backdrop-blur-sm">
        <div className="px-4 py-3 flex flex-col gap-2">
          {navItems.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'text-[var(--color-accent-primary)] bg-[var(--color-interactive-hover)]'
                  : 'text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] hover:bg-[var(--color-interactive-hover)]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
