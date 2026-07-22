import { useState, useRef, useEffect, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, MapPin, Bed, Bath, Heart, Star, Verified, ArrowRight, TrendingUp, X, ChevronDown, Eye, Shield, Bell } from 'lucide-react'
import { allListings, worldwideLocations } from '../data/listings'
import type { Listing } from '../data/listings'

import VirtualTour from '../components/VirtualTour'

type ContextType = { openAuth: (prompt?: string) => void; isLoggedIn: boolean; t: Record<string, string> }

const ITEMS_PER_PAGE = 20

const categoryMap: Record<string, (l: Listing) => boolean> = {
  all: () => true,
  selfcontain: (l) => l.type === 'Self-Contain',
  room: (l) => l.type === 'Room & Parlour',
  shared: (l) => l.beds >= 2 && l.type !== '2-Bedroom',
  '2bedroom': (l) => l.type === '2-Bedroom',
}

const bedOptions = ['Any', '1', '2', '3+']
const priceRanges = ['Any', 'Under ₦200k', '₦200k - ₦350k', '₦350k - ₦500k', 'Over ₦500k']

function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/,/g, ''), 10)
}

function matchesPriceRange(priceStr: string, range: string): boolean {
  const price = parsePrice(priceStr)
  switch (range) {
    case 'Under ₦200k': return price < 200000
    case '₦200k - ₦350k': return price >= 200000 && price <= 350000
    case '₦350k - ₦500k': return price > 350000 && price <= 500000
    case 'Over ₦500k': return price > 500000
    default: return true
  }
}

