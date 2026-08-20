import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import TextReveal from '../components/TextReveal'
import { getProducts } from '../api'
import { formatINR, getDiscountedPrice } from '../utils/pricing'

const fallbackCategories = ['All', 'Outerwear', 'Tops', 'Bottoms', 'Accessories']

export default function Shop() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(fallbackCategories)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [productsData, categoriesRes] = await Promise.all([
          getProducts(),
          fetch('/api/categories').then((res) => res.json().catch(() => ({})))
        ])

        setProducts(productsData)

        const categoryNames = (categoriesRes.data || []).map((cat) => cat.name).filter(Boolean)
        const merged = Array.from(new Set(['All', ...categoryNames, ...productsData.map((p) => p.category).filter(Boolean)]))
        setCategories(merged)
      } catch (error) {
        console.error(error)
      }
    }

    loadProducts()
  }, [])

  const filtered = activeCategory === 'All'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="section-padding">
        <TextReveal as="h1" className="heading-xl mb-6">
          Collection
        </TextReveal>
        <p className="body-lg max-w-2xl mb-12">
          Unlock the Future of Fashion — Discover Elixra Today and Elevate Your Wardrobe
          with Cutting-Edge Apparel Designed for Tomorrow's World.
        </p>

        <div className="flex flex-wrap gap-3 mb-12 pb-8 border-b border-elira-light">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-medium tracking-wide uppercase transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-elira-black text-white'
                  : 'bg-elira-light text-elira-gray hover:text-elira-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product, i) => (
            <ScrollReveal key={product._id || product.id} delay={i * 0.08}>
              <Link to={`/product/${product._id || product.id}`} className="group block">
                <div className="relative overflow-hidden bg-elira-light aspect-[3/4] mb-4">
                  <img
                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block bg-white text-elira-black px-4 py-2 text-xs font-medium uppercase tracking-wide">
                      Quick View
                    </span>
                  </div>
                </div>
                <h3 className="font-medium text-sm tracking-wide">{product.name}</h3>
                <div className="mt-1 flex items-center gap-2">
                  {product.discount > 0 && (
                    <span className="text-elira-gray text-sm line-through">{formatINR(product.price)}</span>
                  )}
                  <p className="text-elira-black text-sm font-medium">{formatINR(getDiscountedPrice(product))}</p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-elira-gray">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  )
}
