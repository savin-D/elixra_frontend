import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '../hooks/useCart'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '')
  const { cartCount, setIsOpen } = useCart()
  const token = localStorage.getItem('token')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    const syncUser = () => setUserName(localStorage.getItem('userName') || '')
    window.addEventListener('auth:update', syncUser)
    syncUser()
    return () => window.removeEventListener('auth:update', syncUser)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/contact', label: 'Contact' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    window.dispatchEvent(new Event('auth:update'))
    navigate('/')
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-elira-white/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="section-padding flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-50">
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tighter">
              ELIXRA
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'text-elira-black' : 'text-elira-gray'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {token ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/orders" className="text-sm font-medium uppercase tracking-wide text-elira-gray hover:text-elira-black transition-colors">
                  {userName ? `Hi, ${userName}` : 'Profile'}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium uppercase tracking-wide text-elira-gray hover:text-elira-black transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/auth"
                  state={{ mode: 'login' }}
                  className="action-button px-4 py-2 text-sm font-medium uppercase tracking-wide text-elira-black border border-black/10 bg-white hover:bg-elira-light"
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  state={{ mode: 'signup' }}
                  className="action-button px-4 py-2 text-sm font-medium uppercase tracking-wide text-white bg-elira-black hover:bg-black"
                >
                  Sign Up
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 hover:bg-elira-light rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-elira-black text-elira-white text-xs flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-elira-white transition-transform duration-500 ${
        mobileOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="text-3xl font-display font-light tracking-tight"
            >
              {link.label}
            </Link>
          ))}
          {token ? (
            <>
              <Link to="/orders" className="text-2xl font-display font-light tracking-tight">{userName ? `Hi, ${userName}` : 'Profile'}</Link>
              <button type="button" onClick={handleLogout} className="text-2xl font-display font-light tracking-tight">Logout</button>
            </>
          ) : (
            <>
              <Link to="/auth" state={{ mode: 'login' }} className="text-2xl font-display font-light tracking-tight">Login</Link>
              <Link to="/auth" state={{ mode: 'signup' }} className="text-2xl font-display font-light tracking-tight">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
