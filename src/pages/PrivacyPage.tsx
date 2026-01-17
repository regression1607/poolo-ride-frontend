import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary-main to-primary-dark text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/80">Last updated: January 2025</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">1. Information We Collect</h2>
            <p className="text-neutral-600 mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Account information (name, email, phone number)</li>
              <li>Profile information (profile photo, vehicle details)</li>
              <li>Ride information (pickup/drop locations, schedules)</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Communications between users</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-neutral-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Match riders with drivers going in the same direction</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">3. Information Sharing</h2>
            <p className="text-neutral-600 mb-4">
              We share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>With other users as needed to facilitate rides (e.g., sharing your pickup location with your driver)</li>
              <li>With service providers who assist in our operations</li>
              <li>In response to legal process or government requests</li>
              <li>To protect the rights and safety of Poolo, our users, and the public</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">4. Data Security</h2>
            <p className="text-neutral-600">
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. This 
              includes encryption of data in transit and at rest, regular security assessments, and 
              access controls.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">5. Your Rights</h2>
            <p className="text-neutral-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-neutral-600 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">6. Cookies</h2>
            <p className="text-neutral-600">
              We use cookies and similar technologies to collect information about your browsing 
              activities and to personalize your experience. You can control cookies through your 
              browser settings.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">7. Contact Us</h2>
            <p className="text-neutral-600">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-neutral-600 mt-2">
              <strong>Email:</strong> privacy@poolo.app<br />
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
