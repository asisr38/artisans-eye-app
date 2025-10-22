'use client'

import React, { useState } from 'react'

interface BlockchainVerificationProps {
  transactionHash: string
  blockNumber: number
  contractAddress: string
  tokenId: string
}

export const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({
  transactionHash,
  blockNumber,
  contractAddress,
  tokenId
}) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyOnChain = async () => {
    setIsVerifying(true)
    try {
      // In a real app, this would call your backend to verify the transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsVerified(true)
    } catch (error) {
      setIsVerified(false)
    } finally {
      setIsVerifying(false)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Blockchain Verification</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Contract Address:</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-sm">{formatAddress(contractAddress)}</span>
            <a
              href={`https://etherscan.io/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">Token ID:</span>
          <span className="text-white font-mono text-sm">{tokenId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">Block Number:</span>
          <span className="text-white font-mono text-sm">#{blockNumber.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">Transaction:</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-mono text-sm">{formatAddress(transactionHash)}</span>
            <a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isVerified === null && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-gray-400 text-sm">Not verified</span>
                </div>
              )}
              {isVerified === true && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Verified on-chain</span>
                </div>
              )}
              {isVerified === false && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 text-sm">Verification failed</span>
                </div>
              )}
            </div>
            
            <button
              onClick={verifyOnChain}
              disabled={isVerifying || isVerified === true}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
            >
              {isVerifying ? 'Verifying...' : isVerified ? 'Verified' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockchainVerification
