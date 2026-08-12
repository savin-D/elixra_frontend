import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TextReveal({ 
  children, 
  className = '', 
  delay = 0,
  stagger = 0.05,
  duration = 0.8,
  y = 80,
  as: Component = 'div'
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const words = container.querySelectorAll('.word')

    gsap.set(words, { y, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    })

    tl.to(words, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'power3.out',
      delay,
    })

    return () => {
      tl.kill()
    }
  }, [delay, stagger, duration, y])

  // Split text into word spans
  const splitText = (text) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="line-mask mr-[0.25em]">
        <span className="word inline-block">{word}</span>
      </span>
    ))
  }

  // If children is a string, split it. Otherwise render as-is.
  const content = typeof children === 'string' ? splitText(children) : children

  return (
    <Component ref={containerRef} className={className}>
      {content}
    </Component>
  )
}
