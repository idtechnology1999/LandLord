import { useOutletContext } from 'react-router-dom'
import { Heart, MapPin, Bed, Bath, Star, Verified, ArrowRight } from 'lucide-react'
import { allListings } from '../data/listings'

type ContextType = { openAuth: (prompt?: string) => void; isLoggedIn: boolean }

export default function SavedPage() {
  const { openAuth, isLoggedIn } = useOutletContext<ContextType>()

  if (!isLoggedIn) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <div className="empty-state-icon" style={{ background: 'linear-gradient(135deg, var(--coral-100), var(--coral-50))' }}>
            <Heart className="w-8 h-8" style={{ color: 'var(--coral-500)' }} />
          </div>
          <h2 className="empty-state-title">Save your favourites</h2>
          <p className="empty-state-text">Tap the heart icon on any listing to save it here for easy access later.</p>
          <button onClick={() => openAuth('Sign in to save listings')} className="empty-state-btn tap-target">
            Sign In to Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const saved = allListings.slice(0, 3)

  return (
    <div className="page-content">
      <div className="page-inner">
        <div className="page-header">
          <h1 className="page-title">Saved Properties</h1>
          <p className="page-subtitle">{saved.length} properties saved</p>
        </div>
        <div className="listings-grid">
          {saved.map((listing) => (
            <a key={listing.id} href={`/home/listing/${listing.id}`} className="listing-card hover-lift">
              <div className="listing-card-image">
                <img src={listing.image} alt={listing.title} loading="lazy" />
                <div className="listing-card-overlay" />
                <div className="listing-card-badges">
                  {listing.verified && <span className="badge-verified"><Verified className="w-3 h-3" /> Verified</span>}
                </div>
                <button className="listing-card-save is-saved"><Heart /></button>
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
                  <span className="listing-card-meta-distance"><Star className="w-3 h-3" style={{ fill: '#FBBF24', color: '#FBBF24' }} /> {listing.rating}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
