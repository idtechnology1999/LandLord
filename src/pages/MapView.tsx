import { useState } from 'react'
import { MapPin, Bed, Bath, Star, Verified, List, Navigation } from 'lucide-react'
import { allListings } from '../data/listings'

export default function MapView() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [listView, setListView] = useState(false)

  const selected = allListings.find((l) => l.id === selectedId)

  return (
    <div className="page-content">
      <div className="map-page">
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-placeholder-inner">
              <Navigation className="w-10 h-10" style={{ color: 'var(--coral-400)' }} />
              <h3>Map View</h3>
              <p>Interactive map showing properties near University of Ibadan</p>
            </div>
            {allListings.map((listing) => (
              <button
                key={listing.id}
                onClick={() => setSelectedId(listing.id === selectedId ? null : listing.id)}
                className={`map-pin ${selectedId === listing.id ? 'map-pin--active' : ''} tap-target`}
                style={{
                  left: `${((listing.lng - 3.8880) / 0.025) * 100}%`,
                  top: `${((7.4600 - listing.lat) / 0.025) * 100}%`,
                }}
              >
                <span className="map-pin-price">₦{(Number(listing.price.replace(/,/g, '')) / 1000).toFixed(0)}k</span>
              </button>
            ))}
          </div>

          <div className="map-toggle-bar">
            <button onClick={() => setListView(!listView)} className="map-toggle-btn tap-target">
              {listView ? <MapPin className="w-4 h-4" /> : <List className="w-4 h-4" />}
              {listView ? 'Map' : 'List'}
            </button>
          </div>
        </div>

        {selected && (
          <div className="map-detail-panel" style={{ animation: 'slide-in-right 0.25s ease-out' }}>
            <button onClick={() => setSelectedId(null)} className="map-detail-close tap-target">✕</button>
            <a href={`/home/listing/${selected.id}`} className="map-detail-card">
              <img src={selected.image} alt={selected.title} className="map-detail-img" />
              <div className="map-detail-body">
                <div className="map-detail-top">
                  <div>
                    <h3 className="map-detail-title">{selected.title}</h3>
                    <div className="map-detail-location"><MapPin className="w-3 h-3" /> {selected.location}</div>
                  </div>
                  <div className="map-detail-price">
                    <span>₦{selected.price}</span>
                    <small>/year</small>
                  </div>
                </div>
                <div className="map-detail-meta">
                  <span><Bed className="w-3.5 h-3.5" /> {selected.beds}</span>
                  <span><Bath className="w-3.5 h-3.5" /> {selected.baths}</span>
                  <span><Star className="w-3.5 h-3.5" style={{ fill: '#FBBF24', color: '#FBBF24' }} /> {selected.rating}</span>
                  {selected.verified && <span><Verified className="w-3.5 h-3.5" style={{ color: 'var(--green-500)' }} /> Verified</span>}
                </div>
              </div>
            </a>
          </div>
        )}

        {listView && (
          <div className="map-list-panel">
            {allListings.map((listing) => (
              <a key={listing.id} href={`/home/listing/${listing.id}`} className="map-list-item tap-target">
                <img src={listing.image} alt={listing.title} className="map-list-img" />
                <div className="map-list-info">
                  <h4>{listing.title}</h4>
                  <p className="map-list-location"><MapPin className="w-3 h-3" /> {listing.location}</p>
                  <div className="map-list-meta">
                    <span>{listing.beds} bed</span>
                    <span>{listing.baths} bath</span>
                    <span>⭐ {listing.rating}</span>
                  </div>
                </div>
                <div className="map-list-price">₦{listing.price}<small>/yr</small></div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
