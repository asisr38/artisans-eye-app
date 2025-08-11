'use client'

import { useCallback } from 'react'
import { useSceneStore } from '../state/useSceneStore'

export const MintPanel = () => {
  const isOpen = useSceneStore((s) => s.isMintPanelOpen)
  const setOpen = useSceneStore((s) => s.setMintPanelOpen)
  const mintPhase = useSceneStore((s) => s.mintPhase)
  const setMintPhase = useSceneStore((s) => s.setMintPhase)

  const handleClose = useCallback(() => setOpen(false), [setOpen])
  const handleMint = useCallback(async () => {
    try {
      setMintPhase('preparing')
      await new Promise((r) => setTimeout(r, 600))
      setMintPhase('minting')
      await new Promise((r) => setTimeout(r, 1200))
      setMintPhase('success')
    } catch {
      setMintPhase('error')
    }
  }, [setMintPhase])

  if (!isOpen) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center bg-black/30">
      <div className="pointer-events-auto mb-4 w-[min(480px,92%)] rounded-2xl border border-white/10 bg-zinc-900/80 p-4 text-white backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Mint Artifact</h2>
          <button
            className="rounded-md px-2 py-1 text-sm text-white/70 hover:bg-white/10"
            onClick={handleClose}
            aria-label="Close mint panel"
            tabIndex={0}
          >
            Close
          </button>
        </div>
        <div className="mt-3 text-sm text-white/80">
          {mintPhase === 'idle' && <p>Ready to mint this unique artifact on-chain.</p>}
          {mintPhase === 'preparing' && <p>Preparing metadata…</p>}
          {mintPhase === 'minting' && <p>Minting on Ethereum…</p>}
          {mintPhase === 'success' && <p className="text-emerald-400">Success! Your artifact is minted.</p>}
          {mintPhase === 'error' && <p className="text-red-400">Something went wrong. Please try again.</p>}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            className="flex-1 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-50"
            onClick={handleMint}
            disabled={mintPhase === 'preparing' || mintPhase === 'minting' || mintPhase === 'success'}
          >
            {mintPhase === 'idle' && 'Mint This Artifact'}
            {mintPhase === 'preparing' && 'Preparing…'}
            {mintPhase === 'minting' && 'Minting…'}
            {mintPhase === 'success' && 'Minted'}
            {mintPhase === 'error' && 'Retry Mint'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MintPanel


