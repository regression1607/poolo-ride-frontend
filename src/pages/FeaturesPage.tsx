import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Car, MessageCircle, CreditCard, Shield, Star, MapPin, Bell, Users, Leaf, Clock, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

export default function FeaturesPage() {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      desc: 'Find rides that match your route, schedule, and preferences with our intelligent search algorithm.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Car,
      title: 'Publish Rides',
      desc: 'Drivers can easily publish their daily commute and set the number of available seats and price.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: MessageCircle,
      title: 'In-App Chat',
      desc: 'Communicate with your driver or passengers directly through our secure messaging system.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      desc: 'Cashless payments processed securely. Split costs fairly and automatically.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: Shield,
      title: 'Verified Profiles',
      desc: 'All users go through verification. See ratings, reviews, and ride history before booking.',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Star,
      title: 'Ratings & Reviews',
      desc: 'Build trust in the community with our two-way rating system after each ride.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: MapPin,
      title: 'Live Tracking',
      desc: 'Track your ride in real-time and share your location with family for added safety.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      desc: 'Get notified about new rides matching your route, booking confirmations, and ride updates.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Users,
      title: 'Recurring Rides',
      desc: 'Set up your daily commute once and find regular co-travelers for your route.',
      color: 'bg-teal-100 text-teal-600',
    },
    {
      icon: Leaf,
      title: 'Carbon Tracking',
      desc: 'See your environmental impact. Track how much CO2 you have saved by carpooling.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      desc: 'Find rides for any time - morning commute, evening return, or weekend trips.',
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      icon: Shield,
      title: 'Insurance Coverage',
      desc: 'All rides are covered by our partner insurance for added peace of mind.',
      color: 'bg-amber-100 text-amber-600',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Features</h1>
          <p className="text-xl text-white/80">Everything you need for a better commute</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-main/30 transition-all"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
              <p className="text-neutral-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="bg-gradient-to-br from-primary-main to-secondary-main rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Join thousands of commuters already saving money and time with Poolo
          </p>
          <Link to="/register">
            <Button variant="outline" className="bg-white text-primary-main border-white hover:bg-white/90 px-8">
              Get Started Free <ChevronRight className="w-5 h-5 ml-1 inline" />
            </Button>
          </Link>
        </section>
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
