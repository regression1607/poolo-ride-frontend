import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Briefcase, ChevronRight, Heart, Zap, Users } from 'lucide-react'
import Button from '../components/ui/Button'

export default function CareersPage() {
  const jobs = [
    {
      title: 'Senior React Developer',
      department: 'Engineering',
      location: 'Bangalore',
      type: 'Full-time',
    },
    {
      title: 'Backend Engineer (Node.js)',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Bangalore',
      type: 'Full-time',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Delhi',
      type: 'Full-time',
    },
    {
      title: 'Customer Support Lead',
      department: 'Operations',
      location: 'Remote',
      type: 'Full-time',
    },
  ]

  const perks = [
    { icon: Heart, title: 'Health Insurance', desc: 'Comprehensive coverage for you and family' },
    { icon: Zap, title: 'Flexible Hours', desc: 'Work when you are most productive' },
    { icon: Users, title: 'Great Team', desc: 'Collaborate with passionate individuals' },
    { icon: Briefcase, title: 'Growth', desc: 'Learning budget and career development' },
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-white/80">Help us transform how people commute</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Intro */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Build the Future of Mobility
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            At Poolo, we are on a mission to make commuting affordable and sustainable. 
            Join our team of passionate individuals working to connect millions of commuters.
          </p>
        </section>

        {/* Perks */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Why Work With Us</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {perks.map((perk) => (
              <div key={perk.title} className="flex gap-4 p-4 bg-neutral-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <perk.icon className="w-6 h-6 text-primary-main" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{perk.title}</h3>
                  <p className="text-neutral-600 text-sm">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div 
                key={job.title} 
                className="border border-neutral-200 rounded-xl p-6 hover:border-primary-main hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-main transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-neutral-500">{job.department}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                    <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-main transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* No suitable role */}
        <section className="bg-gradient-to-br from-primary-main to-secondary-main rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Do not see a suitable role?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            We are always looking for talented people. Send us your resume and we will reach out when a matching position opens.
          </p>
          <Link to="/contact">
            <Button variant="outline" className="bg-white text-primary-main border-white hover:bg-white/90">
              Send Your Resume
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
