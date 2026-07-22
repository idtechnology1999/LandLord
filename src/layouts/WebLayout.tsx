import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, X, ChevronDown, Building2, LogOut, User, Settings, Home, MapPin, Heart, MessageCircle, Sun, Moon, Globe } from 'lucide-react'
import AuthModal from '../components/AuthModal'
import AiAssistant from '../components/AiAssistant'
import { translations, type Lang } from '../data/translations'

export default function WebLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authPrompt, setAuthPrompt] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'en')
  const [langOpen, setLangOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  const t = translations[lang]

  const openAuth = (prompt?: string) => {
    setAuthPrompt(prompt || '')
    setAuthOpen(true)
  }

  const navItems = [
    { to: '/home', label: t.discover, icon: Home },
    { to: '/home/search', label: t.search, icon: Search },
    { to: '/home/map', label: t.mapView, icon: MapPin },
    { to: '/home/saved', label: t.saved, icon: Heart },
    { to: '/home/messages', label: t.messages, icon: MessageCircle, badge: 3 },
  ]

  return (
    <div className="app-container">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="sidebar-logo-text">
              Land<span>Lord</span>
            </span>
            <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="sidebar-nav-section">
          <p className="sidebar-nav-label">Browse</p>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const isActive = item.to === '/home' ? location.pathname === '/home' : location.pathname.startsWith(item.to)
              return (
                <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                  className={`sidebar-nav-item ${isActive ? 'is-active' : ''}`}>
                  <item.icon className={`sidebar-nav-icon ${isActive ? 'sidebar-nav-icon--active' : ''}`} />
                  <span className="sidebar-nav-label-text">{item.label}</span>
                  {item.badge && (
                    <span className="sidebar-nav-badge">{item.badge}</span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="sidebar-post-btn">
          <button onClick={() => isLoggedIn ? openAuth('Create a new listing') : navigate('/register')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Post Listing
          </button>
        </div>

        {/* Mobile-only utilities */}
        <div className="sidebar-mobile-utils">
          <p className="sidebar-mobile-utils-label">Settings</p>
          <div className="sidebar-mobile-utils-row">
            <button onClick={() => setDark(!dark)} className={dark ? 'sidebar-util--active' : ''}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
              {dark ? 'Light' : 'Dark'}
            </button>
            <button onClick={() => setLangOpen(!langOpen)} className={langOpen ? 'sidebar-util--active' : ''}>
              <Globe size={15} />
              {lang === 'en' ? 'English' : lang === 'yo' ? 'Yorùbá' : 'Français'}
            </button>
          </div>
          {langOpen && (
            <div className="sidebar-mobile-utils-row" style={{ marginTop: 4 }}>
              {(['en', 'yo', 'fr'] as Lang[]).map((l) => (
                <button key={l} onClick={() => { setLang(l); setLangOpen(false) }}
                  className={lang === l ? 'sidebar-util--active' : ''}
                  style={{ fontSize: 11, fontWeight: lang === l ? 700 : 400 }}>
                  {l === 'en' ? '🇬🇧 EN' : l === 'yo' ? '🇳🇬 YO' : '🇫🇷 FR'}
                </button>
              ))}
            </div>
          )}
          {!isLoggedIn && (
            <div className="sidebar-mobile-auth">
              <button className="sidebar-auth-signin" onClick={() => { setSidebarOpen(false); openAuth() }}>Sign In</button>
              <button className="sidebar-auth-signup" onClick={() => { setSidebarOpen(false); navigate('/register') }}>Sign Up</button>
            </div>
          )}
        </div>
      </aside>

      <div className="main-content">
        <header className="top-header">
          <div className="header-inner">
            <div className="header-left">
              <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn">
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <div className="header-right">
              <button onClick={() => setDark(!dark)} className="dark-mode-toggle" title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
                {dark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
              </button>
              <div className="relative">
                <button onClick={() => setLangOpen(!langOpen)} className="dark-mode-toggle" title="Change language">
                  <Globe className="w-[18px] h-[18px]" />
                </button>
                {langOpen && (
                  <>
                    <div className="profile-dropdown-overlay" onClick={() => setLangOpen(false)} />
                    <div className="profile-dropdown" style={{ right: 0, width: 140 }}>
                      {(['en', 'yo', 'fr'] as Lang[]).map((l) => (
                        <button key={l} onClick={() => { setLang(l); setLangOpen(false) }}
                          className={`profile-dropdown-item ${lang === l ? 'is-active' : ''}`}
                          style={{ fontWeight: lang === l ? 600 : 400, color: lang === l ? 'var(--coral-500)' : undefined }}>
                          {l === 'en' ? '🇬🇧 English' : l === 'yo' ? '🇳🇬 Yorùbá' : '🇫🇷 Français'}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              {isLoggedIn ? (
                <>
                  <button className="header-notif-btn">
                    <Bell className="w-[18px] h-[18px]" />
                    <span className="header-notif-dot" />
                  </button>
                  <div className="relative">
                    <button onClick={() => setProfileOpen(!profileOpen)} className="profile-btn">
                      <div className="profile-avatar">A</div>
                      <ChevronDown className="profile-chevron" />
                    </button>
                    {profileOpen && (
                      <>
                        <div className="profile-dropdown-overlay" onClick={() => setProfileOpen(false)} />
                        <div className="profile-dropdown">
                          <div className="profile-dropdown-header">
                            <p className="profile-dropdown-name">Adebayo Olawale</p>
                            <p className="profile-dropdown-email">adebayo@ui.edu.ng</p>
                          </div>
                          <NavLink to="/home/profile" onClick={() => setProfileOpen(false)} className="profile-dropdown-item"><User className="w-4 h-4" /> Profile</NavLink>
                          <NavLink to="/home/settings" onClick={() => setProfileOpen(false)} className="profile-dropdown-item"><Settings className="w-4 h-4" /> Settings</NavLink>
                          <div className="profile-dropdown-divider" />
                          <NavLink to="/" onClick={() => { setProfileOpen(false); setIsLoggedIn(false) }} className="profile-dropdown-item profile-dropdown-item--danger"><LogOut className="w-4 h-4" /> Sign Out</NavLink>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="auth-buttons">
                  <button onClick={() => openAuth()} className="auth-btn-signin">Sign In</button>
                  <button onClick={() => navigate('/register')} className="auth-btn-signup">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content-body">
          <Outlet context={{ openAuth, isLoggedIn, t }} />
        </main>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-grid">
              <div className="footer-brand">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, background: 'linear-gradient(to bottom right, var(--coral-400), var(--coral-500))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Land<span style={{ color: 'var(--coral-400)' }}>Lord</span></span>
                </div>
                <p>Connecting students with verified landlords. No agents, no hidden fees.</p>
              </div>
              <div className="footer-col">
                <h4>Explore</h4>
                <div className="footer-col-links">
                  <p>All Listings</p>
                  <p>Near UI Campus</p>
                  <p>Self-Contain</p>
                  <p>Shared Housing</p>
                </div>
              </div>
              <div className="footer-col">
                <h4>For Landlords</h4>
                <div className="footer-col-links">
                  <p>Post a Listing</p>
                  <p>Pricing</p>
                  <p>Landlord Guide</p>
                </div>
              </div>
              <div className="footer-col">
                <h4>Support</h4>
                <div className="footer-col-links">
                  <p>Help Center</p>
                  <p>Safety</p>
                  <p>Terms of Service</p>
                  <p>Privacy Policy</p>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2025 LandLord. All rights reserved.</p>
              <div className="footer-socials">
                <span>Twitter</span>
                <span>Instagram</span>
                <span>Facebook</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} prompt={authPrompt} />
      <AiAssistant />
    </div>
  )
}
