import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, cartTotal } = useCart()
  const navigate = useNavigate()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-elira-white shadow-2xl transition-transform duration-500 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-elira-light">
            <h2 className="text-xl font-display font-medium tracking-tight">Your Cart</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-elira-light rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-elira-gray">
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm mt-2">Add some items to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map(item => (
                  <div key={`${item.id}-${item.size||''}`} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-24 h-28 object-cover bg-elira-light" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-elira-gray text-sm mt-1">${item.price}</p>
                      {item.size && <p className="text-sm mt-1">Size: {item.size}</p>}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                          className="p-1 hover:bg-elira-light rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                          className="p-1 hover:bg-elira-light rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-elira-light space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-elira-gray">Subtotal</span>
                <span className="text-xl font-display font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => {
                setIsOpen(false)
                const token = localStorage.getItem('token')
                if (!token) {
                  navigate('/auth', { state: { mode: 'login' } })
                  return
                }
                navigate('/checkout')
              }} className="btn-primary w-full">
                <span>Checkout</span>
              </button>
              <p className="text-xs text-center text-elira-gray">Shipping calculated at checkout</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
