import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Zap, Shield, Wind } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import ScrollReveal from '../components/ScrollReveal'
import Marquee from '../components/Marquee'
import BannerSlider from '../components/BannerSlider'
import { getProducts } from '../api'
import { getBanners } from '../api'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const [products, setProducts] = useState([])
  const [banners, setBanners] = useState([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title-line', {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.3,
      })

      gsap.from('.hero-subtitle', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8,
      })

      gsap.from('.hero-cta', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1,
      })

      gsap.fromTo(imageRef.current,
        {
          scale: 1.35,
          opacity: 0.8,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: 'power2.out',
          delay: 0.1,
        }
      )

      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error(error)
      }
    }

    const loadBanners = async () => {
      try {
        const data = await getBanners()
        setBanners(data)
      } catch (err) {
        console.error(err)
      }
    }

    loadProducts()
    loadBanners()
  }, [])

  const featuredProducts = products.slice(0, 4)

  return (
    <div>
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            ref={imageRef}
            src="src\hero.jpeg"
            alt="Hero"
            className="w-full h-[120%] object-cover opacity-90 transform-gpu will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />
        </div>

        <div className="relative z-10 section-padding pt-32 pb-20">
          <div className="max-w-4xl">
            <div className="overflow-hidden mb-2">
              <h1 className="hero-title-line heading-xl">ENGINEERED</h1>
            </div>
            <div className="overflow-hidden mb-2">
              <h1 className="hero-title-line heading-xl">FOR THE</h1>
            </div>
            <div className="overflow-hidden mb-8">
              <h1 className="hero-title-line heading-xl text-elira-gray">UNKNOWN</h1>
            </div>

            <p className="hero-subtitle body-lg max-w-xl mb-10">
              Future-forward apparel merging advanced materials with uncompromising
              aesthetics. Built for urban exploration.
            </p>

            <div className="hero-cta flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 text-sm font-medium tracking-wide uppercase border border-elira-black hover:bg-elira-black hover:text-white transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional banners managed by admin */}
      <BannerSlider banners={banners} />

      <section className="py-12 border-y border-elira-light bg-elira-white">
        <Marquee text="ELIRA — FUTURE FASHION — TECHWEAR — URBAN EXPLORATION — " />
      </section>

      <section className="section-padding py-24 md:py-32">
        <div className="flex items-end justify-between mb-16">
          <TextReveal as="h2" className="heading-lg">
            New Arrivals
          </TextReveal>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-medium uppercase tracking-wide hover:gap-3 transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, i) => (
            <ScrollReveal key={product._id || product.id} delay={i * 0.1}>
              <Link to={`/product/${product._id || product.id}`} className="group block">
                <div className="relative overflow-hidden bg-elira-light aspect-[3/4] mb-4">
                  <img
                    src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&h=800&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <h3 className="font-medium text-sm tracking-wide">{product.name}</h3>
                <p className="text-elira-gray text-sm mt-1">${product.price}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link to="/shop" className="btn-primary inline-block">
            <span>View All</span>
          </Link>
        </div>
      </section>

      <section className="section-padding py-24 bg-elira-light">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {[
            { icon: Shield, title: 'Weather Resistant', desc: 'Advanced DWR coatings and sealed seams protect against the elements.' },
            { icon: Wind, title: 'Breathable Tech', desc: 'Strategic venting and moisture-wicking fabrics keep you comfortable.' },
            { icon: Zap, title: 'Modular Design', desc: 'Adaptable pockets and attachment points for ultimate versatility.' },
          ].map((feature, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="text-center md:text-left">
                <feature.icon className="w-8 h-8 mb-6 mx-auto md:mx-0" strokeWidth={1.5} />
                <h3 className="text-lg font-medium mb-3">{feature.title}</h3>
                <p className="text-elira-gray text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="relative py-32 md:py-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop"
          alt="CTA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 section-padding text-center text-white">
          <TextReveal as="h2" className="heading-lg mb-6">
            Ready for Anything
          </TextReveal>
          <p className="text-white/70 max-w-xl mx-auto mb-10 body-lg">
            Join the movement. Experience apparel designed for the modern frontier.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-elira-black px-8 py-4 text-sm font-medium tracking-wide uppercase hover:bg-elira-light transition-colors">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
