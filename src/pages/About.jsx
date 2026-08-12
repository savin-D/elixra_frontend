import { ArrowUpRight } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import ScrollReveal from '../components/ScrollReveal'

export default function About() {
  const values = [
    { title: 'Innovation', desc: 'Pushing boundaries in fabric technology and garment construction.' },
    { title: 'Sustainability', desc: 'Eco-conscious materials and ethical manufacturing processes.' },
    { title: 'Functionality', desc: 'Every detail serves a purpose. No excess, only utility.' },
  ]

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="section-padding">
        <TextReveal as="h1" className="heading-xl mb-8 max-w-5xl">
          Redefining Modern Apparel
        </TextReveal>
        <ScrollReveal className="max-w-3xl mb-24">
          <p className="body-lg">
            Elixra was born from a simple belief: clothing should adapt to you, not the other way around.
            We engineer garments that seamlessly blend cutting-edge technology with timeless design,
            creating apparel that's as functional as it is beautiful.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-32">
          <ScrollReveal>
            <div className="aspect-[4/5] overflow-hidden bg-elira-light">
              <img
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=1000&fit=crop"
                alt="About Elixra"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>
          <div className="flex flex-col justify-center">
            <ScrollReveal delay={0.2}>
              <h2 className="heading-md mb-6">Our Mission</h2>
              <p className="body-lg mb-6">
                We exist at the intersection of fashion and technology. Every stitch, every fiber,
                every pocket placement is intentional — designed to enhance how you move through the world.
              </p>
              <p className="body-lg">
                From water-resistant membranes to hidden ventilation systems, our garments are
                laboratories of innovation disguised as everyday wear.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {values.map((v, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              <div className="border-t border-elira-black pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">{v.title}</h3>
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <p className="text-elira-gray text-sm leading-relaxed">{v.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="bg-elira-black text-white py-20 px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '50+', label: 'Products' },
              { num: '12K', label: 'Customers' },
              { num: '30+', label: 'Countries' },
              { num: '100%', label: 'Sustainable' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <p className="text-4xl md:text-5xl font-display font-light tracking-tighter mb-2">{stat.num}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
