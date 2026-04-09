import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

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

const getDashboardPathForRole = (role) => {
  const normalized = normalizeRole(role)
  if (normalized === 'user') {
    return '/dashboard/user'
  }
  return `/dashboard/${normalized}`
}

function SignInPage() {

  const [formState, setFormState] = useState({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const redirectFromQuery = searchParams.get('redirect')
  const redirectTarget = redirectFromQuery || location.state?.from || ''
  const loginMessage = searchParams.get('message') || location.state?.message || ''

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  // ✅ LOGIN
  const handleSubmit = async (event) => {

    event.preventDefault()

    if (!formState.email || !formState.password) {
      setErrorMessage('Please enter email and password.')
      return
    }

    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login failed")
        return
      }

      setSubmitted(true)

      const normalizedRole = normalizeRole(data.role)

      localStorage.setItem("agriconnectUser", JSON.stringify(data))
      localStorage.setItem("agriconnectToken", data.token)
      localStorage.setItem("agriconnectRole", normalizedRole)

      const nextPath = redirectTarget || getDashboardPathForRole(normalizedRole)
      setTimeout(() => navigate(nextPath), 1000)

    } catch (error) {
      setErrorMessage("Server error")
    }
  }

  return (
    <div className="page-shell">

      <header className="page-header">
        <Link className="back-link" to="/">Back to home</Link>
        <h1>Sign In</h1>
        <p>Access your dashboard and services.</p>

        {loginMessage && (
          <p style={{ color: 'green' }}>{loginMessage}</p>
        )}
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr', 
        gap: '40px',
        alignItems: 'center',
        maxWidth: '1000px'
      }}>

        <div className="page-card">

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <h2>✅ Login Successful</h2>
            </div>
          ) : (

            <form className="form-grid" onSubmit={handleSubmit}>

              <h3>Welcome back</h3>

              {/* EMAIL */}
              <label className="form-field">
                Email
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                />
              </label>

              {/* PASSWORD */}
              <label className="form-field">
                Password
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={formState.password}
                  onChange={handleChange}
                  required
                />
              </label>

              {/* LOGIN */}
              <button type="submit" className="primary">
                Login
              </button>

              {errorMessage && (
                <p style={{ color: 'red' }}>{errorMessage}</p>
              )}

              <p>
                Don't have an account? <Link to="/create-account">Register</Link>
              </p>

            </form>

          )}

        </div>

        <div style={{
          background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
          borderRadius: '20px',
          height: '400px'
        }}></div>

      </div>

    </div>
  )
}

export default SignInPage