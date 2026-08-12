import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function Marquee({ text, className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const tl = gsap.to(container, {
      x: '-50%',
      duration: 20,
      ease: 'none',
      repeat: -1,
    })

    return () => tl.kill()
  }, [])

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={containerRef} className="flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-6xl md:text-8xl lg:text-9xl font-display font-light tracking-tighter px-8">
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
