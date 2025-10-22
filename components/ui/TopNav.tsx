'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import TourReplayButton from '../onboarding/TourReplayButton'
import { useAuth } from '../auth/AuthProvider'

export const TopNav = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const handleToggleMenu = useCallback(() => setMenuOpen((v) => !v), [])
  const handleCloseMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])


  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
      <div className="mx-auto mt-3 flex w-[min(1024px,96%)] items-center justify-between rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-md">
        <Link
          href="/"
          aria-label="Go to Home"
          className="pointer-events-auto select-none pl-2 text-sm font-semibold tracking-wide text-amber-300 hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-full"
        >
          The Artisan’s Eye
        </Link>
        {/* Desktop actions */}
        <div className="pointer-events-auto hidden items-center gap-1 md:flex">
          <Link
            href="/showcase"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            aria-label="Go to Showcase"
            tabIndex={0}
          >
            Showcase
          </Link>
          <Link
            href="/brief"
            className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
            aria-label="Open Project Brief"
            tabIndex={0}
          >
            Brief
          </Link>
          <TourReplayButton className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10" />
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="pointer-events-auto md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            aria-controls="topnav-menu"
            aria-expanded={menuOpen}
            onClick={handleToggleMenu}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="topnav-menu"
        className={`pointer-events-auto mx-auto w-[min(1024px,96%)] md:hidden ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="mt-2 rounded-2xl border border-white/10 bg-black/70 p-2 text-white backdrop-blur-md">
          <div className="grid gap-1">
            <Link
              href="/showcase"
              onClick={handleCloseMenu}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
            >
              Showcase
            </Link>
            <Link
              href="/brief"
              onClick={handleCloseMenu}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
            >
              Brief
            </Link>
            <div className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10">
              <TourReplayButton className="text-left" />
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={handleCloseMenu}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout()
                    handleCloseMenu()
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={handleCloseMenu}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={handleCloseMenu}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/10"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopNav


