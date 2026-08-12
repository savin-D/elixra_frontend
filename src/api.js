const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

export async function getProducts() {
  const response = await request('/products')
  return response.data || []
}

export async function getProductById(id) {
  const response = await request(`/products/${id}`)
  return response.data
}

export async function getBanners() {
  const response = await request('/banners')
  return response.data || []
}
