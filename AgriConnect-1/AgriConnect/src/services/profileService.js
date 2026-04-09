const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const getToken = () => window.localStorage.getItem('agriconnectToken')

const getLocalProfile = () => {
  const rawUser = window.localStorage.getItem('agriconnectUser')
  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export async function fetchProfile() {
  const token = getToken()

  if (API_BASE_URL && token) {
    const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to load profile from API')
    }

    return response.json()
  }

  const fallbackProfile = getLocalProfile()
  if (!fallbackProfile) {
    throw new Error('No active user profile found')
  }

  return fallbackProfile
}

const persistLocalProfile = (profile) => {
  const updatedProfile = {
    ...profile,
    updatedAt: new Date().toISOString(),
  }

  window.localStorage.setItem('agriconnectUser', JSON.stringify(updatedProfile))

  const accountsRaw = window.localStorage.getItem('agriconnect_accounts')
  if (accountsRaw) {
    try {
      const accounts = JSON.parse(accountsRaw)
      if (Array.isArray(accounts)) {
        const nextAccounts = accounts.map((account) => {
          if (account.email?.toLowerCase() !== updatedProfile.email?.toLowerCase()) {
            return account
          }

          return {
            ...account,
            fullName: updatedProfile.fullName,
            phone: updatedProfile.phone,
            address: updatedProfile.address,
            emailVerified: updatedProfile.emailVerified,
            phoneVerified: updatedProfile.phoneVerified,
            updatedAt: updatedProfile.updatedAt,
          }
        })

        window.localStorage.setItem('agriconnect_accounts', JSON.stringify(nextAccounts))
      }
    } catch {
      // Ignore malformed account records in local mode.
    }
  }

  return updatedProfile
}

export async function updateProfile(payload) {
  const token = getToken()

  if (API_BASE_URL && token) {
    const response = await fetch(`${API_BASE_URL}/api/profile/me`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error('Failed to update profile')
    }

    return response.json()
  }

  const localProfile = getLocalProfile()
  if (!localProfile) {
    throw new Error('No active user profile found')
  }

  return persistLocalProfile({
    ...localProfile,
    ...payload,
    address: {
      ...(localProfile.address || {}),
      ...(payload.address || {}),
    },
  })
}

export async function sendVerificationCode(channel, recipient) {
  const token = getToken()

  if (API_BASE_URL && token) {
    const response = await fetch(`${API_BASE_URL}/api/profile/verification/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel, recipient }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send ${channel} verification code`)
    }

    return response.json()
  }

  const code = String(100000 + Math.floor(Math.random() * 900000))
  window.localStorage.setItem(
    `agriconnect_verify_${channel}`,
    JSON.stringify({ code, recipient: recipient || null, issuedAt: Date.now() }),
  )
  return { channel, code, recipient }
}

export async function verifyContact(channel, code, expectedRecipient) {
  const token = getToken()

  if (API_BASE_URL && token) {
    const response = await fetch(`${API_BASE_URL}/api/profile/verification/confirm`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel, code, recipient: expectedRecipient }),
    })

    if (!response.ok) {
      throw new Error(`Failed to verify ${channel}`)
    }

    return response.json()
  }

  const rawPayload = window.localStorage.getItem(`agriconnect_verify_${channel}`)
  if (!rawPayload) {
    throw new Error(`Invalid ${channel} verification code`)
  }

  let payload
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    payload = { code: rawPayload, recipient: null }
  }

  if (!payload?.code || payload.code !== code) {
    throw new Error(`Invalid ${channel} verification code`)
  }

  if (expectedRecipient && payload?.recipient && payload.recipient !== expectedRecipient) {
    throw new Error(`${channel} value changed after OTP was sent. Please request a new code.`)
  }

  const current = getLocalProfile()
  if (!current) {
    throw new Error('No active user profile found')
  }

  const key = channel === 'email' ? 'emailVerified' : 'phoneVerified'
  const updated = persistLocalProfile({ ...current, [key]: true })
  window.localStorage.removeItem(`agriconnect_verify_${channel}`)
  return updated
}
