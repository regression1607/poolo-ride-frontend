import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Car, Ticket, Clock, RefreshCw } from 'lucide-react'
import Button from '../components/ui/Button'
import { Ride, RideBooking } from '../types'
import { ridesApi, bookingsApi } from '../services/api'

type TabType = 'published' | 'booked'

export default function MyRidesPage() {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as TabType | null
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl === 'booked' ? 'booked' : 'published')
  const [publishedRides, setPublishedRides] = useState<Ride[]>([])
  const [bookedRides, setBookedRides] = useState<RideBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    loadRides()
  }, [])

  const loadRides = async () => {
    setIsLoading(true)
    try {
      const [published, booked] = await Promise.all([
        ridesApi.getMyPublished(),
        bookingsApi.getMyBookings(),
      ])
      setPublishedRides(published)
      setBookedRides(booked)
    } catch (error) {
      console.error('Failed to load rides:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRide = async (rideId: string) => {
    if (!confirm('Are you sure you want to cancel this ride?')) return
    setCancellingId(rideId)
    try {
      await ridesApi.updateStatus(rideId, 'cancelled')
      alert('Ride cancelled successfully')
      loadRides()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel ride')
    } finally {
      setCancellingId(null)
    }
  }

  const handleCancelBooking = async (booking: RideBooking) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    setCancellingId(booking.id)
    try {
      // Backend automatically sends cancellation notification to driver
      await bookingsApi.cancel(booking.id)
      alert('Booking cancelled successfully')
      loadRides()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
      case 'confirmed':
        return 'text-secondary-main bg-secondary-50'
      case 'completed':
        return 'text-neutral-600 bg-neutral-100'
      case 'cancelled':
        return 'text-status-error bg-status-error/10'
      case 'pending':
        return 'text-special-orange bg-special-orange/10'
      default:
        return 'text-neutral-500 bg-neutral-100'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-main"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Rides</h1>
        <button onClick={loadRides} className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-xl p-1 shadow-card mb-6">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveTab('published')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'published' ? 'bg-primary-100 text-primary-main' : 'text-neutral-600 hover:bg-neutral-50'}`}
          >
            <Car className="w-5 h-5" />
            Published ({publishedRides.length})
          </button>
          <button
            onClick={() => setActiveTab('booked')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors ${activeTab === 'booked' ? 'bg-primary-100 text-primary-main' : 'text-neutral-600 hover:bg-neutral-50'}`}
          >
            <Ticket className="w-5 h-5" />
            Booked ({bookedRides.length})
          </button>
        </div>
      </div>

      {activeTab === 'published' ? (
        publishedRides.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-card">
            <Car className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No published rides</h3>
            <p className="text-neutral-600">Start by publishing your first ride</p>
          </div>
        ) : (
          <div className="space-y-4">
            {publishedRides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-xl shadow-card p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(ride.status)}`}>{ride.status}</span>
                  <span className="text-sm text-neutral-500">{ride.available_seats}/{ride.total_seats} seats</span>
                </div>
                <div className="mb-3">
                  <p className="font-medium text-neutral-900">{ride.pickup_address}</p>
                  <p className="text-sm text-neutral-500">↓</p>
                  <p className="font-medium text-neutral-900">{ride.drop_address}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{new Date(ride.pickup_time).toLocaleString()}</span>
                  </div>
                  <span className="font-bold text-primary-main">₹{ride.price_per_seat}/seat</span>
                </div>
                {ride.status === 'available' && (
                  <Button variant="outline" size="small" className="w-full mt-4" onClick={() => handleCancelRide(ride.id)} loading={cancellingId === ride.id}>
                    Cancel Ride
                  </Button>
                )}
              </div>
            ))}
          </div>
        )
      ) : bookedRides.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-card">
          <Ticket className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No booked rides</h3>
          <p className="text-neutral-600">Search for rides and book your first trip</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookedRides.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-card p-4">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(booking.booking_status)}`}>{booking.booking_status}</span>
                <span className="text-sm text-neutral-500">{booking.seats_booked} seat(s)</span>
              </div>
              {booking.ride && (
                <div className="mb-3">
                  <p className="font-medium text-neutral-900">{booking.ride.pickup_address}</p>
                  <p className="text-sm text-neutral-500">↓</p>
                  <p className="font-medium text-neutral-900">{booking.ride.drop_address}</p>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total: ₹{booking.total_price}</span>
                {booking.booking_status === 'confirmed' && (
                  <Button variant="outline" size="small" onClick={() => handleCancelBooking(booking)} loading={cancellingId === booking.id}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
