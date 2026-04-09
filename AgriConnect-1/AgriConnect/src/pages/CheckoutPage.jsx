import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const formatCurrency = (amount) => `₹${amount.toLocaleString('en-IN')}`
const isUserAuthenticated = () => Boolean(localStorage.getItem('agriconnectUser'))
const MAX_CARD_YEARS_AHEAD = 20

const parseExpiryDate = (value) => {
  const match = value.match(/^(\d{2})\/(\d{2})$/)
  if (!match) {
    return null
  }

  const month = Number.parseInt(match[1], 10)
  const year = 2000 + Number.parseInt(match[2], 10)

  return { month, year }
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState('payment') // payment, review
  const [profileDetails, setProfileDetails] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [formState, setFormState] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
  })
  const [errors, setErrors] = useState({})

  const subtotal = getTotalPrice()
  const shipping = subtotal > 0 ? 120 : 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (!isUserAuthenticated()) {
      window.alert('Please login to continue')
      navigate('/sign-in', { state: { from: '/checkout', message: 'Please login to continue' } })
      return
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem('agriconnectUser') || 'null')
      if (!storedUser) {
        navigate('/sign-in', { state: { from: '/checkout', message: 'Please login to continue' } })
        return
      }

      setProfileDetails(storedUser)
    } catch {
      navigate('/sign-in', { state: { from: '/checkout', message: 'Please login to continue' } })
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validatePaymentInfo = () => {
    const newErrors = {}
    if (paymentMethod === 'card') {
      if (!formState.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
      else if (!/^\d{16}$/.test(formState.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits'
      if (!formState.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'
      else {
        const parsedExpiry = parseExpiryDate(formState.expiryDate)
        if (!parsedExpiry) {
          newErrors.expiryDate = 'Format must be MM/YY'
        } else if (parsedExpiry.month < 1 || parsedExpiry.month > 12) {
          newErrors.expiryDate = 'Month must be between 01 and 12'
        } else {
          const now = new Date()
          const currentMonth = now.getMonth() + 1
          const currentYear = now.getFullYear()
          const maxAllowedYear = currentYear + MAX_CARD_YEARS_AHEAD

          if (
            parsedExpiry.year < currentYear
            || (parsedExpiry.year === currentYear && parsedExpiry.month < currentMonth)
          ) {
            newErrors.expiryDate = 'Card has expired. Enter a current or future month.'
          } else if (parsedExpiry.year > maxAllowedYear) {
            newErrors.expiryDate = `Year must be within ${MAX_CARD_YEARS_AHEAD} years`
          }
        }
      }
      if (!formState.cvv.trim()) newErrors.cvv = 'CVV is required'
      else if (!/^\d{3,4}$/.test(formState.cvv)) newErrors.cvv = 'CVV must be 3-4 digits'
    } else if (paymentMethod === 'upi') {
      if (!formState.upiId.trim()) newErrors.upiId = 'UPI ID is required'
      else if (!/^[\w.-]+@[\w.-]+$/.test(formState.upiId)) newErrors.upiId = 'Invalid UPI ID format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep === 'payment') {
      if (validatePaymentInfo()) setCurrentStep('review')
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 'review') setCurrentStep('payment')
  }

  const handlePlaceOrder = () => {
    if (!isUserAuthenticated()) {
      window.alert('Please login to continue')
      navigate('/sign-in', { state: { from: '/checkout', message: 'Please login to continue' } })
      return
    }

    // Save order details to localStorage for success page
    const orderDetails = {
      id: `ORD-${Date.now()}`,
      customerName: profileDetails?.fullName || 'Customer',
      email: profileDetails?.email || '',
      phone: profileDetails?.phone || '',
      address: [
        profileDetails?.address?.line1,
        profileDetails?.address?.city,
        profileDetails?.address?.state,
        profileDetails?.address?.zipCode,
      ].filter(Boolean).join(', '),
      items: items,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      paymentMethod: paymentMethod,
      orderDate: new Date().toLocaleDateString(),
      orderTime: new Date().toLocaleTimeString(),
    }

    localStorage.setItem('lastOrder', JSON.stringify(orderDetails))
    clearCart()
    navigate('/order-success')
  }

  if (items.length === 0) {
    return (
      <div className="page-shell">
        <header className="page-header">
          <Link className="back-link" to="/">
            Back to home
          </Link>
          <h1>Checkout</h1>
        </header>
        <div className="page-card">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add items to proceed with checkout.</p>
            <button className="primary" onClick={() => navigate('/categories')} style={{ marginTop: '20px' }}>
              Browse products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <Link className="back-link" to="/cart">
          Back to cart
        </Link>
        <h1>Checkout</h1>
        <p>Complete your order in a few simple steps.</p>
        <div className="page-actions" style={{ marginTop: '12px' }}>
          <button className="ghost" onClick={() => navigate('/cart')}>Cart</button>
          <button className="ghost" onClick={() => navigate('/products')}>Products</button>
          <button className="ghost" onClick={() => navigate('/wishlist')}>Wishlist</button>
          <button className="ghost" onClick={() => navigate('/')}>Home</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px' }}>
        {/* Left Column - Form */}
        <div>
          {/* Delivery Information (Read-only from profile) */}
          <div className="page-card">
            <h3 style={{ marginBottom: '16px' }}>Saved Delivery Information</h3>
            <p style={{ margin: '4px 0', fontSize: '0.95rem' }}><strong>Name:</strong> {profileDetails?.fullName || 'Not provided'}</p>
            <p style={{ margin: '4px 0', fontSize: '0.95rem' }}><strong>Email:</strong> {profileDetails?.email || 'Not provided'}</p>
            <p style={{ margin: '4px 0', fontSize: '0.95rem' }}><strong>Phone:</strong> {profileDetails?.phone || 'Not provided'}</p>
            <p style={{ margin: '4px 0', fontSize: '0.95rem' }}>
              <strong>Address:</strong> {[profileDetails?.address?.line1, profileDetails?.address?.city, profileDetails?.address?.state, profileDetails?.address?.zipCode].filter(Boolean).join(', ') || 'Not provided'}
            </p>
            {!profileDetails?.address?.line1 ? (
              <button type="button" className="ghost" onClick={() => navigate('/create-account')} style={{ marginTop: '12px' }}>
                Complete profile details
              </button>
            ) : null}
          </div>

          {/* Step 1: Payment Information */}
          <div className="page-card" style={{ display: currentStep === 'payment' ? 'block' : 'none' }}>
            <h3 style={{ marginBottom: '24px' }}>Step 1: Payment Method</h3>
            <form className="form-grid" onSubmit={(e) => { e.preventDefault(); handleNextStep() }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <label style={{ flex: 1, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: '600' }}>Credit/Debit Card</span>
                </label>
                <label style={{ flex: 1, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontWeight: '600' }}>UPI</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <>
                  <label className="form-field">
                    Card Number
                    <input
                      className="input"
                      type="text"
                      name="cardNumber"
                      value={formState.cardNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, '')
                        if (value.length <= 16) {
                          setFormState((prev) => ({ ...prev, cardNumber: value }))
                          if (errors.cardNumber) {
                            setErrors((prev) => ({ ...prev, cardNumber: '' }))
                          }
                        }
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                    {errors.cardNumber && <span style={{ color: '#d32f2f', fontSize: '0.85rem' }}>{errors.cardNumber}</span>}
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <label className="form-field">
                      Expiry (MM/YY)
                      <input
                        className="input"
                        type="text"
                        name="expiryDate"
                        value={formState.expiryDate}
                        onChange={(e) => {
                          let digits = e.target.value.replace(/\D/g, '').slice(0, 4)

                          if (digits.length >= 1 && Number.parseInt(digits[0], 10) > 1) {
                            return
                          }

                          if (digits.length >= 2) {
                            const month = Number.parseInt(digits.slice(0, 2), 10)
                            if (Number.isNaN(month) || month < 1 || month > 12) {
                              return
                            }
                          }

                          let formatted = digits
                          if (digits.length >= 2) {
                            formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`
                          }

                          setFormState((prev) => ({ ...prev, expiryDate: formatted }))
                          if (errors.expiryDate) {
                            setErrors((prev) => ({ ...prev, expiryDate: '' }))
                          }
                        }}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                      {errors.expiryDate && <span style={{ color: '#d32f2f', fontSize: '0.85rem' }}>{errors.expiryDate}</span>}
                    </label>

                    <label className="form-field">
                      CVV
                      <input
                        className="input"
                        type="password"
                        name="cvv"
                        value={formState.cvv}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '')
                          if (value.length <= 4) {
                            setFormState((prev) => ({ ...prev, cvv: value }))
                            if (errors.cvv) {
                              setErrors((prev) => ({ ...prev, cvv: '' }))
                            }
                          }
                        }}
                        placeholder="123"
                        maxLength="4"
                      />
                      {errors.cvv && <span style={{ color: '#d32f2f', fontSize: '0.85rem' }}>{errors.cvv}</span>}
                    </label>
                  </div>
                </>
              )}

              {paymentMethod === 'upi' && (
                <label className="form-field">
                  UPI ID
                  <input
                    className="input"
                    type="text"
                    name="upiId"
                    value={formState.upiId}
                    onChange={handleChange}
                    placeholder="name@bankname"
                  />
                  {errors.upiId && <span style={{ color: '#d32f2f', fontSize: '0.85rem' }}>{errors.upiId}</span>}
                </label>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" className="ghost" onClick={() => navigate('/cart')} style={{ flex: 1 }}>
                  Back
                </button>
                <button type="submit" className="primary" style={{ flex: 1 }}>
                  Review Order
                </button>
              </div>
            </form>
          </div>

          {/* Step 2: Order Review */}
          <div className="page-card" style={{ display: currentStep === 'review' ? 'block' : 'none' }}>
            <h3 style={{ marginBottom: '24px' }}>Step 2: Order Review</h3>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', color: '#333' }}>Delivery Information</h4>
              <p style={{ margin: '6px 0', fontSize: '0.95rem' }}><strong>Name:</strong> {profileDetails?.fullName || 'Not provided'}</p>
              <p style={{ margin: '6px 0', fontSize: '0.95rem' }}><strong>Email:</strong> {profileDetails?.email || 'Not provided'}</p>
              <p style={{ margin: '6px 0', fontSize: '0.95rem' }}><strong>Phone:</strong> {profileDetails?.phone || 'Not provided'}</p>
              <p style={{ margin: '6px 0', fontSize: '0.95rem' }}>
                <strong>Address:</strong> {[profileDetails?.address?.line1, profileDetails?.address?.city, profileDetails?.address?.state, profileDetails?.address?.zipCode].filter(Boolean).join(', ') || 'Not provided'}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px', color: '#333' }}>Payment Method</h4>
              <p style={{ margin: '6px 0', fontSize: '0.95rem' }}>{paymentMethod === 'card' ? '💳 Credit/Debit Card' : '📱 UPI'}</p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button type="button" className="ghost" onClick={handlePrevStep} style={{ flex: 1 }}>
                Back
              </button>
              <button type="button" className="primary" onClick={handlePlaceOrder} style={{ flex: 1 }}>
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
          <div className="page-card">
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingBottom: '20px', borderBottom: '2px solid #e5dfd0' }}>
              {items.map((item) => (
                <div key={`${item.name}-${item.type}`} style={{ marginBottom: '12px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '500' }}>{item.name}</span>
                    <span>×{item.quantity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.85rem' }}>
                    <span>{formatCurrency(item.price)} each</span>
                    <span style={{ fontWeight: '600' }}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax (5%)</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span style={{ fontWeight: '600' }}>{formatCurrency(shipping)}</span>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '2px solid #e5dfd0',
              fontSize: '1.1rem',
              fontWeight: '700'
            }}>
              <span>Total</span>
              <span style={{ color: '#5eb62f' }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
