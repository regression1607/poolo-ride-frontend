import { Link } from 'react-router-dom'
import { ArrowLeft, UserPlus, Search, Car, CreditCard, Star, Shield, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">How Poolo Works</h1>
          <p className="text-xl text-white/80">Simple, safe, and affordable ride sharing</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* For Passengers */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">For Passengers</h2>
          <div className="space-y-8">
            {[
              { 
                step: 1, 
                icon: UserPlus, 
                title: 'Create Your Account', 
                desc: 'Sign up with your email and verify your phone number. Add a profile photo to help drivers recognize you.',
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                step: 2, 
                icon: Search, 
                title: 'Search for Rides', 
                desc: 'Enter your pickup and drop locations, select your date, and browse available rides from verified drivers.',
                color: 'bg-green-100 text-green-600'
              },
              { 
                step: 3, 
                icon: CreditCard, 
                title: 'Book & Pay', 
                desc: 'Choose a ride that fits your schedule and budget. Book instantly and pay securely through the app.',
                color: 'bg-purple-100 text-purple-600'
              },
              { 
                step: 4, 
                icon: Car, 
                title: 'Enjoy Your Ride', 
                desc: 'Meet your driver at the pickup point, enjoy a comfortable ride, and arrive at your destination safely.',
                color: 'bg-orange-100 text-orange-600'
              },
              { 
                step: 5, 
                icon: Star, 
                title: 'Rate & Review', 
                desc: 'Share your experience by rating your driver. Your feedback helps maintain our community standards.',
                color: 'bg-yellow-100 text-yellow-600'
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center relative`}>
                    <item.icon className="w-8 h-8" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary-main text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden sm:block absolute left-8 mt-16 h-8 w-0.5 bg-neutral-200"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-neutral-200 my-12"></div>

        {/* For Drivers */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">For Drivers</h2>
          <div className="space-y-8">
            {[
              { 
                step: 1, 
                icon: UserPlus, 
                title: 'Register as Driver', 
                desc: 'Create your account and add your vehicle details including model, color, and license plate number.',
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                step: 2, 
                icon: Car, 
                title: 'Publish Your Ride', 
                desc: 'Enter your route, departure time, available seats, and set your price per seat.',
                color: 'bg-green-100 text-green-600'
              },
              { 
                step: 3, 
                icon: Search, 
                title: 'Accept Bookings', 
                desc: 'Review passenger profiles and accept bookings. Get notified when someone books your ride.',
                color: 'bg-purple-100 text-purple-600'
              },
              { 
                step: 4, 
                icon: CreditCard, 
                title: 'Get Paid', 
                desc: 'Receive payments directly to your account after each completed ride. Cover your fuel costs!',
                color: 'bg-orange-100 text-orange-600'
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center relative`}>
                    <item.icon className="w-8 h-8" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-secondary-main text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-neutral-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Section */}
        <section className="bg-neutral-50 rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Your Safety Matters</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Verified user profiles',
              'In-app messaging',
              'Ride tracking',
              'Emergency contacts',
              'User ratings & reviews',
              '24/7 support',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-neutral-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Start?</h2>
          <p className="text-neutral-600 mb-6">Join thousands of commuters saving money every day</p>
          <Link to="/register">
            <Button size="large" className="px-8">
              Create Free Account <ChevronRight className="w-5 h-5 ml-1 inline" />
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
