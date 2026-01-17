import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/80">We would love to hear from you</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Get in Touch</h2>
            <p className="text-neutral-600 mb-8">
              Have a question, suggestion, or just want to say hello? We are here to help!
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-main" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Email</h3>
                  <p className="text-neutral-600">support@poolo.app</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary-main" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Phone</h3>
                  <p className="text-neutral-600">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Office</h3>
                  <p className="text-neutral-600">Bangalore, Karnataka, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-50 rounded-2xl p-6">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Message Sent!</h3>
                <p className="text-neutral-600">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 outline-none transition-all resize-none"
                    rows={5}
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="large">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-100 py-8 px-4 text-center">
        <Link to="/" className="text-primary-main hover:underline font-medium">
          Back to Home
        </Link>
      </footer>
    </div>
  )
}