function FilterDropdown({ label, icon, options, value, onChange }: {
  label: string; icon?: React.ReactNode; options: string[]; value: string; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = value !== options[0]

  return (
    <div className="filter-dropdown-wrap" ref={ref}>
      <button
        className={`filter-btn tap-target ${isActive ? 'filter-btn--active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        {icon}
        {isActive ? value : label}
        <ChevronDown className="filter-chevron" />
      </button>
      {open && (
        <div className="filter-dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt}
              className={`filter-dropdown-item tap-target ${value === opt ? 'is-active' : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function LocationCascade({ value, onChange }: { value: { country: string; state: string; area: string }; onChange: (v: { country: string; state: string; area: string }) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = value.country !== '' || value.state !== '' || value.area !== ''
  const activeLabel = isActive
    ? [value.area, value.state, value.country].filter(Boolean).join(', ')
    : 'Location'

  const countries = worldwideLocations
  const states = countries.find((c) => c.name === value.country)?.children || []
  const areas = states.find((s) => s.name === value.state)?.children || []

  return (
    <div className="filter-dropdown-wrap filter-location" ref={ref}>
      <button
        className={`filter-btn tap-target ${isActive ? 'filter-btn--active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <MapPin className="filter-btn-icon" />
        {activeLabel}
        <ChevronDown className="filter-chevron" />
      </button>
      {open && (
        <div className="filter-dropdown-menu filter-location-menu">
          <div className="filter-location-scroll">
            <div className="filter-location-col">
              <p className="filter-location-label">Country</p>
              <button
                className={`filter-dropdown-item tap-target ${value.country === '' ? 'is-active' : ''}`}
                onClick={() => onChange({ country: '', state: '', area: '' })}
              >
                All Countries
              </button>
              {countries.map((c) => (
                <button
                  key={c.name}
                  className={`filter-dropdown-item tap-target ${value.country === c.name ? 'is-active' : ''}`}
                  onClick={() => onChange({ country: c.name, state: '', area: '' })}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {states.length > 0 && (
              <div className="filter-location-col">
                <p className="filter-location-label">State / City</p>
                <button
                  className={`filter-dropdown-item tap-target ${value.state === '' ? 'is-active' : ''}`}
                  onClick={() => onChange({ ...value, state: '', area: '' })}
                >
                  All Cities
                </button>
                {states.map((s) => (
                  <button
                    key={s.name}
                    className={`filter-dropdown-item tap-target ${value.state === s.name ? 'is-active' : ''}`}
                    onClick={() => onChange({ ...value, state: s.name, area: '' })}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            {areas.length > 0 && (
              <div className="filter-location-col">
                <p className="filter-location-label">Area</p>
                <button
                  className={`filter-dropdown-item tap-target ${value.area === '' ? 'is-active' : ''}`}
                  onClick={() => onChange({ ...value, area: '' })}
                >
                  All Areas
                </button>
                {areas.map((a) => (
                  <button
                    key={a.name}
                    className={`filter-dropdown-item tap-target ${value.area === a.name ? 'is-active' : ''}`}
                    onClick={() => { onChange({ ...value, area: a.name }); setOpen(false) }}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const { openAuth, isLoggedIn, t } = useOutletContext<ContextType>()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedListings, setSavedListings] = useState<number[]>([])
  const [location, setLocation] = useState({ country: '', state: '', area: '' })
  const [selectedBeds, setSelectedBeds] = useState('Any')
  const [selectedPrice, setSelectedPrice] = useState('Any')
  const [currentPage, setCurrentPage] = useState(1)
  const [tourOpen, setTourOpen] = useState(false)
  const [tourListing, setTourListing] = useState<Listing | null>(null)
  const [savedSearch, setSavedSearch] = useState(false)

  const openTour = (listing: Listing, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setTourListing(listing)
    setTourOpen(true)
  }

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setSavedListings((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id)
      openAuth('Sign in to save listings')
      return prev
    })
  }

  const filteredListings = useMemo(() => {
    let results = allListings

    if (activeCategory !== 'all') {
      results = results.filter(categoryMap[activeCategory])
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.type.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.state.toLowerCase().includes(q) ||
          l.area.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      )
    }

    if (location.country) {
      results = results.filter((l) => l.country === location.country)
    }
    if (location.state) {
      results = results.filter((l) => l.state === location.state)
    }
    if (location.area) {
      results = results.filter((l) => l.area === location.area)
    }

    if (selectedBeds !== 'Any') {
      const beds = parseInt(selectedBeds, 10)
      results = results.filter((l) => selectedBeds === '3+' ? l.beds >= beds : l.beds === beds)
    }

    if (selectedPrice !== 'Any') {
      results = results.filter((l) => matchesPriceRange(l.price, selectedPrice))
    }

    return results
  }, [activeCategory, searchQuery, location, selectedBeds, selectedPrice])

  useEffect(() => { setCurrentPage(1) }, [activeCategory, searchQuery, location, selectedBeds, selectedPrice])

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / ITEMS_PER_PAGE))
  const paginatedListings = filteredListings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [currentPage, totalPages])

  const goToPage = (page: number) => {
    setCurrentPage(page)
    document.querySelector('.home-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const categories = [
    { id: 'all', label: 'All Properties', count: allListings.length },
    { id: 'selfcontain', label: 'Self-Contain', count: allListings.filter(categoryMap['selfcontain']).length },
    { id: 'room', label: 'Room & Parlour', count: allListings.filter(categoryMap['room']).length },
    { id: 'shared', label: 'Shared', count: allListings.filter(categoryMap['shared']).length },
    { id: '2bedroom', label: '2-Bedroom', count: allListings.filter(categoryMap['2bedroom']).length },
  ]

  return (
    <div className="home-page">

      {/* ── FILTER BAR ── */}
      <div className="filter-bar">
        <div className="filter-bar-inner">
          <div className="filter-search">
            <Search />
            <input
              type="text"
              placeholder="Search by location, property name, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="filter-search-clear tap-target" onClick={() => setSearchQuery('')}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="filter-actions">
            <LocationCascade value={location} onChange={setLocation} />
            <FilterDropdown label="Beds" icon={<Bed className="filter-btn-icon" />} options={bedOptions} value={selectedBeds} onChange={setSelectedBeds} />
            <FilterDropdown label="Price" options={priceRanges} value={selectedPrice} onChange={setSelectedPrice} />
            <button className="filter-btn filter-btn--primary tap-target">
              <SlidersHorizontal className="filter-btn-icon" /> All Filters
            </button>
            {!isLoggedIn && (
              <div className="filter-auth-buttons">
                <button onClick={() => openAuth()} className="filter-auth-btn tap-target">Sign In</button>
                <button onClick={() => navigate('/register')} className="filter-auth-btn filter-auth-btn--primary tap-target">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="home-content page-content">

        {/* category pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`category-pill tap-target ${activeCategory === cat.id ? 'is-active' : ''}`}
            >
              {cat.label}
              <span className="category-pill-count">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* section header */}
        <div className="section-header">
          <div>
            <h2>
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--coral-500)' }} />
              {location.country || location.state ? `${[location.area, location.state, location.country].filter(Boolean).join(', ')} Properties` : 'Worldwide Properties'}
            </h2>
            <p>{filteredListings.length} {filteredListings.length === 1 ? 'property' : 'properties'} found</p>
          </div>
          <button className="section-viewall tap-target">
            View all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* search alert */}
        {(location.country || location.state || searchQuery || activeCategory !== 'all') && (
          <div className="search-alert">
            <div className="search-alert-left">
              <Bell className="search-alert-icon" />
              <span className="search-alert-text">{t.searchAlertText}</span>
            </div>
            <button
              onClick={() => { setSavedSearch(!savedSearch); if (!isLoggedIn) openAuth('Sign in to save search alerts') }}
              className={`search-alert-btn tap-target ${savedSearch ? 'is-active' : ''}`}
            >
              {savedSearch ? t.alertActive : t.notifyMe}
            </button>
          </div>
        )}

        {/* listings grid */}
        <div className="listings-grid">
          {paginatedListings.length > 0 ? (
            paginatedListings.map((listing, index) => (
              <a
                key={listing.id}
                href={`/home/listing/${listing.id}`}
                className="listing-card hover-lift"
                style={{ animation: `card-stagger 0.4s ease-out ${index * 0.05}s both` }}
              >
                <div className="listing-card-image">
                  <img src={listing.image} alt={listing.title} loading="lazy" />
                  <div className="listing-card-overlay" />

                  <div className="listing-card-badges">
                    {listing.verified && (
                      <span className="badge-verified">
                        <Verified className="w-3 h-3" /> Verified
                      </span>
                    )}
                    {listing.featured && (
                      <span className="badge-featured">Featured</span>
                    )}
                  </div>

                  <div className="listing-card-actions">
                    {listing.virtualTour && (
                      <button onClick={(e) => openTour(listing, e)} className="listing-card-vt tap-target" title="3D Virtual Tour">
                        <Eye />
                      </button>
                    )}
                    <button
                      onClick={(e) => toggleSave(listing.id, e)}
                      className={`listing-card-save tap-target ${savedListings.includes(listing.id) ? 'is-saved' : ''}`}
                    >
                      <Heart />
                    </button>
                  </div>

                  <div className="listing-card-hover-info">
                    <span className="listing-card-type">{listing.type}</span>
                    <div className="listing-card-rating">
                      <Star className="w-3 h-3" style={{ fill: '#FBBF24', color: '#FBBF24' }} /> {listing.rating}
                      <span>({listing.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="listing-card-body">
                  <div className="listing-card-top">
                    <div className="listing-card-info">
                      <h3 className="listing-card-title">{listing.title}</h3>
                      <div className="listing-card-location">
                        <MapPin /> {listing.location}
                      </div>
                    </div>
                    <div className="listing-card-price">
                      <span className="listing-card-price-amount">{listing.country === 'Nigeria' ? '₦' : '$'}{listing.price}</span>
                      <span className="listing-card-price-period">/{listing.country === 'Nigeria' ? 'year' : 'month'}</span>
                    </div>
                  </div>

                  <div className="listing-card-meta">
                    <span className="listing-card-meta-item">
                      <Bed /> {listing.beds} bed{listing.beds > 1 ? 's' : ''}
                    </span>
                    <span className="listing-card-meta-item">
                      <Bath /> {listing.baths} bath
                    </span>
                    <span className="listing-card-meta-divider">|</span>
                    <span className="listing-card-meta-distance">
                      <MapPin className="w-3 h-3" /> {listing.distance}
                    </span>
                  </div>

                  {listing.neighborhood && (
                    <div className="listing-card-scores">
                      <div className="listing-card-score">
                        <Shield className="listing-card-score-icon" />
                        <span>{listing.neighborhood.safety}/10</span>
                      </div>
                      <div className="listing-card-score">
                        <MapPin className="listing-card-score-icon" />
                        <span>{listing.neighborhood.campus}/10</span>
                      </div>
                      {listing.avgAreaPrice && (
                        <div className="listing-card-score">
                          <TrendingUp className="listing-card-score-icon" />
                          <span>{listing.avgAreaPrice}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="listings-empty">
              <div className="listings-empty-icon">
                <Search className="w-8 h-8" style={{ color: 'var(--navy-200)' }} />
              </div>
              <h3 className="listings-empty-title">No properties found</h3>
              <p className="listings-empty-text">Try adjusting your filters or search terms.</p>
              <button
                className="listings-empty-btn tap-target"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                  setLocation({ country: '', state: '', area: '' })
                  setSelectedBeds('Any')
                  setSelectedPrice('Any')
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* pagination */}
        {filteredListings.length > 0 && (
          <div className="pagination">
            <div className="pagination-inner">
              <button className="pagination-btn pagination-btn--prev tap-target" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>&larr; Prev</button>
              {pageNumbers.map((n, i) => n === '...' ? (
                <span key={`dots-${i}`} className="pagination-dots">···</span>
              ) : (
                <button key={n} className={`pagination-num tap-target ${n === currentPage ? 'is-active' : ''}`} onClick={() => goToPage(n)}>{n}</button>
              ))}
              <button className="pagination-btn pagination-btn--next tap-target" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next &rarr;</button>
            </div>
          </div>
        )}
      </div>

      <VirtualTour
        images={tourListing?.images || []}
        title={tourListing?.title || ''}
        isOpen={tourOpen}
        onClose={() => setTourOpen(false)}
      />
    </div>
  )
}
