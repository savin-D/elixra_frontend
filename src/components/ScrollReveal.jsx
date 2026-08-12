import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal({ 
  children, 
  className = '',
  delay = 0,
  duration = 1,
  y = 60,
  x = 0,
  scale = 1,
  opacity = 0
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, { y, x, scale, opacity })

    const anim = gsap.to(el, {
      y: 0,
      x: 0,
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    })

    return () => {
      anim.kill()
    }
  }, [delay, duration, y, x, scale, opacity])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
