import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../utils/pricing'

const emptyForm = {
  productId: '',
  name: '',
  description: '',
  category: '',
  brand: 'Elixra',
  price: '',
  discount: '',
  stock: '',
  sizes: '', // format: S:10,M:5 or JSON
}

const defaultCategories = ['Outerwear', 'Tops', 'Bottoms', 'Accessories']

export default function Admin() {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [messages, setMessages] = useState([])
  const [orders, setOrders] = useState([])
  const [categories, setCategories] = useState(defaultCategories)
  const [form, setForm] = useState(emptyForm)
  const [newCategory, setNewCategory] = useState('')
  const [images, setImages] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [banners, setBanners] = useState([])
  const [bannerImage, setBannerImage] = useState(null)
  const [bannerActive, setBannerActive] = useState(true)

  const token = localStorage.getItem('token')

  const headers = { Authorization: `Bearer ${token}` }

  const loadData = async () => {
    try {
      const [dashboardRes, productsRes, messagesRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }),
        fetch('/api/products', { headers }),
        fetch('/api/contact', { headers }),
        fetch('/api/categories', { headers }),
      ])

      const dashboardData = await dashboardRes.json().catch(() => ({}))
      const productsData = await productsRes.json().catch(() => ({}))
      const messagesData = await messagesRes.json().catch(() => ({}))
      const categoriesData = await categoriesRes.json().catch(() => ({}))

      if (!dashboardRes.ok) throw new Error(dashboardData.message || 'Unable to load dashboard')
      if (!productsRes.ok) throw new Error(productsData.message || 'Unable to load products')
      if (!messagesRes.ok) throw new Error(messagesData.message || 'Unable to load messages')
      if (!categoriesRes.ok) throw new Error(categoriesData.message || 'Unable to load categories')

      const categoryList = [
        ...(categoriesData.data || []).map((item) => item.name),
        ...(productsData.data || []).map((product) => product.category).filter(Boolean),
      ]

      setStats(dashboardData.data)
      setProducts(productsData.data || [])
      setMessages(messagesData.data || [])
      setCategories(Array.from(new Set(categoryList)).sort((a, b) => a.localeCompare(b)))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners', { headers })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Could not load banners')
      setBanners(data.data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', { headers })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Could not load orders')
      setOrders(data.data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadBanners()
    loadOrders()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('productId', form.productId)
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('brand', form.brand)
      formData.append('price', String(Number(form.price)))
      formData.append('discount', String(Number(form.discount || 0)))
      formData.append('stock', String(Number(form.stock || 0)))
      if (form.sizes) formData.append('sizes', form.sizes)
      Array.from(images).forEach((image) => formData.append('images', image))

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Could not create product')
      setForm(emptyForm)
      setImages([])
      setMessage('Product created successfully')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCategory }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Could not create category')
      const categoryName = data.data?.name || newCategory.trim()
      setCategories((prev) => Array.from(new Set([...prev, categoryName])).sort((a, b) => a.localeCompare(b)))
      setForm({ ...form, category: categoryName })
      setNewCategory('')
      setMessage('Category created successfully')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Could not update order status')
      setOrders((prev) => prev.map((order) => order._id === orderId ? { ...order, status } : order))
      setMessage('Order status updated successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Could not delete order')
      setOrders((prev) => prev.filter((order) => order._id !== orderId))
      setMessage('Order deleted successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async (productId, update) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(update),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Could not update product')
      setMessage('Product updated successfully')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Could not delete product')
      setMessage('Product deleted successfully')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8 pt-32">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage products, discounts, pricing, and customer messages.</p>
          </div>
          <Link to="/" className="text-sm underline">Back to Store</Link>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              ['Total Products', stats.totalProducts],
              ['Total Users', stats.totalUsers],
              ['Total Orders', stats.totalOrders],
              ['Pending Orders', stats.pendingOrders],
              ['Delivered Orders', stats.deliveredOrders],
              ['Total Revenue', formatINR(stats.totalRevenue)],
            ].map(([label, value]) => (
              <div key={label} className="border rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-semibold mt-2">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-8">
          <div className="border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input name="productId" value={form.productId} onChange={handleChange} placeholder="Product ID / SKU" className="w-full border px-4 py-3" />
              <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" className="w-full border px-4 py-3" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-4 py-3" />
              <div>
                <p className="text-sm mb-2">Category</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category) => (
                    <div key={category} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1 text-sm">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, category })}
                        className={`rounded-full px-2 py-1 transition-all ${
                          form.category === category
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const categoryData = (await fetch('/api/categories', { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json().catch(() => ({}))))
                          const match = (categoryData.data || []).find((item) => item.name === category)
                          if (!match) {
                            setError('This category was not found in the category list.')
                            return
                          }

                          try {
                            const response = await fetch(`/api/categories/${match._id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` },
                            })
                            const data = await response.json().catch(() => ({}))
                            if (!response.ok) throw new Error(data.message || 'Could not delete category')
                            setCategories((prev) => prev.filter((item) => item !== category))
                            setMessage('Category deleted successfully')
                            setForm((prev) => prev.category === category ? { ...prev, category: '' } : prev)
                            loadData()
                          } catch (err) {
                            setError(err.message)
                          }
                        }}
                        className="text-xs text-gray-500 hover:text-red-600"
                        aria-label={`Delete ${category}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" className="flex-1 border px-3 py-2" />
                  <button type="button" onClick={handleCreateCategory} className="border px-3 py-2 text-sm">Add Category</button>
                </div>
              </div>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="w-full border px-4 py-3" />
              <div>
                <p className="text-sm mb-2">Photos</p>
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="w-full border px-4 py-3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border px-4 py-3" />
                <input type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="Discount %" className="w-full border px-4 py-3" />
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full border px-4 py-3" />
                <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="Sizes (S:10,M:5)" className="w-full border px-4 py-3" />
              </div>
              <button className="btn-primary w-full"><span>Create Product</span></button>
            </form>
          </div>

          <div className="border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Product Inventory</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                      {product.productId && <p className="text-xs text-gray-500 mt-1">Product ID: {product.productId}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(product._id, { price: Number(product.price) + 10 })} className="text-xs border px-3 py-2">+10 Price</button>
                      <button onClick={() => handleUpdate(product._id, { discount: (product.discount || 0) + 5 })} className="text-xs border px-3 py-2">+5% Discount</button>
                      <button onClick={() => handleDelete(product._id)} className="text-xs border px-3 py-2">Delete</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                    <label className="text-sm">
                      <span className="block mb-1">Price</span>
                      <input type="number" value={product.price || ''} onChange={(e) => handleUpdate(product._id, { price: Number(e.target.value) })} className="w-full border px-3 py-2" />
                    </label>
                    <label className="text-sm">
                      <span className="block mb-1">Discount</span>
                      <input type="number" value={product.discount || 0} onChange={(e) => handleUpdate(product._id, { discount: Number(e.target.value) })} className="w-full border px-3 py-2" />
                    </label>
                    <label className="text-sm">
                      <span className="block mb-1">Stock</span>
                      <input type="number" value={product.stock || 0} onChange={(e) => handleUpdate(product._id, { stock: Number(e.target.value) })} className="w-full border px-3 py-2" />
                    </label>
                    <label className="text-sm">
                      <span className="block mb-1">Sizes (S:10,M:5)</span>
                      <input type="text" value={(product.sizes || []).map(s => `${s.label}:${s.stock}`).join(',')}
                        onChange={(e) => handleUpdate(product._id, { sizes: e.target.value })}
                        className="w-full border px-3 py-2" />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Promotional Banners</h2>
          <form onSubmit={async (e) => {
            e.preventDefault(); setMessage(''); setError('')
            try {
              const formData = new FormData()
              if (bannerImage) formData.append('image', bannerImage)
              formData.append('active', String(bannerActive))

              const res = await fetch('/api/admin/banners', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
              const data = await res.json().catch(() => ({}))
              if (!res.ok) throw new Error(data.message || 'Could not create banner')
              setMessage('Banner created')
              setBannerImage(null)
              setBannerActive(true)
              loadBanners()
            } catch (err) { setError(err.message) }
          }} className="space-y-3">
            <input type="file" accept="image/*" onChange={(e) => setBannerImage(e.target.files[0])} className="w-full" />
            <div className="flex items-center justify-between rounded-xl border px-3 py-2">
              <span className="text-sm font-medium">Banner status</span>
              <button
                type="button"
                onClick={() => setBannerActive((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${bannerActive ? 'bg-black' : 'bg-gray-300'}`}
                aria-label="Toggle banner active status"
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${bannerActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <button className="btn-primary">Upload Banner</button>
          </form>

          <div className="mt-6 space-y-4">
            {banners.map(b => (
              <div key={b._id} className="flex items-center justify-between gap-4 border rounded-xl p-3">
                <div className="flex items-center gap-4">
                  <img src={b.image?.url} alt={b.title || 'Banner'} className="w-32 h-16 object-cover rounded" />
                  <div>
                    <div className="font-medium">{b.title || 'Promotional Banner'}</div>
                    <div className="text-sm text-gray-500">{b.active ? 'Active' : 'Inactive'}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => { try { const res = await fetch(`/api/admin/banners/${b._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ active: !b.active }) }); const data = await res.json().catch(()=>({})); if (!res.ok) throw new Error(data.message||''); setMessage('Banner updated'); loadBanners() } catch (err) { setError(err.message) } }} className="px-3 py-2 border text-sm">{b.active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={async () => { try { const res = await fetch(`/api/admin/banners/${b._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); const data = await res.json().catch(()=>({})); if (!res.ok) throw new Error(data.message||''); setMessage('Banner deleted'); loadBanners() } catch (err) { setError(err.message) } }} className="px-3 py-2 border text-sm text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const customer = order.user && typeof order.user === 'object' ? order.user : null
                return (
                  <div key={order._id} className="border rounded-xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                      <div>
                        <p className="font-medium">Order #{String(order._id).slice(-6)}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        {customer && <p className="text-sm text-gray-600">{customer.name} • {customer.email}</p>}
                      </div>
                      <div className="text-left md:text-right">
                        <p className="font-medium">{formatINR(Number(order.totalAmount || 0))}</p>
                        <div className="mt-2 flex flex-wrap gap-2 md:justify-end">
                          {order.status !== 'Delivered' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                              className="border border-green-600 px-3 py-1 text-sm text-green-700 hover:bg-green-50"
                            >
                              Delivered
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="border border-red-600 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">Status: {order.status}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Items</p>
                        {order.items?.map((item) => (
                          <div key={`${order._id}-${item.product || item.name}-${item.size || 'default'}`} className="border rounded-lg p-3">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Size: {item.size || '—'} | Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">Price: {formatINR(Number(item.price || 0))}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Shipping Details</p>
                        <div className="border rounded-lg p-3 text-sm text-gray-700 whitespace-pre-line">{order.shippingAddress}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Customer Messages</h2>
          <div className="space-y-3">
            {messages.length === 0 ? <p className="text-gray-500">No customer messages yet.</p> : messages.map((messageItem) => (
              <div key={messageItem._id} className="border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{messageItem.name}</p>
                  <p className="text-sm text-gray-500">{new Date(messageItem.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{messageItem.email}</p>
                <p className="mt-2 text-sm">{messageItem.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
