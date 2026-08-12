import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Check, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import ScrollReveal from '../components/ScrollReveal'
import { getProductById, getProducts } from '../api'

export default function Product() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState('')
  const [sizeError, setSizeError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const currentProduct = await getProductById(id)
        setProduct(currentProduct)
        setSelectedImage(0)

        const allProducts = await getProducts()
        setRelatedProducts(allProducts.filter((p) => p.category === currentProduct.category && p._id !== currentProduct._id).slice(0, 3))
      } catch (error) {
        console.error(error)
      }
    }

    loadProduct()
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-lg mb-4">Product Not Found</h1>
          <Link to="/shop" className="btn-primary inline-block">
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    setSizeError('')
    // if product has sizes, require selection and check stock for selected size
    if (product.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        setSizeError('Please select a size')
        return
      }
      const sizeObj = product.sizes.find(s => s.label === selectedSize)
      const available = sizeObj ? (Number(sizeObj.stock) || 0) : 0
      if (available < quantity) {
        setSizeError(`Not available: only ${available} in ${selectedSize}`)
        return
      }
    } else {
      // fallback to product.stock
      const available = Number(product.stock || 0)
      if (available < quantity) {
        setSizeError(`Not available: only ${available} in stock`)
        return
      }
    }

    addToCart({ ...product, quantity, id: product._id || product.id, size: selectedSize, image: product.images?.[selectedImage]?.url || product.images?.[0]?.url })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const changeImage = (direction) => {
    if (!product?.images?.length) return
    setSelectedImage((prev) => {
      if (direction === 'next') {
        return (prev + 1) % product.images.length
      }
      return (prev - 1 + product.images.length) % product.images.length
    })
  }

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX)
  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) > 50) {
      changeImage(distance > 0 ? 'next' : 'prev')
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="section-padding">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-elira-gray hover:text-elira-black transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <ScrollReveal>
            <div className="space-y-4 max-w-[520px] mx-auto lg:mx-0">
              <div className="relative bg-elira-light aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-lg shadow-sm">
                <img
                  ref={imageRef}
                  src={product.images?.[selectedImage]?.url || product.images?.[0]?.url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />

                {product.images?.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => changeImage('prev')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-elira-black shadow-md backdrop-blur-sm transition hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => changeImage('next')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-elira-black shadow-md backdrop-blur-sm transition hover:bg-white"
                      aria-label="Next image"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden border aspect-[3/4] rounded-md ${selectedImage === index ? 'border-elira-black' : 'border-elira-light'}`}
                    >
                      <img src={image.url} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollReveal>

          <div className="flex flex-col justify-center">
            <ScrollReveal delay={0.1}>
              <p className="text-sm text-elira-gray uppercase tracking-wider mb-2">{product.category}</p>
              <h1 className="heading-lg mb-4">{product.name}</h1>
              <p className="text-2xl font-display font-light mb-8">${product.price}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="body-lg mb-8">{product.description}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="mb-8">
                <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Features</h3>
                <ul className="space-y-2">
                  {(product.description ? [product.description] : []).map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-elira-gray">
                      <Check className="w-4 h-4 text-elira-black" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <div className="mb-8">
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm mb-3 font-medium uppercase tracking-wider">Size</label>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => {
                        const stock = Number(s.stock || 0)
                        const isSelected = selectedSize === s.label
                        const isDisabled = stock <= 0

                        return (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() => !isDisabled && setSelectedSize(s.label)}
                            disabled={isDisabled}
                            className={`min-w-[72px] rounded-full border px-3 py-2 text-sm transition-all ${
                              isDisabled
                                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through'
                                : isSelected
                                  ? 'border-elira-black bg-elira-black text-white'
                                  : 'border-elira-light bg-white text-elira-black hover:border-elira-black'
                            }`}
                          >
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-elira-light">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-elira-light transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-elira-light transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 px-8 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 ${
                      added
                        ? 'bg-green-600 text-white'
                        : 'bg-elira-black text-white hover:bg-elira-dark'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                    {added ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
              {sizeError && <p className="text-red-600 mt-2">{sizeError}</p>}
            </ScrollReveal>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="heading-md mb-10">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p, i) => (
                <ScrollReveal key={p._id || p.id} delay={i * 0.1}>
                  <Link to={`/product/${p._id || p.id}`} className="group block">
                    <div className="bg-elira-light aspect-[3/4] overflow-hidden mb-4">
                      <img
                        src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop'}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium text-sm">{p.name}</h3>
                    <p className="text-elira-gray text-sm mt-1">${p.price}</p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
