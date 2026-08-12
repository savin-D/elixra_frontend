import { useEffect, useState, useRef } from 'react'

export default function BannerSlider({ banners = [], interval = 4000 }) {
  const [index, setIndex] = useState(0)
  const timer = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    if (!banners || banners.length <= 1) return
    const start = () => {
      timer.current = setInterval(() => {
        setIndex((i) => (i + 1) % banners.length)
      }, interval)
    }
    start()
    return () => clearInterval(timer.current)
  }, [banners, interval])

  useEffect(() => {
    if (!imageRef.current) return

    const elements = imageRef.current.querySelectorAll('img')
    if (!elements.length) return

    elements.forEach((img, imgIndex) => {
      const isActive = imgIndex === index
      img.style.transition = 'opacity 900ms ease, transform 1400ms cubic-bezier(0.22, 1, 0.36, 1)'
      img.style.transform = isActive ? 'scale(1.08)' : 'scale(1.18)'
      img.style.opacity = isActive ? '1' : '0'
    })
  }, [index, banners])

  if (!banners || banners.length === 0) return null

  const wrapperClass = 'w-full mt-10 mb-12 px-4 sm:px-6 lg:px-8'
  const bannerClass = 'relative overflow-hidden rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-black/5 mx-auto max-w-[1400px] aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]'
  const imgClass = 'absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out'

  if (banners.length === 1) {
    const b = banners[0]
    return (
      <div className={wrapperClass}>
        <div className={bannerClass}>
          <img src={b.image?.url} alt={b.title || 'Promotion'} className={`${imgClass} scale-110`} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-black/10" />
          {(b.title || b.text) && (
            <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 md:left-8 md:right-8 md:bottom-8 max-w-md text-white animate-[fadeInUp_0.9s_ease-out]">
              {b.title && <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">{b.title}</h3>}
              {b.text && <p className="mt-2 text-xs sm:text-sm md:text-base max-w-sm leading-relaxed opacity-95">{b.text}</p>}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClass} ref={imageRef}>
      <div className={bannerClass}>
        {banners.map((b, i) => (
          <img
            key={b._id || i}
            src={b.image?.url}
            alt={b.title || `Banner ${i + 1}`}
            className={`${imgClass} ${i === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-black/10" />
        <div className="absolute left-4 right-4 bottom-4 sm:left-6 sm:right-6 sm:bottom-6 md:left-8 md:right-8 md:bottom-8 max-w-md text-white animate-[fadeInUp_0.9s_ease-out]">
          {banners[index]?.title && <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-tight">{banners[index].title}</h3>}
          {banners[index]?.text && <p className="mt-2 text-xs sm:text-sm md:text-base max-w-sm leading-relaxed opacity-95">{banners[index].text}</p>}
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 sm:bottom-4 flex gap-2">
          {banners.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/80'}`} aria-label={`Go to banner ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
