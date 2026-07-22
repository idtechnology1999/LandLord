import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'

export default function SplashScreen() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    const timer = setTimeout(() => navigate('/home'), 2200)
    return () => { clearTimeout(t); clearTimeout(timer) }
  }, [navigate])

  return (
    <div className="splash-screen">
      <div className="splash-blobs">
        <div className="splash-blob-1" />
        <div className="splash-blob-2" />
      </div>

      <div className={`splash-content ${visible ? 'is-visible' : 'is-hidden'}`}>
        <div className="splash-icon">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="splash-title">
          Land<span>Lord</span>
        </h1>
      </div>
    </div>
  )
}
