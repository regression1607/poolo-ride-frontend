import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-white/80">Last updated: January 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-600">
              By accessing or using Poolo, you agree to be bound by these Terms of Service. If you 
              do not agree to these terms, please do not use our service. We reserve the right to 
              modify these terms at any time, and your continued use constitutes acceptance of any changes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. Service Description</h2>
            <p className="text-neutral-600">
              Poolo is a carpooling platform that connects drivers with empty seats to passengers 
              traveling in the same direction. We facilitate the connection but are not a transportation 
              provider. The actual ride is a private arrangement between the driver and passenger.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. User Accounts</h2>
            <p className="text-neutral-600 mb-4">To use Poolo, you must:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Driver Requirements</h2>
            <p className="text-neutral-600 mb-4">Drivers must:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Hold a valid driving license</li>
              <li>Have valid vehicle insurance</li>
              <li>Ensure their vehicle is roadworthy and safe</li>
              <li>Follow all applicable traffic laws and regulations</li>
              <li>Not operate under the influence of alcohol or drugs</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Passenger Responsibilities</h2>
            <p className="text-neutral-600 mb-4">Passengers agree to:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Be at the pickup location on time</li>
              <li>Treat drivers and other passengers with respect</li>
              <li>Pay the agreed fare through the platform</li>
              <li>Not engage in any illegal activities during the ride</li>
              <li>Wear seatbelts at all times</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Payments</h2>
            <p className="text-neutral-600">
              All payments are processed through our secure payment system. The fare shown is the 
              cost-sharing amount to cover fuel and vehicle expenses. Poolo may charge a service 
              fee to facilitate the platform. Cancellation fees may apply as per our cancellation policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Prohibited Conduct</h2>
            <p className="text-neutral-600 mb-4">Users must not:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Use the service for commercial transportation purposes</li>
              <li>Harass, threaten, or discriminate against other users</li>
              <li>Provide false information or impersonate others</li>
              <li>Attempt to circumvent the payment system</li>
              <li>Use the platform to transport illegal substances</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-neutral-600">
              Poolo is not liable for any damages arising from the use of our service, including but 
              not limited to accidents, injuries, property damage, or disputes between users. Users 
              participate in rides at their own risk.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">9. Termination</h2>
            <p className="text-neutral-600">
              We reserve the right to suspend or terminate your account at any time for violations 
              of these terms or for any other reason at our discretion. You may also delete your 
              account at any time through the app settings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">10. Contact</h2>
            <p className="text-neutral-600">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-neutral-600 mt-2">
              <strong>Email:</strong> legal@poolo.app<br />
              <strong>Address:</strong> Bangalore, Karnataka, India
            </p>
          </section>
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
