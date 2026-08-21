import { Link } from 'react-router-dom'
import { Instagram, ArrowUpRight } from 'lucide-react'


export default function Footer() {
  return (
    <footer className="bg-elira-black text-elira-white">
      <div className="section-padding py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-display font-bold tracking-tighter mb-4">ELIXRA</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Future-forward fashion engineered for the modern explorer. 
              Where technology meets timeless design.
            </p>
            <a
              href="mailto:elixrainfo@gmail.com"
              className="mt-4 inline-block text-gray-400 hover:text-white transition-colors text-sm"
            >
              elixrainfo@gmail.com
            </a>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-6">Shop</h3>
            <ul className="space-y-3">
              {['New Arrivals', 'Outerwear', 'Tops', 'Bottoms', 'Accessories'].map(item => (
                <li key={item}>
                  <Link to="/shop" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-6">Support</h3>
            <ul className="space-y-3">
              {['Contact', 'Shipping', 'Returns', 'FAQ', 'Size Guide'].map(item => (
                <li key={item}>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1 group">
                    {item}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-sm">© 2026 Elixra. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/elixra.in?igsh=MXQxcnFrZXY3ZDZxbA%3D%3D&igsi=MXQxcnFrZXY3ZDZxbA%3D%3D"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit ELIXRA on Instagram"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
           
          </div>
        </div>
      </div>
    </footer>
  )
}
