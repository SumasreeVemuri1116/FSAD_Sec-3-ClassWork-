import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchProfile,
  sendVerificationCode,
  updateProfile,
  verifyContact,
} from '../services/profileService'

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    addressLine1: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationChannel, setVerificationChannel] = useState('email')
  const [verificationHint, setVerificationHint] = useState('')
  const [otpState, setOtpState] = useState({
    email: { sentFor: '', verifiedFor: '' },
    phone: { sentFor: '', verifiedFor: '' },
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchProfile()
        setProfile(profileData)
        setFormState({
          fullName: profileData.fullName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          addressLine1: profileData.address?.line1 || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          zipCode: profileData.address?.zipCode || '',
        })
      } catch (loadError) {
        setError(loadError.message || 'Unable to load your profile right now.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="page-shell">
        <header className="page-header">
          <h1>Profile</h1>
          <p>Loading your profile...</p>
        </header>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-shell">
        <header className="page-header">
          <h1>Profile</h1>
          <p style={{ color: '#c62828' }}>{error}</p>
          <Link className="back-link" to="/sign-in">
            Go to sign in
          </Link>
        </header>
      </div>
    )
  }

  const address = profile?.address
  const addressLabel = [address?.line1, address?.city, address?.state, address?.zipCode]
    .filter(Boolean)
    .join(', ')

  const currentEmail = (profile?.email || '').trim().toLowerCase()
  const currentPhone = (profile?.phone || '').trim()
  const nextEmail = formState.email.trim().toLowerCase()
  const nextPhone = formState.phone.trim()
  const emailChanged = nextEmail !== currentEmail
  const phoneChanged = nextPhone !== currentPhone
  const emailReadyForOtp = /^\S+@\S+\.\S+$/.test(nextEmail)
  const phoneReadyForOtp = /^\d{10}$/.test(nextPhone.replace(/\D/g, ''))
  const emailVerifiedForValue = otpState.email.verifiedFor === nextEmail
  const phoneVerifiedForValue = otpState.phone.verifiedFor === nextPhone

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    if (name === 'email') {
      setOtpState((prev) => ({
        ...prev,
        email: { ...prev.email, verifiedFor: '' },
      }))
    }

    if (name === 'phone') {
      setOtpState((prev) => ({
        ...prev,
        phone: { ...prev.phone, verifiedFor: '' },
      }))
    }
  }

  const handleAutoSendOtp = async (channel) => {
    const recipient = channel === 'email' ? nextEmail : nextPhone
    if (!recipient) {
      return
    }

    if (channel === 'email' && (!emailChanged || !emailReadyForOtp || otpState.email.sentFor === recipient)) {
      return
    }

    if (channel === 'phone' && (!phoneChanged || !phoneReadyForOtp || otpState.phone.sentFor === recipient)) {
      return
    }

    setError('')
    setStatusMessage('')
    setVerificationChannel(channel)

    try {
      const response = await sendVerificationCode(channel, recipient)
      setOtpState((prev) => ({
        ...prev,
        [channel]: { ...prev[channel], sentFor: recipient },
      }))
      if (response?.code) {
        setVerificationHint(`Demo OTP for ${channel}: ${response.code}`)
      } else {
        setVerificationHint(`OTP sent to your ${channel}.`)
      }
      setStatusMessage(`Verification OTP sent to updated ${channel}.`)
    } catch (sendError) {
      setError(sendError.message || `Unable to send ${channel} verification code.`)
    }
  }

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setError('')
    setStatusMessage('')

    if (emailChanged && !emailVerifiedForValue) {
      setError('Please verify your updated email with OTP before saving.')
      return
    }

    if (phoneChanged && !phoneVerifiedForValue) {
      setError('Please verify your updated phone number with OTP before saving.')
      return
    }

    setIsSaving(true)

    try {
      const updated = await updateProfile({
        fullName: formState.fullName.trim(),
        email: nextEmail,
        phone: nextPhone,
        location: formState.location.trim(),
        emailVerified: emailChanged ? true : Boolean(profile?.emailVerified),
        phoneVerified: phoneChanged ? true : Boolean(profile?.phoneVerified),
        address: {
          line1: formState.addressLine1.trim(),
          city: formState.city.trim(),
          state: formState.state.trim(),
          zipCode: formState.zipCode.trim(),
        },
      })

      setProfile(updated)
  setIsEditing(false)
      setStatusMessage('Profile updated successfully.')
    } catch (saveError) {
      setError(saveError.message || 'Unable to save profile details.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendCode = async (channel) => {
    setError('')
    setStatusMessage('')
    setVerificationChannel(channel)

    const recipient = channel === 'email' ? nextEmail : nextPhone
    if (!recipient) {
      setError(`Please enter ${channel} first.`)
      return
    }

    try {
      const response = await sendVerificationCode(channel, recipient)
      setOtpState((prev) => ({
        ...prev,
        [channel]: { ...prev[channel], sentFor: recipient },
      }))
      if (response?.code) {
        setVerificationHint(`Demo OTP for ${channel}: ${response.code}`)
      } else {
        setVerificationHint('Verification code sent. Please check your inbox.')
      }
      setStatusMessage(`Verification code sent to your ${channel}.`)
    } catch (sendError) {
      setError(sendError.message || `Unable to send ${channel} verification code.`)
    }
  }

  const handleVerify = async () => {
    setError('')
    setStatusMessage('')

    const recipient = verificationChannel === 'email' ? nextEmail : nextPhone
    try {
      const updated = await verifyContact(verificationChannel, verificationCode.trim(), recipient)
      setProfile(updated)
      setOtpState((prev) => ({
        ...prev,
        [verificationChannel]: {
          ...prev[verificationChannel],
          verifiedFor: recipient,
        },
      }))
      setVerificationCode('')
      setStatusMessage(`${verificationChannel === 'email' ? 'Email' : 'Phone'} verified successfully.`)
    } catch (verifyError) {
      setError(verifyError.message || `Unable to verify ${verificationChannel}.`)
    }
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1>My Profile</h1>
        <p>Review and manage your account details.</p>
      </header>

      <section className="page-card" style={{ maxWidth: '720px' }}>
        <div style={{ display: 'grid', gap: '14px' }}>
          <p style={{ margin: 0 }}><strong>Name:</strong> {profile?.fullName || 'Not provided'}</p>
          <p style={{ margin: 0 }}><strong>Email:</strong> {profile?.email || 'Not provided'}</p>
          <p style={{ margin: 0 }}>
            <strong>Email status:</strong> {profile?.emailVerified ? 'Verified' : 'Not verified'}
          </p>
          <p style={{ margin: 0 }}><strong>Phone:</strong> {profile?.phone || 'Not provided'}</p>
          <p style={{ margin: 0 }}>
            <strong>Phone status:</strong> {profile?.phoneVerified ? 'Verified' : 'Not verified'}
          </p>
          <p style={{ margin: 0 }}><strong>Address:</strong> {addressLabel || 'Not provided'}</p>
          <p style={{ margin: 0 }}><strong>Location:</strong> {profile?.location || 'Not provided'}</p>
        </div>
        <div style={{ marginTop: '16px' }}>
          <button type="button" className="primary" onClick={() => setIsEditing((prev) => !prev)}>
            {isEditing ? 'Cancel edit' : 'Edit profile'}
          </button>
        </div>
      </section>

      {isEditing ? (
      <section className="page-card" style={{ maxWidth: '720px' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Edit profile</h3>
        <form onSubmit={handleProfileSave} style={{ display: 'grid', gap: '12px' }}>
          <label className="form-field">
            Full name
            <input className="input" name="fullName" value={formState.fullName} onChange={handleInputChange} required />
          </label>
          <label className="form-field">
            Email
            <input
              className="input"
              type="email"
              name="email"
              value={formState.email}
              onChange={handleInputChange}
              onBlur={() => handleAutoSendOtp('email')}
              required
            />
            {emailChanged && !emailVerifiedForValue ? (
              <small style={{ color: '#c62828' }}>Changed email requires OTP verification.</small>
            ) : null}
          </label>
          <label className="form-field">
            Phone
            <input
              className="input"
              name="phone"
              value={formState.phone}
              onChange={handleInputChange}
              onBlur={() => handleAutoSendOtp('phone')}
              required
            />
            {phoneChanged && !phoneVerifiedForValue ? (
              <small style={{ color: '#c62828' }}>Changed phone requires OTP verification.</small>
            ) : null}
          </label>
          <label className="form-field">
            Location
            <input className="input" name="location" value={formState.location} onChange={handleInputChange} placeholder="Village / Town / District" required />
          </label>
          <label className="form-field">
            Address
            <input className="input" name="addressLine1" value={formState.addressLine1} onChange={handleInputChange} required />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <label className="form-field">
              City
              <input className="input" name="city" value={formState.city} onChange={handleInputChange} required />
            </label>
            <label className="form-field">
              State
              <input className="input" name="state" value={formState.state} onChange={handleInputChange} required />
            </label>
            <label className="form-field">
              PIN code
              <input className="input" name="zipCode" value={formState.zipCode} onChange={handleInputChange} required />
            </label>
          </div>
          <button className="primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save profile'}
          </button>
        </form>
      </section>
      ) : null}

      <section className="page-card" style={{ maxWidth: '720px' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Verify account contacts</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <button type="button" className="ghost" onClick={() => handleSendCode('email')}>
            Send verification email
          </button>
          <button type="button" className="ghost" onClick={() => handleSendCode('phone')}>
            Send verification SMS
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select className="input" value={verificationChannel} onChange={(e) => setVerificationChannel(e.target.value)} style={{ maxWidth: '180px' }}>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
          <input
            className="input"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            style={{ maxWidth: '240px' }}
          />
          <button type="button" className="primary" onClick={handleVerify}>
            Verify
          </button>
        </div>

        {verificationHint ? <p style={{ marginTop: '10px', color: '#5c4a1f' }}>{verificationHint}</p> : null}
        {statusMessage ? <p style={{ marginTop: '10px', color: '#2e7d32' }}>{statusMessage}</p> : null}
        {error ? <p style={{ marginTop: '10px', color: '#c62828' }}>{error}</p> : null}
      </section>
    </div>
  )
}

export default ProfilePage
