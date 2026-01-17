import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Users, Wallet, Leaf, MapPin, Shield, ChevronRight, Star, Smartphone, Bell, Zap, Check, Info, X } from 'lucide-react'
import Button from '../components/ui/Button'

// Version from env (set VITE_APP_VERSION in .env)
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'
const CHANGELOG = [
  {
    version: '1.0.0',
    date: '2026-01-18',
    changes: [
      'Initial release',
      'Search and book rides',
      'Publish your rides',
      'Real-time chat with drivers/passengers',
      'Booking notifications',
      'Map-based location picker',
    ],
  },
]

export default function LandingPage() {
  const [showChangelog, setShowChangelog] = useState(false)

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Poolo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-primary-main">Poolo</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-neutral-600 hover:text-primary-main font-medium transition-colors">
                Login
              </Link>
              <Link to="/register">
                <Button size="small">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-light/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-light/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6">
                Share Rides,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-main to-secondary-main">
                  Save Money
                </span>
                , Go Green
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Connect with fellow travelers heading your way. Split costs, reduce traffic, and make your commute more sustainable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button size="large" className="w-full sm:w-auto px-8">
                    Start Riding <ChevronRight className="w-5 h-5 ml-1 inline" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="large" className="w-full sm:w-auto px-8">
                    I have an account
                  </Button>
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-primary-main">10K+</div>
                  <div className="text-sm text-neutral-500">Active Users</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-primary-main">50K+</div>
                  <div className="text-sm text-neutral-500">Rides Shared</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-secondary-main">Rs2M+</div>
                  <div className="text-sm text-neutral-500">Saved</div>
                </div>
              </div>
            </div>

            <div className="relative animate-slide-in-right">
              <div className="relative">
                <img 
                  src="/images/bg-dashboard.jpg" 
                  alt="Carpooling" 
                  className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">500kg CO2</div>
                      <div className="text-xs text-neutral-500">Saved this month</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-primary-main" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">Rs2,500</div>
                      <div className="text-xs text-neutral-500">Avg. savings/month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose Poolo?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              The smartest way to commute. Save money, meet people, and help the environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wallet, title: 'Save Money', desc: 'Split fuel costs and save up to 75% on your daily commute', color: 'bg-green-100 text-green-600' },
              { icon: Users, title: 'Meet People', desc: 'Connect with like-minded commuters in your area', color: 'bg-blue-100 text-blue-600' },
              { icon: Leaf, title: 'Go Green', desc: 'Reduce your carbon footprint by sharing rides', color: 'bg-emerald-100 text-emerald-600' },
              { icon: Shield, title: 'Safe & Secure', desc: 'Verified users and secure payment system', color: 'bg-purple-100 text-purple-600' },
            ].map((feature) => (
              <div 
                key={feature.title} 
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-light text-primary-main px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Smartphone className="w-4 h-4" />
                Mobile Experience
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
                Better on Your Phone
              </h2>
              <p className="text-lg text-neutral-600 mb-6">
                For the best Poolo experience, use our mobile-optimized web app. Add it to your home screen for quick access - no download required!
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Real-time Location</h3>
                    <p className="text-neutral-600 text-sm">Get accurate pickup points with GPS</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Instant Notifications</h3>
                    <p className="text-neutral-600 text-sm">Never miss a ride update</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">Lightning Fast</h3>
                    <p className="text-neutral-600 text-sm">Optimized for mobile performance</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-sm text-neutral-600 mb-2"><strong>How to install:</strong></p>
                <p className="text-sm text-neutral-500">Open this site on your phone browser → Tap Share → Add to Home Screen</p>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="w-64 h-[500px] bg-neutral-900 rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                    <div className="bg-primary-main text-white p-4 pt-8">
                      <div className="flex items-center gap-2 mb-2">
                        <img src="/images/logo.png" alt="Poolo" className="h-6 w-auto" />
                        <span className="font-bold">Poolo</span>
                      </div>
                      <p className="text-sm text-white/80">Find your ride</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="bg-neutral-100 rounded-lg p-3">
                        <div className="text-xs text-neutral-500 mb-1">From</div>
                        <div className="text-sm font-medium">Bangalore</div>
                      </div>
                      <div className="bg-neutral-100 rounded-lg p-3">
                        <div className="text-xs text-neutral-500 mb-1">To</div>
                        <div className="text-sm font-medium">Chennai</div>
                      </div>
                      <div className="bg-primary-main text-white rounded-lg p-3 text-center text-sm font-medium">
                        Search Rides
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce-slow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Works offline!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-main to-secondary-main"></div>
            
            {[
              { step: 1, icon: MapPin, title: 'Enter Your Route', desc: 'Tell us where you are going and when' },
              { step: 2, icon: Car, title: 'Find a Ride', desc: 'Browse available rides or publish your own' },
              { step: 3, icon: Star, title: 'Travel Together', desc: 'Meet, share the ride, and save money' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-main to-secondary-main rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <item.icon className="w-7 h-7 text-white" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-primary-main shadow">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-main to-primary-dark text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Join thousands of happy commuters
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya S.', role: 'Daily Commuter', text: 'Poolo has saved me Rs3000 every month! Plus I have made great friends during my commute.', rating: 5 },
              { name: 'Rahul M.', role: 'Car Owner', text: 'I publish my ride daily and it covers my fuel costs completely. Win-win!', rating: 5 },
              { name: 'Anita K.', role: 'Student', text: 'As a student, this app is a lifesaver. Affordable and safe rides to college.', rating: 5 },
            ].map((testimonial) => (
              <div 
                key={testimonial.name} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-semibold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-white/60">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            Ready to Start Saving?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join Poolo today and transform your daily commute
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="large" className="w-full sm:w-auto px-8">
                Create Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="large" className="w-full sm:w-auto px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/logo.png" alt="Poolo" className="h-8 w-auto brightness-0 invert" />
                <span className="text-xl font-bold">Poolo</span>
              </div>
              <p className="text-neutral-400 text-sm">
                Making commutes affordable, social, and sustainable.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it works</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About us</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} Poolo. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Version Badge */}
      <button
        onClick={() => setShowChangelog(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full shadow-md hover:bg-neutral-50 hover:shadow-lg transition-all text-xs text-neutral-600"
      >
        <Info className="w-3.5 h-3.5" />
        v{APP_VERSION}
      </button>

      {/* Changelog Modal */}
      {showChangelog && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900">What's New</h2>
              <button
                onClick={() => setShowChangelog(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {CHANGELOG.map((release) => (
                <div key={release.version} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-primary-100 text-primary-main text-sm font-semibold rounded">
                      v{release.version}
                    </span>
                    <span className="text-sm text-neutral-500">{release.date}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {release.changes.map((change, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="text-primary-main mt-1">•</span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              <p className="text-xs text-neutral-500 text-center">
                Poolo - Share rides, save money, reduce traffic
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
