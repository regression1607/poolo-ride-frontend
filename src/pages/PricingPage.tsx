import { Link } from 'react-router-dom'
import { ArrowLeft, Check, Heart, ChevronRight } from 'lucide-react'
import Button from '../components/ui/Button'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">100% Free Platform</h1>
          <p className="text-xl text-white/80">No fees, no charges - just share rides!</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Free Banner */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Poolo is Completely Free!</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-6">
            We believe in making carpooling accessible to everyone. That is why we do not charge any fees 
            for using our platform. The only cost? The ride fare you pay directly to your driver.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold">
            <Check className="w-5 h-5" />
            Zero Platform Fees
          </div>
        </div>

        {/* What You Get */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
            Everything Free, Forever
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Unlimited ride searches',
              'Unlimited ride bookings',
              'Publish unlimited rides',
              'In-app messaging',
              'User ratings & reviews',
              'Verified profiles',
              'Ride tracking',
              '24/7 customer support',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 bg-neutral-50 rounded-xl p-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-neutral-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How Payment Works */}
        <section className="bg-neutral-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
            How Payment Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-primary-main text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Driver Sets the Price</h3>
                <p className="text-neutral-600">Drivers decide how much to charge per seat based on fuel costs and distance.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-primary-main text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">You Book the Ride</h3>
                <p className="text-neutral-600">Browse available rides and book one that fits your schedule and budget.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-primary-main text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">Pay the Driver Directly</h3>
                <p className="text-neutral-600">Pay the fare directly to your driver in cash or UPI. We do not take any cut!</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-neutral-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Why is Poolo free?',
                a: 'We believe carpooling should be accessible to everyone. Our mission is to reduce traffic and help the environment, not to make money from commuters.'
              },
              {
                q: 'How does Poolo make money then?',
                a: 'Currently, we are focused on building a great community. In the future, we may introduce optional premium features, but the core service will always be free.'
              },
              {
                q: 'Is Poolo a taxi service?',
                a: 'No, Poolo is a carpooling platform. Drivers are regular commuters sharing their journey and costs, not professional taxi drivers.'
              },
              {
                q: 'Are there any hidden fees?',
                a: 'Absolutely not! The only money that changes hands is between you and the driver for sharing fuel costs. Poolo takes zero commission.'
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-neutral-50 rounded-xl p-6">
                <h3 className="font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                <p className="text-neutral-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Start Saving?</h2>
          <p className="text-neutral-600 mb-6">Join thousands of commuters sharing rides for free</p>
          <Link to="/register">
            <Button size="large" className="px-8">
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
