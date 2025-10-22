'use client'

import React, { useState } from 'react'
import { useAuth } from '../../../components/auth/AuthProvider'
import ProtectedRoute from '../../../components/auth/ProtectedRoute'
import Link from 'next/link'

const SellerDashboard = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'mint' | 'listings' | 'sold' | 'profile'>('mint')

  // Mock data for active listings
  const activeListings = [
    {
      id: '1',
      title: 'Ceremonial Bronze Bell',
      artist: 'Artisan Chen',
      price: 1.8,
      currency: 'ETH',
      image: '/artifacts/IMG_0447.JPG',
      status: 'active',
      createdAt: '2024-01-20',
      views: 45,
      likes: 12
    }
  ]

  // Mock data for sold items
  const soldItems = [
    {
      id: '2',
      title: 'Sacred Text Fragment',
      artist: 'Scribe Amara',
      salePrice: 3.2,
      currency: 'ETH',
      image: '/artifacts/IMG_0447.JPG',
      soldDate: '2024-01-10',
      buyer: 'Collector123'
    }
  ]

  const handleLogout = () => {
    logout()
  }

  const handleMintNew = () => {
    // In a real app, this would open a minting form or redirect to mint page
    alert('Minting functionality would be implemented here')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-amber-300 mb-2">Seller Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleMintNew}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
              >
                Mint New Artifact
              </button>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Active Listings</h3>
            <p className="text-3xl font-bold text-amber-400">{activeListings.length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Sold</h3>
            <p className="text-3xl font-bold text-green-400">{soldItems.length}</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-blue-400">
              {soldItems.reduce((sum, item) => sum + item.salePrice, 0).toFixed(1)} ETH
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('mint')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'mint'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mint New Artifact
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'listings'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Active Listings
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'sold'
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sold Items
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
        {activeTab === 'mint' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Mint New Artifact</h2>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-8 max-w-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Your Digital Artifact</h3>
                <p className="text-gray-400 mb-6">
                  Mint a new digital Eye linked to a physical artifact. Each Eye is unique and represents real-world craftsmanship.
                </p>
                <button
                  onClick={handleMintNew}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors"
                >
                  Start Minting Process
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Active Listings</h2>
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeListings.map(listing => (
                  <div key={listing.id} className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{listing.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">by {listing.artist}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-amber-400 font-semibold">
                          {listing.price} {listing.currency}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Listed {new Date(listing.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>{listing.views} views</span>
                        <span>{listing.likes} likes</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                          Edit
                        </button>
                        <button className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No active listings</div>
                <p className="text-gray-500 mb-4">Start by minting your first artifact</p>
                <button
                  onClick={() => setActiveTab('mint')}
                  className="inline-block px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
                >
                  Mint New Artifact
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sold' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Sold Items</h2>
            {soldItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {soldItems.map(item => (
                  <div key={item.id} className="bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium">
                          Sold
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">by {item.artist}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-400 font-semibold">
                          {item.salePrice} {item.currency}
                        </span>
                        <span className="text-gray-500 text-xs">
                          Sold {new Date(item.soldDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">Buyer: {item.buyer}</p>
                      <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        View Transaction
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No items sold yet</div>
                <p className="text-gray-500">Your sold items will appear here</p>
              </div>
            )}
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
                    value="Seller"
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

export default function SellerDashboardPage() {
  return (
    <ProtectedRoute requiredRole="seller">
      <SellerDashboard />
    </ProtectedRoute>
  )
}
