import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiFetch } from '../api'

export default function Auth() {
  const location = useLocation()
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'signup')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const nextMode = location.state?.mode === 'signup' ? false : true
    setIsLogin(nextMode)
  }, [location.state])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      if (data.data?.token) {
        localStorage.setItem('token', data.data.token)
      }

      if (data.data?.user?.name) {
        localStorage.setItem('userName', data.data.user.name)
      }

      const role = data.data?.user?.role || data.data?.role || 'user'
      localStorage.setItem('userRole', role)

      window.dispatchEvent(new Event('auth:update'))
      setMessage(isLogin ? 'Welcome back.' : 'Account created successfully.')
      navigate('/')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-elira-white pt-32 pb-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-elira-gray">ELIXRA ACCESS</p>
          <h1 className="heading-lg">Design-forward access for your store.</h1>
          <p className="body-lg max-w-xl">
            Sign in to manage products, orders, and the admin dashboard with the same refined experience as the rest of the storefront.
          </p>
        </div>

        <div className="bg-elira-light border border-black/10 rounded-3xl p-8 shadow-sm">
          <div className="flex gap-2 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`auth-toggle ${isLogin ? 'bg-elira-black text-white shadow-sm' : 'bg-white text-elira-gray hover:bg-elira-light'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`auth-toggle ${!isLogin ? 'bg-elira-black text-white shadow-sm' : 'bg-white text-elira-gray hover:bg-elira-light'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-black/10 bg-white px-4 py-3 outline-none focus:border-elira-black"
                  placeholder="Ava Carter"
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-black/10 bg-white px-4 py-3 outline-none focus:border-elira-black"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-black/10 bg-white px-4 py-3 outline-none focus:border-elira-black"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary w-full flex justify-center">
              <span>{isLogin ? 'Log In' : 'Create Account'}</span>
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-elira-gray">{message}</p>}

          <p className="mt-6 text-sm text-elira-gray">
            Need an account?{' '}
            <button type="button" onClick={() => setIsLogin(false)} className="underline text-elira-black">
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
