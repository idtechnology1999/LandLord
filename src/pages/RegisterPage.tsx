import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Building2, ArrowLeft, Eye, EyeOff, CheckCircle2, User, Home, Mail, Phone, MapPin, Lock } from 'lucide-react'

type Role = 'tenant' | 'landlord'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<Role | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [step, setStep] = useState<'role' | 'form'>('role')

  const [tenantForm, setTenantForm] = useState({
    fullName: '', email: '', phone: '', institution: 'University of Ibadan', department: '', level: '', password: '', confirmPassword: '', agreeTerms: false,
  })

  const [landlordForm, setLandlordForm] = useState({
    fullName: '', email: '', phone: '', location: '', propertyCount: '', propertyType: '', password: '', confirmPassword: '', agreeTerms: false,
  })

  const updateTenant = (field: string, value: string | boolean) =>
    setTenantForm((p) => ({ ...p, [field]: value }))

  const updateLandlord = (field: string, value: string | boolean) =>
    setLandlordForm((p) => ({ ...p, [field]: value }))

  const handleSelectRole = (r: Role) => {
    setRole(r)
    setStep('form')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/home')
  }

  const isFormValid = role === 'tenant'
    ? tenantForm.fullName && tenantForm.email && tenantForm.phone && tenantForm.department && tenantForm.level && tenantForm.password && tenantForm.confirmPassword && tenantForm.agreeTerms && tenantForm.password === tenantForm.confirmPassword
    : landlordForm.fullName && landlordForm.email && landlordForm.phone && landlordForm.location && landlordForm.password && landlordForm.confirmPassword && landlordForm.agreeTerms && landlordForm.password === landlordForm.confirmPassword

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-brand">
          <Link to="/" className="register-brand-link">
            <div className="register-brand-icon">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="register-brand-text">Land<span>Lord</span></span>
          </Link>
        </div>

        {step === 'role' ? (
          <div className="register-card animate-fade-in">
            <div className="register-card-header">
              <h1>Create Your Account</h1>
              <p>Choose how you want to use LandLord</p>
            </div>

            <div className="register-role-grid">
              <button className="register-role-card tap-target" onClick={() => handleSelectRole('tenant')}>
                <div className="register-role-icon register-role-icon--tenant">
                  <User className="w-6 h-6" />
                </div>
                <h3>Student / Tenant</h3>
                <p>Find verified housing near your campus</p>
                <ul className="register-role-perks">
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> Browse verified listings</li>
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> Message landlords directly</li>
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> Save favourite properties</li>
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> Student email verification</li>
                </ul>
              </button>

              <button className="register-role-card register-role-card--landlord tap-target" onClick={() => handleSelectRole('landlord')}>
                <div className="register-role-icon register-role-icon--landlord">
                  <Home className="w-6 h-6" />
                </div>
                <h3>Landlord / Property Owner</h3>
                <p>List your properties and reach students</p>
                <ul className="register-role-perks">
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> List unlimited properties</li>
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> Verified landlord badge</li>
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> Direct tenant messaging</li>
                  <li><CheckCircle2 className="w-3.5 h-3.5" /> Analytics dashboard</li>
                </ul>
              </button>
            </div>

            <div className="register-divider">
              <div className="register-divider-line" />
              <span>or</span>
              <div className="register-divider-line" />
            </div>

            <button className="register-google-btn tap-target">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </button>

            <p className="register-footer-text">
              Already have an account? <Link to="/home" className="register-link">Sign In</Link>
            </p>
            <p className="register-terms-text">
              By signing up, you agree to our <span className="register-link">Terms</span> and <span className="register-link">Privacy Policy</span>
            </p>
          </div>
        ) : (
          <div className="register-card animate-fade-in">
            <button className="register-back-btn tap-target" onClick={() => setStep('role')}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="register-card-header">
              <span className={`register-role-badge ${role === 'tenant' ? 'register-role-badge--tenant' : 'register-role-badge--landlord'}`}>
                {role === 'tenant' ? 'Student / Tenant' : 'Landlord'}
              </span>
              <h1>{role === 'tenant' ? 'Student Registration' : 'Landlord Registration'}</h1>
              <p>{role === 'tenant' ? 'Fill in your details to find verified housing' : 'Fill in your details to start listing properties'}</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              {role === 'tenant' ? (
                <>
                  <div className="register-field">
                    <label>Full Name</label>
                    <div className="register-input-wrap">
                      <User className="register-input-icon" />
                      <input type="text" placeholder="e.g. Adebayo Olawale" value={tenantForm.fullName} onChange={(e) => updateTenant('fullName', e.target.value)} />
                    </div>
                  </div>
                  <div className="register-field">
                    <label>Student Email</label>
                    <div className="register-input-wrap">
                      <Mail className="register-input-icon" />
                      <input type="email" placeholder="you@ui.edu.ng" value={tenantForm.email} onChange={(e) => updateTenant('email', e.target.value)} />
                    </div>
                    <span className="register-field-hint"><CheckCircle2 className="w-3 h-3" /> We'll verify your student status via this email</span>
                  </div>
                  <div className="register-field-row">
                    <div className="register-field">
                      <label>Phone Number</label>
                      <div className="register-input-wrap">
                        <Phone className="register-input-icon" />
                        <input type="tel" placeholder="+234 ..." value={tenantForm.phone} onChange={(e) => updateTenant('phone', e.target.value)} />
                      </div>
                    </div>
                    <div className="register-field">
                      <label>Institution</label>
                      <div className="register-input-wrap">
                        <Building2 className="register-input-icon" />
                        <input type="text" value={tenantForm.institution} onChange={(e) => updateTenant('institution', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="register-field-row">
                    <div className="register-field">
                      <label>Department / Faculty</label>
                      <div className="register-input-wrap">
                        <input type="text" placeholder="e.g. Computer Science" value={tenantForm.department} onChange={(e) => updateTenant('department', e.target.value)} />
                      </div>
                    </div>
                    <div className="register-field">
                      <label>Level / Year</label>
                      <div className="register-input-wrap">
                        <select value={tenantForm.level} onChange={(e) => updateTenant('level', e.target.value)}>
                          <option value="">Select level</option>
                          <option value="100">100 Level</option>
                          <option value="200">200 Level</option>
                          <option value="300">300 Level</option>
                          <option value="400">400 Level</option>
                          <option value="500">500 Level</option>
                          <option value="postgrad">Postgraduate</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="register-field">
                    <label>Full Name / Business Name</label>
                    <div className="register-input-wrap">
                      <User className="register-input-icon" />
                      <input type="text" placeholder="e.g. Adewale Properties" value={landlordForm.fullName} onChange={(e) => updateLandlord('fullName', e.target.value)} />
                    </div>
                  </div>
                  <div className="register-field-row">
                    <div className="register-field">
                      <label>Email Address</label>
                      <div className="register-input-wrap">
                        <Mail className="register-input-icon" />
                        <input type="email" placeholder="you@example.com" value={landlordForm.email} onChange={(e) => updateLandlord('email', e.target.value)} />
                      </div>
                    </div>
                    <div className="register-field">
                      <label>Phone Number</label>
                      <div className="register-input-wrap">
                        <Phone className="register-input-icon" />
                        <input type="tel" placeholder="+234 ..." value={landlordForm.phone} onChange={(e) => updateLandlord('phone', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="register-field">
                    <label>Primary Property Location</label>
                    <div className="register-input-wrap">
                      <MapPin className="register-input-icon" />
                      <input type="text" placeholder="e.g. Agbowo, Ibadan" value={landlordForm.location} onChange={(e) => updateLandlord('location', e.target.value)} />
                    </div>
                  </div>
                  <div className="register-field-row">
                    <div className="register-field">
                      <label>Number of Properties</label>
                      <div className="register-input-wrap">
                        <select value={landlordForm.propertyCount} onChange={(e) => updateLandlord('propertyCount', e.target.value)}>
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2-5">2 - 5</option>
                          <option value="6-10">6 - 10</option>
                          <option value="10+">10+</option>
                        </select>
                      </div>
                    </div>
                    <div className="register-field">
                      <label>Property Type</label>
                      <div className="register-input-wrap">
                        <select value={landlordForm.propertyType} onChange={(e) => updateLandlord('propertyType', e.target.value)}>
                          <option value="">Select type</option>
                          <option value="selfcontain">Self-Contain</option>
                          <option value="room-parlour">Room & Parlour</option>
                          <option value="2bedroom">2-Bedroom</option>
                          <option value="shared">Shared Housing</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="register-field-row">
                <div className="register-field">
                  <label>Password</label>
                  <div className="register-input-wrap">
                    <Lock className="register-input-icon" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Create password" value={role === 'tenant' ? tenantForm.password : landlordForm.password} onChange={(e) => role === 'tenant' ? updateTenant('password', e.target.value) : updateLandlord('password', e.target.value)} />
                    <button type="button" className="register-pw-toggle tap-target" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="register-field">
                  <label>Confirm Password</label>
                  <div className="register-input-wrap">
                    <Lock className="register-input-icon" />
                    <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm password" value={role === 'tenant' ? tenantForm.confirmPassword : landlordForm.confirmPassword} onChange={(e) => role === 'tenant' ? updateTenant('confirmPassword', e.target.value) : updateLandlord('confirmPassword', e.target.value)} />
                    <button type="button" className="register-pw-toggle tap-target" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {role === 'tenant' && tenantForm.confirmPassword && tenantForm.password !== tenantForm.confirmPassword && (
                <p className="register-error">Passwords do not match</p>
              )}
              {role === 'landlord' && landlordForm.confirmPassword && landlordForm.password !== landlordForm.confirmPassword && (
                <p className="register-error">Passwords do not match</p>
              )}

              <label className="register-checkbox">
                <input
                  type="checkbox"
                  checked={role === 'tenant' ? tenantForm.agreeTerms : landlordForm.agreeTerms}
                  onChange={(e) => role === 'tenant' ? updateTenant('agreeTerms', e.target.checked) : updateLandlord('agreeTerms', e.target.checked)}
                />
                <span>I agree to the <span className="register-link">Terms of Service</span> and <span className="register-link">Privacy Policy</span></span>
              </label>

              <button type="submit" className="register-submit-btn tap-target" disabled={!isFormValid}>
                {role === 'tenant' ? 'Create Student Account' : 'Create Landlord Account'}
              </button>

              <p className="register-footer-text">
                Already have an account? <Link to="/home" className="register-link">Sign In</Link>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
