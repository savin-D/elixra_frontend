import { useEffect, useState } from 'react'
import { formatINR } from '../utils/pricing'
import { apiFetch } from '../api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await apiFetch('/orders/my', { headers: { Authorization: `Bearer ${token}` } })
        setOrders(data.data || [])
      } catch (err) { setError(err.message) }
    }
    load()
  }, [])

  if (error) return <div className="min-h-screen p-12">Error: {error}</div>

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="section-padding max-w-4xl mx-auto">
        <h1 className="heading-lg mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-elira-gray">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map(o => (
              <div key={o._id} className="border rounded p-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">Order #{o._id}</div>
                    <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatINR(o.totalAmount)}</div>
                    <div className="text-sm text-gray-500">{o.status}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {o.items.map(it => (
                      <div key={`${it.product}-${it.size||''}`} className="flex gap-3 items-center mb-2">
                        <div>
                          <div className="font-medium">{it.name}</div>
                          <div className="text-sm">Size: {it.size || '—'}</div>
                          <div className="text-sm">Qty: {it.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm">Shipping: {o.shippingAddress}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
