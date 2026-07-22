import { useParams, useOutletContext } from 'react-router-dom'
import { Heart, Star, MapPin, Bed, Bath, Maximize, CheckCircle2, ArrowLeft, Share2, Shield, Clock, MessageCircle, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { useState } from 'react'
import { allListings } from '../data/listings'
import VirtualTour from '../components/VirtualTour'

type ContextType = { openAuth: (prompt?: string) => void }

const fallback = { id: 0, title: 'Property', price: '0', beds: 1, baths: 1, type: 'Apartment', distance: '5 min walk', verified: false, rating: 4.5, reviews: 0, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop', images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop'], landlord: 'Landlord', landlordInitial: 'L', location: 'Ibadan', country: 'Nigeria', state: 'Oyo', area: 'Bodija', lat: 0, lng: 0, featured: false, virtualTour: false, description: 'A great property for students.', amenities: [], availableFrom: 'September 2025', leaseTerm: 'Academic Year', responseTime: 'Responds in 1hr' }

export default function ListingDetail() {
  const { id } = useParams()
  const { openAuth } = useOutletContext<ContextType>()
  const found = allListings.find((l) => l.id === Number(id))
  const listing = found || { ...fallback, id: Number(id) }
  const [saved, setSaved] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [showVT, setShowVT] = useState(false)

  const nextImage = () => {
    if (listing.images.length > 1) {
      setActiveImage((prev) => (prev + 1) % listing.images.length)
    }
  }

  const prevImage = () => {
    if (listing.images.length > 1) {
      setActiveImage((prev) => (prev - 1 + listing.images.length) % listing.images.length)
    }
  }

  return (
    <div className="page-content">
      <div className="listing-detail">
        <button onClick={() => window.history.back()} className="listing-detail-back tap-target">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>

        <div className="listing-detail-grid">
          <div>
            <div className="gallery">
              <div className="gallery-main">
                <img src={listing.images[activeImage] || listing.image} alt={listing.title} />
                {listing.verified && (
                  <span className="gallery-verified">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Listing
                  </span>
                )}
                <div className="gallery-actions">
                  {listing.virtualTour && (
                    <button onClick={() => setShowVT(true)} className="gallery-action-btn tap-target gallery-vt-btn">
                      <Eye />
                    </button>
                  )}
                  <button onClick={() => { if (!saved) { openAuth('Sign in to save listings'); return } setSaved(false) }}
                    className={`gallery-action-btn tap-target ${saved ? 'is-saved' : ''}`}>
                    <Heart />
                  </button>
                  <button className="gallery-action-btn tap-target">
                    <Share2 />
                  </button>
                </div>
                {listing.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="gallery-nav-btn gallery-nav-prev tap-target">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} className="gallery-nav-btn gallery-nav-next tap-target">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="gallery-counter">{activeImage + 1} / {listing.images.length}</div>
                  </>
                )}
              </div>
              {listing.images.length > 1 && (
                <div className="gallery-thumbs">
                  {listing.images.map((img: string, i: number) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`gallery-thumb tap-target ${activeImage === i ? 'is-active' : ''}`}>
                      <img src={img} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="listing-info-card">
              <div className="listing-info-header">
                <div>
                  <h1 className="listing-info-title">{listing.title}</h1>
                  <div className="listing-info-meta">
                    <span className="listing-info-meta-item">
                      <MapPin /> {listing.location}
                    </span>
                    <span className="listing-info-meta-dot">·</span>
                    <span className="listing-info-meta-distance">{listing.distance}</span>
                    <span className="listing-info-meta-dot">·</span>
                    <span className="listing-info-meta-rating">
                      <Star className="w-3.5 h-3.5" />
                      <strong>{listing.rating}</strong>
                      <span>({listing.reviews})</span>
                    </span>
                  </div>
                </div>
                <div className="listing-info-price-block">
                  <p className="listing-info-price">₦{listing.price}</p>
                  <p className="listing-info-price-period">/year</p>
                </div>
              </div>

              <div className="listing-info-features">
                {[
                  { icon: Bed, label: `${listing.beds} Bedroom${listing.beds > 1 ? 's' : ''}` },
                  { icon: Bath, label: `${listing.baths} Bathroom` },
                  { icon: Maximize, label: listing.type },
                ].map((item, i) => (
                  <div key={i} className="listing-feature">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="listing-section">
                <h3 className="listing-section-title">About this property</h3>
                <p className="listing-section-text">{listing.description}</p>
              </div>

              {listing.amenities.length > 0 && (
                <div className="listing-section">
                  <h3 className="listing-section-title">Amenities</h3>
                  <div className="amenities-grid">
                    {listing.amenities.map((amenity: any) => (
                      <div key={amenity.name} className="amenity-item tap-target">
                        <amenity.icon className="w-4 h-4" /> {amenity.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="listing-detail-grid-2">
                {[
                  { icon: Clock, label: 'Available From', value: listing.availableFrom },
                  { icon: Shield, label: 'Lease Term', value: listing.leaseTerm },
                ].map((item, i) => (
                  <div key={i} className="detail-info-box">
                    <item.icon className="w-4 h-4" />
                    <div>
                      <p className="detail-info-label">{item.label}</p>
                      <p className="detail-info-value">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="booking-card">
              <div className="booking-price-block">
                <p className="booking-price">₦{listing.price}<span className="booking-price-period">/year</span></p>
                <p className="booking-note">Fixed rent for the full academic year</p>
              </div>

              <button onClick={() => openAuth('Sign in to rent this property')} className="btn-rent tap-target">
                Rent This Property
              </button>
              <button onClick={() => openAuth('Sign in to message the landlord')} className="btn-message tap-target">
                <MessageCircle className="w-4 h-4" /> Message Landlord
              </button>

              <div className="landlord-card">
                <div className="landlord-info">
                  <div className="landlord-avatar">{listing.landlordInitial}</div>
                  <div>
                    <p className="landlord-name">{listing.landlord}</p>
                    <div className="landlord-status">
                      <span className="landlord-status-dot" />
                      <p className="landlord-status-text">{listing.responseTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="trust-items">
                {[
                  { icon: Shield, title: 'Rent Protection', desc: 'Your rent is fixed for the full year. No increases.' },
                  { icon: CheckCircle2, title: 'Secure Payments', desc: 'All payments through the platform with receipts.' },
                ].map((item, i) => (
                  <div key={i} className="trust-item">
                    <item.icon className="w-4 h-4" />
                    <div>
                      <p className="trust-item-title">{item.title}</p>
                      <p className="trust-item-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showVT && <VirtualTour images={listing.images} title={listing.title} isOpen={showVT} onClose={() => setShowVT(false)} />}
    </div>
  )
}
