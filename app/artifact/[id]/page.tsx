'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { OptimizedImage } from '../../../components/ui/OptimizedImage'
import BlockchainVerification from '../../../components/ui/BlockchainVerification'
import AuthenticityCertificate from '../../../components/ui/AuthenticityCertificate'
import Link from 'next/link'

interface Artifact {
  id: string
  title: string
  artist: string
  category: string
  saleType: 'auction' | 'fixed'
  price: number
  currency: string
  image: string
  description: string
  status: 'active' | 'sold'
  createdAt: string
  provenance: {
    origin: string
    year: string
    previousOwners: string[]
    authenticity: string
    certificateUrl?: string
  }
  transactionHistory: {
    id: string
    type: 'mint' | 'sale' | 'transfer'
    from: string
    to: string
    price?: number
    currency?: string
    date: string
    transactionHash: string
    blockNumber: number
  }[]
}

const mockArtifact: Artifact = {
  id: '1',
  title: 'Tibetan Mandala Scroll',
  artist: 'Master Tenzin',
  category: 'painting',
  saleType: 'auction',
  price: 2.5,
  currency: 'ETH',
  image: '/artifacts/IMG_0447.JPG',
  description: 'Ancient Tibetan mandala scroll depicting the Wheel of Life. This sacred artwork represents the cycle of existence and the path to enlightenment in Tibetan Buddhism.',
  status: 'active',
  createdAt: '2024-01-15',
  provenance: {
    origin: 'Tibet',
    year: '15th Century',
    previousOwners: ['Monastery of Gyantse', 'Private Collection'],
    authenticity: 'Verified by Tibetan Art Institute',
    certificateUrl: '/certificates/tibetan-mandala-certificate.pdf'
  },
  transactionHistory: [
    {
      id: '1',
      type: 'mint',
      from: '0x0000000000000000000000000000000000000000',
      to: '0x1234567890abcdef1234567890abcdef12345678',
      date: '2024-01-15',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      blockNumber: 18500000
    },
    {
      id: '2',
      type: 'sale',
      from: '0x1234567890abcdef1234567890abcdef12345678',
      to: '0x9876543210fedcba9876543210fedcba98765432',
      price: 2.5,
      currency: 'ETH',
      date: '2024-01-20',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      blockNumber: 18501000
    }
  ]
}

export default function ArtifactDetailPage() {
  const [artifact, setArtifact] = useState<Artifact | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'details' | 'provenance' | 'history'>('details')

  useEffect(() => {
    // In a real app, you'd fetch the artifact by ID from the API
    const fetchArtifact = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setArtifact(mockArtifact)
      } catch (error) {
        console.error('Failed to fetch artifact:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtifact()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading artifact details...</p>
        </div>
      </div>
    )
  }

  if (!artifact) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">Artifact not found</div>
          <Link href="/showcase" className="text-amber-400 hover:text-amber-300">
            Return to Showcase
          </Link>
        </div>
      </div>
    )
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'mint':
        return 'bg-blue-600'
      case 'sale':
        return 'bg-green-600'
      case 'transfer':
        return 'bg-purple-600'
      default:
        return 'bg-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/showcase" className="text-amber-400 hover:text-amber-300 text-sm mb-2 inline-block">
                ← Back to Showcase
              </Link>
              <h1 className="text-3xl font-bold text-amber-300 mb-2">{artifact.title}</h1>
              <p className="text-gray-400">by {artifact.artist}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-400">{artifact.price} {artifact.currency}</div>
              <div className="text-sm text-gray-400 capitalize">{artifact.saleType}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gray-900 rounded-lg overflow-hidden">
              <OptimizedImage
                src={artifact.image}
                alt={artifact.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  artifact.status === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {artifact.status}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors">
                {artifact.status === 'active' ? 'Place Bid' : 'View Details'}
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                Share
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'details'
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('provenance')}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'provenance'
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Provenance
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                  activeTab === 'history'
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                History
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{artifact.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Category</h4>
                    <p className="text-white capitalize">{artifact.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Created</h4>
                    <p className="text-white">{new Date(artifact.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Physical Artifact</h4>
                  <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <p className="text-gray-300 text-sm">
                      This digital Eye is linked to a physical artifact that has been verified and authenticated. 
                      The physical artifact is stored in a secure facility and can be viewed by appointment.
                    </p>
                  </div>
                </div>

                <BlockchainVerification
                  transactionHash={artifact.transactionHistory[0].transactionHash}
                  blockNumber={artifact.transactionHistory[0].blockNumber}
                  contractAddress="0x1234567890abcdef1234567890abcdef12345678"
                  tokenId={artifact.id}
                />
              </div>
            )}

            {activeTab === 'provenance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Provenance Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Origin</h4>
                      <p className="text-white">{artifact.provenance.origin}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Year</h4>
                      <p className="text-white">{artifact.provenance.year}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Previous Owners</h4>
                      <ul className="space-y-1">
                        {artifact.provenance.previousOwners.map((owner, index) => (
                          <li key={index} className="text-white text-sm">
                            {index + 1}. {owner}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-1">Authenticity</h4>
                      <p className="text-white">{artifact.provenance.authenticity}</p>
                    </div>

                    {artifact.provenance.certificateUrl && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Certificate</h4>
                        <a
                          href={artifact.provenance.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View Certificate
                        </a>
                      </div>
                    )}

                    <div className="mt-6">
                      <AuthenticityCertificate
                        title={artifact.title}
                        artifactId={artifact.id}
                        authenticityDetails={{
                          verifiedBy: 'Tibetan Art Institute',
                          verificationDate: '2024-01-10',
                          certificateNumber: 'TAI-2024-001',
                          physicalLocation: 'Secure Storage Facility, Tibet',
                          condition: 'Excellent - Minor age-related patina',
                          materials: ['Handmade paper', 'Natural pigments', 'Gold leaf'],
                          dimensions: '45cm x 60cm',
                          provenance: [
                            'Created by Master Tenzin in 15th Century Tibet',
                            'Held in Monastery of Gyantse for 400 years',
                            'Acquired by Private Collection in 2019',
                            'Digitally authenticated and minted in 2024'
                          ]
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Transaction History</h3>
                  
                  <div className="space-y-3">
                    {artifact.transactionHistory.map((transaction, index) => (
                      <div key={transaction.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTransactionTypeColor(transaction.type)}`}>
                              {transaction.type.toUpperCase()}
                            </span>
                            <span className="text-gray-400 text-sm">
                              Block #{transaction.blockNumber.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-gray-400 text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">From:</span>
                            <span className="text-white font-mono">{formatAddress(transaction.from)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">To:</span>
                            <span className="text-white font-mono">{formatAddress(transaction.to)}</span>
                          </div>
                          {transaction.price && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Price:</span>
                              <span className="text-amber-400 font-semibold">
                                {transaction.price} {transaction.currency}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <a
                            href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-amber-400 hover:text-amber-300 text-sm"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View on Etherscan
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
