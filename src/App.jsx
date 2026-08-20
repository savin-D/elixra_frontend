import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Auth from './pages/Auth'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import ProtectedRoute from './components/ProtectedRoute'
import { CartProvider } from './hooks/useCart'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-elira-white">
        <ScrollToTop />
        <Navbar />
        <CartDrawer />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default App
