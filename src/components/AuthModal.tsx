import { useState } from 'react'
import { X, Eye, EyeOff, Building2, CheckCircle2, ArrowLeft } from 'lucide-react'

type AuthMode = 'login' | 'signup'
type AuthStep = 'choose' | 'form'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  defaultMode?: AuthMode
  prompt?: string
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'signup', prompt }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const [step, setStep] = useState<AuthStep>('choose')
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord'>('tenant')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', institution: '', agreeTerms: false,
  })

  const updateForm = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSuccess?.()
    onClose()
  }

  const handleGoogleAuth = () => {
    onSuccess?.()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal">
        <button onClick={onClose} className="modal-close">
          <X className="w-4 h-4" />
        </button>

        <div className="modal-body">
          {step === 'choose' ? (
            <>
              <div className="auth-header">
                <div className="auth-header-icon">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h2>Welcome to LandLord</h2>
                {prompt && <p className="auth-header-prompt">{prompt}</p>}
                <p>Sign in or create an account to continue</p>
              </div>

              <div className="role-selector">
                {(['tenant', 'landlord'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`role-card ${selectedRole === role ? 'is-selected' : ''} ${role === 'landlord' ? 'role-landlord' : ''}`}
                  >
                    <div className="role-card-icon">
                      {role === 'tenant' ? (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      ) : (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                      )}
                    </div>
                    <p className="role-card-title">{role}</p>
                    <p className="role-card-desc">{role === 'tenant' ? 'Find housing' : 'List properties'}</p>
                  </button>
                ))}
              </div>

              <div className="auth-actions">
                <button onClick={() => setStep('form')} className="btn-continue">
                  Continue as {selectedRole === 'tenant' ? 'Tenant' : 'Landlord'}
                </button>

                <div className="auth-divider">
                  <div className="auth-divider-line" />
                  <span className="auth-divider-text">or</span>
                  <div className="auth-divider-line" />
                </div>

                <button onClick={handleGoogleAuth} className="btn-google">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>

              <p className="auth-terms">
                By continuing, you agree to our{' '}
                <span className="auth-terms-link">Terms</span> and{' '}
                <span className="auth-terms-link">Privacy Policy</span>
              </p>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <button type="button" onClick={() => setStep('choose')} className="auth-back-btn">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="auth-form-header">
                <span className={`auth-role-badge ${selectedRole === 'tenant' ? 'auth-role-badge--tenant' : 'auth-role-badge--landlord'}`}>
                  {selectedRole === 'tenant' ? 'Tenant' : 'Landlord'}
                </span>
                <h2>
                  {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p>
                  {mode === 'signup'
                    ? selectedRole === 'tenant' ? 'Find verified housing near your campus' : 'Start listing your properties'
                    : 'Sign in to your account'}
                </p>
              </div>

              <div className="auth-form-fields">
                {mode === 'signup' && (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateForm('fullName', e.target.value)}
                    placeholder="Full Name"
                    className="auth-input"
                  />
                )}
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder={selectedRole === 'tenant' ? 'Student email (e.g. you@ui.edu.ng)' : 'Email address'}
                  className="auth-input"
                />
                {mode === 'signup' && (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="Phone number"
                    className="auth-input"
                  />
                )}
                <div className="auth-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    placeholder="Password"
                    className="auth-input"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-password-toggle">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'signup' && selectedRole === 'tenant' && (
                  <p className="auth-verify-hint">
                    <CheckCircle2 className="w-3 h-3" /> We'll verify your student status via this email
                  </p>
                )}
                {mode === 'signup' && (
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => updateForm('agreeTerms', e.target.checked)}
                    />
                    <span className="auth-checkbox-text">
                      I agree to <span className="auth-terms-link">Terms</span> and <span className="auth-terms-link">Privacy Policy</span>
                    </span>
                  </label>
                )}
                {mode === 'login' && (
                  <div className="auth-remember-row">
                    <label className="auth-remember-label">
                      <input type="checkbox" />
                      <span>Remember me</span>
                    </label>
                    <button type="button" className="auth-forgot">Forgot password?</button>
                  </div>
                )}
              </div>

              <button type="submit" className="btn-submit">
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </button>

              <p className="auth-switch">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button type="button" onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="auth-switch-btn">
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
