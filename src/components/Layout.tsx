import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Search, PlusCircle, Car, MessageSquare, User, LogOut, Info, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

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

const navItems = [
  { path: '/search', label: 'Search', icon: Search },
  { path: '/publish', label: 'Publish', icon: PlusCircle },
  { path: '/rides', label: 'My Rides', icon: Car },
  { path: '/inbox', label: 'Inbox', icon: MessageSquare },
  { path: '/profile', label: 'Profile', icon: User },
]

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showChangelog, setShowChangelog] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Car className="w-8 h-8 text-primary-main" />
              <span className="text-2xl font-bold text-primary-main">Poolo</span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-main'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-main">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-neutral-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-500 hover:text-status-error hover:bg-neutral-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive ? 'text-primary-main' : 'text-neutral-500'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Version Badge - Desktop */}
      <button
        onClick={() => setShowChangelog(true)}
        className="hidden md:flex fixed bottom-4 right-4 items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full shadow-sm hover:bg-neutral-50 transition-colors text-xs text-neutral-600"
      >
        <Info className="w-3.5 h-3.5" />
        v{APP_VERSION}
      </button>

      {/* Version Badge - Mobile (above bottom nav) */}
      <button
        onClick={() => setShowChangelog(true)}
        className="md:hidden fixed bottom-20 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full shadow-sm text-xs text-neutral-600"
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
