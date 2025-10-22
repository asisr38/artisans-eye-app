'use client'

import React, { useState } from 'react'
import { useAuth } from '../../../components/auth/AuthProvider'
import ProtectedRoute from '../../../components/auth/ProtectedRoute'
import Link from 'next/link'

const BuyerDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'owned' | 'history' | 'profile'>('owned')

  // Mock data for owned artifacts
  const ownedArtifacts = [
    {
      id: '1',
      title: 'Tibetan Mandala Scroll',
      artist: 'Master Tenzin',
      purchasePrice: 2.5,
      currency: 'ETH',
      purchaseDate: '2024-01-15',
      image: '/artifacts/IMG_0447.JPG',
      status: 'active'
    }
  ]

  // Mock transaction history
  const transactionHistory = [
    {
      id: '1',
      artifactTitle: 'Tibetan Mandala Scroll',
      type: 'purchase',
      amount: 2.5,
      currency: 'ETH',
      date: '2024-01-15',
      status: 'completed',
      transactionHash: '0x1234567890abcdef'
    }
  ]

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-300 mb-2">Buyer Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/showcase"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
              >
                Browse Artifacts
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('owned')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'owned'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Owned Artifacts
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'history'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Purchase History
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Profile
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'owned' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Artifacts</h2>
            {ownedArtifacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedArtifacts.map(artifact => (
                  <div key={artifact.id} className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={artifact.image}
                        alt={artifact.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                          Owned
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{artifact.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">by {artifact.artist}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-semibold">
                          {artifact.purchasePrice} {artifact.currency}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Purchased {new Date(artifact.purchaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No artifacts owned yet</div>
                <p className="text-gray-500 mb-4">Start collecting unique digital artifacts</p>
                <Link
                  href="/showcase"
                  className="inline-block px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
                >
                  Browse Artifacts
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Purchase History</h2>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Artifact</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map(transaction => (
                    <tr key={transaction.id} className="border-t border-gray-700">
                      <td className="px-4 py-3 text-white">{transaction.artifactTitle}</td>
                      <td className="px-4 py-3 text-gray-300 capitalize">{transaction.type}</td>
                      <td className="px-4 py-3 text-amber-400">{transaction.amount} {transaction.currency}</td>
                      <td className="px-4 py-3 text-gray-300">{new Date(transaction.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 text-sm"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 max-w-2xl">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                  <input
                    type="text"
                    value="Buyer"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={user?.walletAddress || ''}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BuyerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="buyer">
      <BuyerDashboard />
    </ProtectedRoute>
  )
}
