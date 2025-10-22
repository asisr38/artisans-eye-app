import { NextResponse } from 'next/server'

// Mock data for artifacts
const mockArtifacts = [
  {
    id: '1',
    title: 'Tibetan Mandala Scroll',
    artist: 'Master Tenzin',
    category: 'painting',
    saleType: 'auction' as const,
    price: 2.5,
    currency: 'ETH',
    image: '/artifacts/IMG_0447.JPG',
    description: 'Ancient Tibetan mandala scroll depicting the Wheel of Life',
    status: 'active' as const,
    createdAt: '2024-01-15',
    provenance: {
      origin: 'Tibet',
      year: '15th Century',
      previousOwners: ['Monastery of Gyantse', 'Private Collection'],
      authenticity: 'Verified by Tibetan Art Institute'
    }
  },
  {
    id: '2',
    title: 'Ceremonial Bronze Bell',
    artist: 'Artisan Chen',
    category: 'sculpture',
    saleType: 'fixed' as const,
    price: 1.8,
    currency: 'ETH',
    image: '/artifacts/IMG_0447.JPG',
    description: 'Hand-crafted bronze bell used in traditional ceremonies',
    status: 'active' as const,
    createdAt: '2024-01-20',
    provenance: {
      origin: 'China',
      year: '12th Century',
      previousOwners: ['Imperial Palace', 'Private Collector'],
      authenticity: 'Verified by Chinese Cultural Heritage Foundation'
    }
  },
  {
    id: '3',
    title: 'Sacred Text Fragment',
    artist: 'Scribe Amara',
    category: 'manuscript',
    saleType: 'auction' as const,
    price: 3.2,
    currency: 'ETH',
    image: '/artifacts/IMG_0447.JPG',
    description: 'Fragment of ancient sacred text with intricate calligraphy',
    status: 'sold' as const,
    createdAt: '2024-01-10',
    provenance: {
      origin: 'India',
      year: '8th Century',
      previousOwners: ['Buddhist Monastery', 'University Collection', 'Private Owner'],
      authenticity: 'Verified by Sanskrit Manuscript Institute'
    }
  },
  {
    id: '4',
    title: 'Jade Dragon Pendant',
    artist: 'Master Li Wei',
    category: 'sculpture',
    saleType: 'fixed' as const,
    price: 4.1,
    currency: 'ETH',
    image: '/artifacts/IMG_0447.JPG',
    description: 'Exquisite jade pendant carved in the shape of a celestial dragon, symbolizing power and wisdom',
    status: 'active' as const,
    createdAt: '2024-01-25',
    provenance: {
      origin: 'China',
      year: 'Ming Dynasty',
      previousOwners: ['Imperial Court', 'Antique Dealer', 'Private Collection'],
      authenticity: 'Verified by Asian Art Authentication Council'
    }
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  // Parse query parameters
  const searchQuery = searchParams.get('search') || ''
  const category = searchParams.get('category') || 'all'
  const saleType = searchParams.get('saleType') || 'all'
  const minPrice = parseFloat(searchParams.get('minPrice') || '0')
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '10')
  const status = searchParams.get('status') || 'all'

  // Filter artifacts based on query parameters
  let filteredArtifacts = mockArtifacts.filter(artifact => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!artifact.title.toLowerCase().includes(query) && 
          !artifact.artist.toLowerCase().includes(query) &&
          !artifact.description.toLowerCase().includes(query)) {
        return false
      }
    }

    // Category filter
    if (category !== 'all' && artifact.category !== category) {
      return false
    }

    // Sale type filter
    if (saleType !== 'all' && artifact.saleType !== saleType) {
      return false
    }

    // Price range filter
    if (artifact.price < minPrice || artifact.price > maxPrice) {
      return false
    }

    // Status filter
    if (status !== 'all' && artifact.status !== status) {
      return false
    }

    return true
  })

  // Sort by creation date (newest first)
  filteredArtifacts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({
    artifacts: filteredArtifacts,
    total: filteredArtifacts.length,
    filters: {
      searchQuery,
      category,
      saleType,
      priceRange: { min: minPrice, max: maxPrice },
      status
    }
  })
}
