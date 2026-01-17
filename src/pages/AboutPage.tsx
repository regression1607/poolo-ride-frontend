import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Target, Heart, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Poolo</h1>
          <p className="text-xl text-white/80">Making commutes affordable, social, and sustainable</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Mission */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-main" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Our Mission</h2>
          </div>
          <p className="text-neutral-600 text-lg leading-relaxed">
            At Poolo, we believe that every empty seat in a car is a missed opportunity to save money, 
            reduce traffic, and protect our environment. Our mission is to connect people heading in the 
            same direction, making carpooling easy, safe, and rewarding for everyone.
          </p>
        </section>

        {/* Story */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-secondary-main" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Our Story</h2>
          </div>
          <p className="text-neutral-600 text-lg leading-relaxed mb-4">
            Poolo was born from a simple observation: millions of cars travel with empty seats every day, 
            while countless commuters struggle with rising fuel costs and crowded public transport.
          </p>
          <p className="text-neutral-600 text-lg leading-relaxed">
            We started in 2024 with a vision to transform the way people commute. Today, we are proud to 
            serve thousands of users who share rides, save money, and make new friends along the way.
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Users, title: 'Community First', desc: 'We build connections that go beyond just sharing a ride' },
              { icon: Globe, title: 'Sustainability', desc: 'Every shared ride means less pollution and a greener planet' },
              { icon: Heart, title: 'Trust & Safety', desc: 'Your safety is our top priority with verified profiles and reviews' },
              { icon: Target, title: 'Accessibility', desc: 'Affordable rides for everyone, everywhere' },
            ].map((value) => (
              <div key={value.title} className="bg-neutral-50 rounded-xl p-6">
                <value.icon className="w-8 h-8 text-primary-main mb-3" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{value.title}</h3>
                <p className="text-neutral-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-br from-primary-main to-secondary-main rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-8">Our Impact</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl sm:text-4xl font-bold">10K+</div>
              <div className="text-white/80">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">50K+</div>
              <div className="text-white/80">Rides Shared</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold">500T</div>
              <div className="text-white/80">CO2 Saved</div>
            </div>
          </div>
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
