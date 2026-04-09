import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const normalizeRole = (value) => {
  const role = (value || '').toLowerCase()

  if (role === 'admin') {
    return 'admin'
  }

  if (role === 'expert') {
    return 'expert'
  }

  if (role === 'user' || role === 'public') {
    return 'user'
  }

  return 'farmer'
}

const getApiRole = (value) => {
  const normalized = normalizeRole(value)

  if (normalized === 'user') {
    return 'USER'
  }

  return normalized.toUpperCase()
}

function CreateAccountPage() {
  const [formState, setFormState] = useState({
    fullName: '',
    phone: '',
    email: '',
    location: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    role: 'farmer',
    password: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const redirectFromState = location.state?.from || ''

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    if (name === 'email') {
      setVerificationCode('')
      setVerificationSent(false)
      setEmailVerified(false)
      setVerificationMessage('')
    }
  }

const handleSendVerification = async () => {
  const { fullName, email, password, phone, location, role } = formState

  if (!fullName || !email || !password || !phone || !location || !role) {
    setErrorMessage('Please fill all required fields before verifying.')
    return
  }

  try {
    const res = await fetch("http://localhost:8081/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        phone,
        location,
        role: getApiRole(role)
      })
    })

    if (res.ok) {
      setVerificationSent(true)
      setEmailVerified(false)
      setVerificationMessage('OTP sent to your email 📩')
      setErrorMessage('')
    } else {
      const err = await res.text()

if (err.includes("already")) {
  setErrorMessage("This email is already registered. Please sign in.")
} else {
  setErrorMessage(err)
}
    }

  } catch (e) {
    console.log(e)
    setErrorMessage("Server error")
  }
}

 const handleVerifyEmail = async () => {

  if (!verificationCode.trim()) {
    setErrorMessage('Please enter the verification code.')
    return
  }

  try {
    const res = await fetch("http://localhost:8081/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formState.email,
        otp: verificationCode
      })
    })

    if (res.ok) {
      setEmailVerified(true)
      setErrorMessage('')
      setVerificationMessage('Email verified successfully ✅')
    } else {
      setErrorMessage('Invalid OTP.')
    }

  } catch {
    setErrorMessage('Server error')
  }
}
  const handleSubmit = (event) => {
    event.preventDefault()
    const {
      fullName,
      phone,
      email,
      location,
      address,
      city,
      state,
      zipCode,
      role,
      password,
    } = formState

    if (!fullName || !phone || !email || !location || !address || !city || !state || !zipCode || !password || !role) {
      setErrorMessage('Please fill all required fields to continue.')
      return
    }

    if (!emailVerified) {
      setErrorMessage('Please verify your email before creating an account.')
      return
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existingAccounts = JSON.parse(window.localStorage.getItem('agriconnect_accounts') || '[]')
    if (existingAccounts.some((account) => account.email.toLowerCase() === normalizedEmail)) {
      setErrorMessage('An account with this email already exists. Please sign in.')
      return
    }

    const selectedRole = normalizeRole(role)
    const accountRecord = {
      id: `USR-${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: normalizedEmail,
      location: location.trim(),
      address: {
        line1: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
      },
      role: selectedRole,
      password,
      createdAt: new Date().toISOString(),
    }

    window.localStorage.setItem('agriconnect_accounts', JSON.stringify([...existingAccounts, accountRecord]))

    setSubmitted(true)
    const userProfile = {
      id: accountRecord.id,
      fullName: accountRecord.fullName,
      phone: accountRecord.phone,
      email: accountRecord.email,
      location: accountRecord.location,
      address: accountRecord.address,
      role: selectedRole,
      signedInAt: new Date().toISOString(),
    }
    window.localStorage.setItem('agriconnectUser', JSON.stringify(userProfile))
    window.localStorage.setItem('agriconnectRole', selectedRole)
    window.localStorage.setItem('agriconnectToken', `agriconnect-${Date.now()}`)
    window.localStorage.removeItem('agriconnect_create_account_verify_email')
    const dashboardTarget = selectedRole === 'user' ? '/dashboard/user' : `/dashboard/${selectedRole}`
    const redirectTarget = redirectFromState || dashboardTarget
    setTimeout(() => navigate(redirectTarget), 1000)
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <Link className="back-link" to="/">
          Back to home
        </Link>
        <h1>Create Account</h1>
        <p>Set up your farm profile to unlock curated inputs and personalized advice.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', maxWidth: '1000px' }}>
        {/* Image Section */}
        <div style={{
          backgroundImage: 'linear-gradient(135deg, rgba(94, 122, 58, 0.7), rgba(94, 182, 47, 0.7)), url("https://images.unsplash.com/photo-1640503028192-e5ed1e4f5d38?auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '20px',
          height: '500px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: '32px',
          color: 'white',
          position: 'relative',
        }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', margin: 0 }}>Join 120k+ farmers</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>Growing better with smarter farming solutions</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="page-card">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
              <div className="success-banner">
                <p style={{ margin: 0, fontSize: '1.1rem' }}>Account created successfully!</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem' }}>Redirecting to your dashboard...</p>
              </div>
            </div>
          ) : (
            <form className="form-grid" onSubmit={handleSubmit}>
              <div>
                <h3 style={{ marginBottom: '24px' }}>Get started farming smarter</h3>
              </div>

              <label className="form-field">
                Full name
                <input
                  className="input"
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="form-field">
                Phone number
                <input
                  className="input"
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  placeholder="+91 90000 00000"
                  required
                />
              </label>

              <label className="form-field">
                Email address
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="name@farmmail.com"
                  required
                />
              </label>

              <label className="form-field">
                Role
                <select
                  className="input"
                  name="role"
                  value={formState.role}
                  onChange={handleChange}
                  required
                >
                  <option value="farmer">Farmer</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="expert">Expert</option>
                </select>
              </label>

              <button type="button" className="primary" onClick={handleSendVerification}>
                Verify Mail
              </button>

              {verificationSent && !emailVerified ? (
                <>
                  <label className="form-field">
                    Verification code
                    <input
                      className="input"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter the code sent to your email"
                    />
                    {errorMessage === 'Invalid OTP.' && (
  <p style={{ color: '#c62828', fontSize: '0.9rem', margin: 0 }}>
    Invalid OTP. Please try again.
  </p>
)}
                  </label>

                  <button type="button" className="primary" onClick={handleVerifyEmail}>
                    Confirm Mail
                  </button>
                </>
              ) : null}

              {emailVerified ? (
                <p style={{ margin: 0, color: '#2e7d32', fontWeight: 600 }}>Email verified.</p>
              ) : null}

              {verificationMessage ? (
                <p style={{ margin: 0, color: '#5c4a1f' }}>{verificationMessage}</p>
              ) : null}

              <label className="form-field">
                Location
                <input
                  className="input"
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={handleChange}
                  placeholder="Village / Town / District"
                  required
                />
              </label>

              <label className="form-field">
                Address
                <input
                  className="input"
                  type="text"
                  name="address"
                  value={formState.address}
                  onChange={handleChange}
                  placeholder="House/Farm address"
                  required
                />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label className="form-field">
                  City
                  <input
                    className="input"
                    type="text"
                    name="city"
                    value={formState.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    required
                  />
                </label>

                <label className="form-field">
                  State
                  <input
                    className="input"
                    type="text"
                    name="state"
                    value={formState.state}
                    onChange={handleChange}
                    placeholder="Your state"
                    required
                  />
                </label>
              </div>

              <label className="form-field">
                PIN code
                <input
                  className="input"
                  type="text"
                  name="zipCode"
                  value={formState.zipCode}
                  onChange={handleChange}
                  placeholder="6 digit PIN"
                  required
                />
              </label>

              <label className="form-field">
                Password
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  required
                />
              </label>

              <button className="primary" type="submit" style={{ marginTop: '8px' }}>
                Create account
              </button>

              {errorMessage ? (
                <p style={{ margin: 0, color: '#c62828', fontSize: '0.9rem' }}>{errorMessage}</p>
              ) : null}

              <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b6457', margin: '16px 0 0 0' }}>
                Already have an account?{' '}
                <Link to="/sign-in" style={{ color: '#5e7a3a', fontWeight: '600', textDecoration: 'underline' }}>
                  Sign in
                </Link>
              </p>

              <p style={{
                fontSize: '0.8rem',
                color: '#9a9288',
                margin: '16px 0 0 0',
                padding: '12px',
                background: 'rgba(94, 182, 47, 0.05)',
                borderRadius: '8px',
                borderLeft: '3px solid #5eb62f',
              }}>
                ✓ Your data is secure and only used to personalize your farming experience
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateAccountPage
