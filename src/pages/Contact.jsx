import { useState } from 'react'
import { Send, MapPin, Mail, Phone } from 'lucide-react'
import TextReveal from '../components/TextReveal'
import ScrollReveal from '../components/ScrollReveal'
import { apiFetch } from '../api'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="section-padding">
        <TextReveal as="h1" className="heading-xl mb-8">
          Get in Touch
        </TextReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-elira-light focus:border-elira-black outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-elira-light focus:border-elira-black outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-elira-light focus:border-elira-black outline-none transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button
                type="submit"
                className={`btn-primary inline-flex items-center gap-2 ${submitted ? 'bg-green-600' : ''}`}
              >
                <span>{submitted ? 'Message Sent!' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </ScrollReveal>

          <div className="lg:pl-12">
            <ScrollReveal delay={0.2}>
              <p className="body-lg mb-12">
                Have questions about our products, shipping, or collaborations?
                We'd love to hear from you.
              </p>
            </ScrollReveal>

            <div className="space-y-8">
              {[
                { icon: MapPin, title: 'Visit Us', lines: ['Sudemgaru court road Belthangady 57414', 'Karnataka, India'] },
                { icon: Mail, title: 'Email', lines: ['elixrainfo@gmail.com'] },
                { icon: Phone, title: 'Phone', lines: ['+91 8660707153'] },
              ].map((item, i) => (
                <ScrollReveal key={i} delay={0.3 + i * 0.1}>
                  <div className="flex items-start gap-4">
                    <item.icon className="w-5 h-5 mt-1 text-elira-gray" />
                    <div>
                      <h3 className="font-medium text-sm uppercase tracking-wider mb-2">{item.title}</h3>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-elira-gray text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
