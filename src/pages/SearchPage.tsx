import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Search, MapPin, Bed, Bath, Heart, Verified, X } from 'lucide-react'
import { allListings } from '../data/listings'

const popularSearches = ['Agbowo', 'Bodija', 'Self-Contain', 'Near campus', '2-Bedroom', 'Cheap']

type ContextType = { openAuth: (prompt?: string) => void }

export default function SearchPage() {
  const { openAuth } = useOutletContext<ContextType>()
  const [query, setQuery] = useState('')
  const [savedListings, setSavedListings] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return allListings.filter((l) =>
      l.title.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.type.toLowerCase().includes(q) ||
      l.distance.toLowerCase().includes(q)
    )
  }, [query])

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!savedListings.includes(id)) {
      openAuth('Sign in to save listings')
      return
    }
    setSavedListings((prev) => prev.filter((i) => i !== id))
  }

  const handleSearch = (val: string) => {
    setQuery(val)
    setShowResults(val.trim().length > 0)
  }

  return (
    <div className="page-content">
      <div className="search-page">
        <div className="search-page-header">
          <h1 className="search-page-title">Search Properties</h1>
          <p className="search-page-subtitle">Find your perfect student housing</p>
        </div>

        <div className="search-page-input-wrap">
          <Search className="search-page-input-icon" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by location, property type..."
            className="search-page-input"
            autoFocus
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowResults(false) }} className="search-page-clear">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!showResults && (
          <div className="search-page-suggestions">
            <h3 className="search-suggestions-title">Popular Searches</h3>
            <div className="search-suggestions-grid">
              {popularSearches.map((s) => (
                <button key={s} onClick={() => { setQuery(s); setShowResults(true) }} className="search-suggestion-chip tap-target">
                  <Search className="w-3.5 h-3.5" /> {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {showResults && (
          <div className="search-page-results">
            <p className="search-results-count">{results.length} properties found</p>
            <div className="search-results-grid">
              {results.map((listing) => (
                <a key={listing.id} href={`/home/listing/${listing.id}`} className="listing-card hover-lift">
                  <div className="listing-card-image">
                    <img src={listing.image} alt={listing.title} loading="lazy" />
                    <div className="listing-card-overlay" />
                    <div className="listing-card-badges">
                      {listing.verified && <span className="badge-verified"><Verified className="w-3 h-3" /> Verified</span>}
                      {listing.featured && <span className="badge-featured">Featured</span>}
                    </div>
                    <button onClick={(e) => toggleSave(listing.id, e)} className={`listing-card-save ${savedListings.includes(listing.id) ? 'is-saved' : ''}`}>
                      <Heart />
                    </button>
                  </div>
                  <div className="listing-card-body">
                    <div className="listing-card-top">
                      <div className="listing-card-info">
                        <h3 className="listing-card-title">{listing.title}</h3>
                        <div className="listing-card-location"><MapPin /> {listing.location}</div>
                      </div>
                      <div className="listing-card-price">
                        <span className="listing-card-price-amount">₦{listing.price}</span>
                        <span className="listing-card-price-period">/year</span>
                      </div>
                    </div>
                    <div className="listing-card-meta">
                      <span className="listing-card-meta-item"><Bed /> {listing.beds} bed{listing.beds > 1 ? 's' : ''}</span>
                      <span className="listing-card-meta-item"><Bath /> {listing.baths} bath</span>
                      <span className="listing-card-meta-divider">|</span>
                      <span className="listing-card-meta-distance"><MapPin className="w-3 h-3" /> {listing.distance}</span>
                    </div>
                  </div>
                </a>
              ))}
              {results.length === 0 && (
                <div className="search-empty">
                  <Search className="w-12 h-12" style={{ color: 'var(--navy-200)' }} />
                  <p className="search-empty-title">No properties found</p>
                  <p className="search-empty-text">Try a different search term or browse popular searches</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
