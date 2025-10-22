'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { OptimizedImage } from '../../components/ui/OptimizedImage'
import TopNav from '../../components/ui/TopNav'

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
  provenance?: {
    origin: string
    year: string
    previousOwners: string[]
    authenticity: string
  }
}

type SaleType = 'auction' | 'fixed'
type Category = 'painting' | 'sculpture' | 'manuscript' | 'all'
type Status = 'active' | 'sold'

interface FilterState {
  searchQuery: string
  category: Category
  saleType: SaleType | 'all'
  priceRange: {
    min: number
    max: number
  }
  status: Status | 'all'
}

export default function ShowcasePage() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    saleType: 'all',
    priceRange: { min: 0, max: 10 },
    status: 'all'
  })

  const [showFilters, setShowFilters] = useState(false)

  // No scroll disabling - always allow scrolling

  // Fetch artifacts from API
  useEffect(() => {
    const fetchArtifacts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          search: filters.searchQuery,
          category: filters.category,
          saleType: filters.saleType,
          minPrice: filters.priceRange.min.toString(),
          maxPrice: filters.priceRange.max.toString(),
          status: filters.status
        })

        const response = await fetch(`/api/artifacts?${params}`)
        const data = await response.json()
        setArtifacts(data.artifacts)
      } catch (error) {
        console.error('Failed to fetch artifacts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArtifacts()
  }, [filters])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }))
  }

  const handleCategoryChange = (category: Category) => {
    setFilters(prev => ({ ...prev, category }))
  }

  const handleSaleTypeChange = (saleType: SaleType | 'all') => {
    setFilters(prev => ({ ...prev, saleType }))
  }

  const handlePriceRangeChange = (field: 'min' | 'max', value: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: { ...prev.priceRange, [field]: value }
    }))
  }

  // const handleStatusChange = (status: Status | 'all') => {
  //   setFilters(prev => ({ ...prev, status }))
  // }

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      saleType: 'all',
      priceRange: { min: 0, max: 10 },
      status: 'all'
    })
  }

  return (
    <main className="flex flex-col min-h-svh overflow-y-auto pt-16">
      <TopNav />
      <div className="w-full px-4 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <p className="text-secondary text-xs md:text-sm mb-3">Discover unique digital artifacts linked to physical craftsmanship</p>
          {/* Search and Filter Controls */}
          <div className="mb-3">
            {/* Search Bar */}
            <div className="mb-3">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search artifacts, artists, or descriptions..."
                  value={filters.searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-3 py-1.5 pl-8 bg-secondary border border-[var(--color-glass-border)] rounded text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent transition-fast text-sm"
                />
                <svg
                  className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 px-2 py-1 bg-tertiary hover:bg-[var(--color-interactive-hover)] rounded transition-fast border border-[var(--color-glass-border)]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
                <span className="font-medium text-xs">Filters</span>
              </button>

              <button
                onClick={clearFilters}
                className="px-2 py-1 text-secondary hover:text-primary transition-fast font-medium text-xs"
              >
                Clear All
              </button>

              <div className="text-xs text-tertiary font-medium">
                {artifacts.length} artifacts
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="glass rounded p-2 mb-2 shadow-glass">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Category</label>
                    <div className="space-y-1">
                      {(['all', 'painting', 'sculpture', 'manuscript'] as const).map(category => (
                        <label key={category} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={filters.category === category}
                            onChange={() => handleCategoryChange(category)}
                            className="mr-1.5 text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]"
                          />
                          <span className="text-xs font-medium capitalize text-secondary hover:text-primary transition-fast">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Sale Type Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Sale Type</label>
                    <div className="space-y-1">
                      {(['all', 'auction', 'fixed'] as const).map(saleType => (
                        <label key={saleType} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="saleType"
                            value={saleType}
                            checked={filters.saleType === saleType}
                            onChange={() => handleSaleTypeChange(saleType)}
                            className="mr-1.5 text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]"
                          />
                          <span className="text-xs font-medium capitalize text-secondary hover:text-primary transition-fast">{saleType}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Price Range (ETH)</label>
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filters.priceRange.min}
                          onChange={(e) => handlePriceRangeChange('min', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-secondary border border-[var(--color-glass-border)] rounded text-primary text-xs placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] transition-fast"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filters.priceRange.max}
                          onChange={(e) => handlePriceRangeChange('max', parseFloat(e.target.value) || 10)}
                          className="w-full px-2 py-1 bg-secondary border border-[var(--color-glass-border)] rounded text-primary text-xs placeholder-secondary focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] transition-fast"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-secondary text-lg mb-3 font-medium">Loading artifacts...</div>
              <div className="animate-pulse">
                <div className="w-8 h-8 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        ) : artifacts.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-secondary text-lg mb-3 font-medium">No artifacts found</div>
              <p className="text-tertiary">Try adjusting your search criteria or filters</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto">
            <div className="artifact-grid p-4">
              {artifacts.map(artifact => (
                <div key={artifact.id} className="artifact-card bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="aspect-square relative overflow-hidden">
                    <OptimizedImage
                      src={artifact.image}
                      alt={artifact.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                        artifact.status === 'active'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}>
                        {artifact.status}
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-3 space-y-2">
                    <div>
                      <h3 className="text-sm font-semibold text-primary mb-0.5 group-hover:text-accent transition-colors line-clamp-1">{artifact.title}</h3>
                      <p className="text-secondary text-xs">by {artifact.artist}</p>
                    </div>

                    <p className="text-secondary text-xs leading-relaxed line-clamp-2">{artifact.description}</p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-accent font-bold text-sm">{artifact.price} {artifact.currency}</span>
                        <span className="text-tertiary text-xs font-medium capitalize px-1 py-0.5 bg-tertiary/20 rounded">{artifact.saleType}</span>
                      </div>
                      <div className="text-tertiary text-xs font-medium capitalize px-1 py-0.5 bg-secondary/50 rounded">{artifact.category}</div>
                    </div>

                    <Link
                      href={`/artifact/${artifact.id}`}
                      className="w-full mt-2 py-1.5 gradient-primary text-primary font-semibold rounded text-center hover:shadow-md hover:-translate-y-0.5 text-xs transition-all block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
