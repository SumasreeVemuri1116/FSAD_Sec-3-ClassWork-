import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
const isUserAuthenticated = () => Boolean(localStorage.getItem('agriconnectUser'))

const getActiveUserId = () => {
  const rawUser = localStorage.getItem('agriconnectUser')
  if (!rawUser) {
    return 'guest'
  }

  try {
    const parsedUser = JSON.parse(rawUser)
    return (parsedUser.id || parsedUser.email || 'guest').toString().toLowerCase()
  } catch {
    return 'guest'
  }
}

const getCartStorageKey = () => `agriconnect_cart_${getActiveUserId()}`

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [storageKey, setStorageKey] = useState(getCartStorageKey())

  // Load cart from localStorage on mount
  useEffect(() => {
    const nextStorageKey = getCartStorageKey()
    setStorageKey(nextStorageKey)

    const savedCart = localStorage.getItem(nextStorageKey)
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Failed to load cart:', error)
        setItems([])
      }
    } else {
      setItems([])
    }
    setIsLoading(false)
  }, [storageKey])

  useEffect(() => {
    const refreshStorageKey = () => {
      const nextKey = getCartStorageKey()
      if (nextKey !== storageKey) {
        setIsLoading(true)
        setStorageKey(nextKey)
      }
    }

    window.addEventListener('focus', refreshStorageKey)
    return () => {
      window.removeEventListener('focus', refreshStorageKey)
    }
  }, [storageKey])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(storageKey, JSON.stringify(items))
    }
  }, [items, isLoading, storageKey])

  const addItem = (item) => {
    if (!isUserAuthenticated()) {
      window.alert('Please login to continue')
      const redirectTo = window.location.pathname + window.location.search
      window.location.assign(`/sign-in?redirect=${encodeURIComponent(redirectTo)}`)
      return false
    }

    const normalizedItem = {
      ...item,
      name: String(item?.name || '').trim(),
      type: item?.type || 'product',
      price: Number(item?.price || 0),
      quantity: Number(item?.quantity || 1),
    }

    if (!normalizedItem.name) {
      return false
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.name.toLowerCase() === normalizedItem.name.toLowerCase()
      )

      if (existingItem) {
        return prevItems.map((i) =>
          i.name.toLowerCase() === normalizedItem.name.toLowerCase()
            ? { ...i, quantity: i.quantity + normalizedItem.quantity }
            : i
        )
      }

      return [...prevItems, normalizedItem]
    })

    return true
  }

  const removeItem = (name) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.name.toLowerCase() !== name.toLowerCase())
    )
  }

  const updateQuantity = (name, quantity) => {
    if (quantity <= 0) {
      removeItem(name)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.name.toLowerCase() === name.toLowerCase()
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isLoading,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
