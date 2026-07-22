import { useState, useRef, useCallback, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface VirtualTourProps {
  images: string[]
  title: string
  isOpen: boolean
  onClose: () => void
}

export default function VirtualTour({ images, title, isOpen, onClose }: VirtualTourProps) {
  const [current, setCurrent] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const panStart = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const resetView = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setCurrent(0)
      resetView()
    }
  }, [isOpen, resetView])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setCurrent((p) => (p - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setCurrent((p) => (p + 1) % images.length)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, images.length, onClose])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    panStart.current = { ...pan }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    setPan({
      x: panStart.current.x + (e.clientX - dragStart.current.x),
      y: panStart.current.y + (e.clientY - dragStart.current.y),
    })
  }

  const handlePointerUp = () => setIsDragging(false)

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.15 : 0.15
    setZoom((prev) => {
      const next = Math.min(3, Math.max(1, prev + delta))
      if (next <= 1) setPan({ x: 0, y: 0 })
      return next
    })
  }

  const zoomIn = () => setZoom((z) => Math.min(3, z + 0.5))
  const zoomOut = () => {
    setZoom((z) => {
      const next = Math.max(1, z - 0.5)
      if (next <= 1) setPan({ x: 0, y: 0 })
      return next
    })
  }

  if (!isOpen) return null

  return (
    <div className="vt-overlay">
      <div className="vt-backdrop" onClick={onClose} />

      <div className="vt-container">
        <div className="vt-header">
          <div className="vt-header-left">
            <span className="vt-badge">360° Virtual Tour</span>
            <h3 className="vt-title">{title}</h3>
          </div>
          <div className="vt-header-right">
            <span className="vt-counter">{current + 1} / {images.length}</span>
            <button className="vt-close tap-target" onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="vt-viewport"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <img
            src={images[current]}
            alt={`${title} - Room ${current + 1}`}
            className="vt-image"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            }}
            draggable={false}
          />

          {zoom <= 1 && images.length > 1 && (
            <>
              <button className="vt-nav vt-nav-prev tap-target" onClick={() => { setCurrent((p) => (p - 1 + images.length) % images.length); resetView() }}>
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button className="vt-nav vt-nav-next tap-target" onClick={() => { setCurrent((p) => (p + 1) % images.length); resetView() }}>
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {zoom > 1 && (
            <div className="vt-zoom-hint">Drag to pan · Scroll to zoom</div>
          )}
        </div>

        <div className="vt-controls">
          <div className="vt-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                className={`vt-thumb tap-target ${i === current ? 'is-active' : ''}`}
                onClick={() => { setCurrent(i); resetView() }}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>
          <div className="vt-zoom-controls">
            <button className="vt-zoom-btn tap-target" onClick={zoomOut} disabled={zoom <= 1}>
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="vt-zoom-level">{Math.round(zoom * 100)}%</span>
            <button className="vt-zoom-btn tap-target" onClick={zoomIn} disabled={zoom >= 3}>
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="vt-zoom-btn tap-target" onClick={resetView}>
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
