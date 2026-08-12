import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart')
      return raw ? JSON.parse(raw) : []
    } catch (err) {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  const addToCart = useCallback((product) => {
    setCart(prev => {
      // treat same product with different size as distinct
      const existing = prev.find(item => item.id === product.id && (item.size || '') === (product.size || ''))
      if (existing) {
        return prev.map(item =>
          item.id === product.id && (item.size || '') === (product.size || '')
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        )
      }
      return [...prev, { ...product, quantity: product.quantity || 1, image: product.image || product.images?.[0]?.url }]
    })
    setIsOpen(true)
  }, [])

  const removeFromCart = useCallback((id, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && (item.size || '') === (size || ''))))
  }, [])

  const updateQuantity = useCallback((id, quantity, size) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => !(item.id === id && (item.size || '') === (size || ''))))
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id && (item.size || '') === (size || '') ? { ...item, quantity } : item
      )
    )
  }, [])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // persist cart to localStorage
  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cart)) } catch (err) { }
  }, [cart])

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity,
      cartTotal, cartCount, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
