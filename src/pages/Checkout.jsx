import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatINR, getDiscountedPrice } from '../utils/pricing'
import { apiFetch } from '../api'

export default function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState({ name: '', phone: '', altPhone: '', address: '', city: '', state: '', zip: '' })
  const [error, setError] = useState('')
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+918660707153'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in or create an account before placing an order.')
      navigate('/auth', { state: { mode: 'login' } })
    }
  }, [navigate])

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const handlePlace = async () => {
    setError('')
    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please log in or create an account before placing an order.')
      navigate('/auth', { state: { mode: 'login' } })
      return
    }

    if (!address.name || !address.phone || !address.address || !address.city || !address.state || !address.zip) {
      setError('Please complete required address fields')
      return
    }

    try {
      const data = await apiFetch('/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: cart.map(i => ({ product: i.id, quantity: i.quantity, size: i.size })), shippingAddress: `${address.name} | ${address.phone} | ${address.address}, ${address.city}, ${address.state} - ${address.zip}` })
      })
      // clear cart
      localStorage.removeItem('cart')
      navigate('/orders')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleOrderNow = () => {
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please log in or create an account before placing an order.')
      navigate('/auth', { state: { mode: 'login' } })
      return
    }

    if (!address.name || !address.phone || !address.address || !address.city || !address.state || !address.zip) {
      setError('Please complete required address fields')
      return
    }

    const placeOrder = async () => {
      try {
        const data = await apiFetch('/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            items: cart.map(i => ({ product: i.id, quantity: i.quantity, size: i.size })),
            shippingAddress: `${address.name} | ${address.phone} | ${address.address}, ${address.city}, ${address.state} - ${address.zip}`,
          }),
        })

        const itemsSummary = cart.map((item) => {
          const productId = item.productId || item.id || 'N/A'
          const total = getDiscountedPrice(item) * item.quantity
          return `- ${item.name} (ID: ${productId}) | Qty: ${item.quantity} | Size: ${item.size || '—'} | Price: ${formatINR(total)}`
        }).join('\n')
        const total = cart.reduce((sum, item) => sum + getDiscountedPrice(item) * item.quantity, 0)
        const message = `Hello, I want to place an order.\n\nCustomer Name: ${address.name}\nPhone Number: ${address.phone}\nAddress: ${address.address}, ${address.city}, ${address.state} - ${address.zip}\n\nProducts:\n${itemsSummary}\n\nTotal: ${formatINR(total)}`

        localStorage.removeItem('cart')
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
        navigate('/orders')
      } catch (err) {
        setError(err.message)
      }
    }

    placeOrder()
  }

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center">Your cart is empty</div>
  )

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="section-padding max-w-4xl mx-auto">
        <h1 className="heading-lg mb-6">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-medium mb-3">Delivery Address</h2>
            <input name="name" value={address.name} onChange={handleChange} placeholder="Full name" className="w-full border px-3 py-2 mb-3" />
            <input name="phone" value={address.phone} onChange={handleChange} placeholder="Mobile number" className="w-full border px-3 py-2 mb-3" />
            <input name="altPhone" value={address.altPhone} onChange={handleChange} placeholder="Alternative mobile (optional)" className="w-full border px-3 py-2 mb-3" />
            <textarea name="address" value={address.address} onChange={handleChange} placeholder="Complete address" className="w-full border px-3 py-2 mb-3" />
            <input name="city" value={address.city} onChange={handleChange} placeholder="City" className="w-full border px-3 py-2 mb-3" />
            <input name="state" value={address.state} onChange={handleChange} placeholder="State" className="w-full border px-3 py-2 mb-3" />
            <input name="zip" value={address.zip} onChange={handleChange} placeholder="PIN/ZIP" className="w-full border px-3 py-2 mb-3" />
            {error && <p className="text-red-600">{error}</p>}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button onClick={handleOrderNow} className="border border-elira-black bg-white px-8 py-4 text-sm font-medium tracking-wide uppercase text-elira-black transition-all duration-300 hover:bg-elira-black hover:text-white flex-1">
                Order Now
              </button>
            </div>
          </div>
          <div>
            <h2 className="font-medium mb-3">Order Summary</h2>
            <div className="space-y-4">
              {cart.map(i => (
                <div key={`${i.id}-${i.size||''}`} className="flex items-center gap-4">
                  <img src={i.image} alt={i.name} className="w-20 h-24 object-cover" />
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm">Size: {i.size || '—'}</div>
                    <div className="text-sm">Qty: {i.quantity}</div>
                    <div className="text-sm">{formatINR(getDiscountedPrice(i) * i.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
