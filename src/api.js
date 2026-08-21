export const API_BASE = import.meta.env.VITE_API_URL || '/api'

export async function apiFetch(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

async function request(path, options = {}) {
  return apiFetch(path, options)
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
