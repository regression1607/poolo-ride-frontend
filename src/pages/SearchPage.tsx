import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Car, Bike, Truck, Star, Clock, CheckCircle, Filter } from 'lucide-react'
import Button from '../components/ui/Button'
import LocationPicker from '../components/LocationPicker'
import { Ride, VehicleType, RideBooking } from '../types'
import { ridesApi, bookingsApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

// Distance filter options in km
const DISTANCE_FILTERS = [
  { value: 1, label: '1 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20 km' },
  { value: 50, label: '50 km' },
]

// Haversine formula to calculate distance between two coordinates
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const vehicleTypes: { type: VehicleType | 'all'; label: string; icon: any }[] = [
  { type: 'all', label: 'All', icon: Car },
  { type: 'bike', label: 'Bike', icon: Bike },
  { type: 'car', label: 'Car', icon: Car },
  { type: 'cab', label: 'Cab', icon: Truck },
]

const popularRoutes = [
  { from: 'Delhi', to: 'Gurgaon' },
  { from: 'Noida', to: 'Delhi' },
  { from: 'Gurgaon', to: 'Noida' },
]

export default function SearchPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [fromLocation, setFromLocation] = useState('')
  const [fromCoords, setFromCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [toLocation, setToLocation] = useState('')
  const [toCoords, setToCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow'>('today')
  const [seatsNeeded, setSeatsNeeded] = useState(1)
  const [vehicleType, setVehicleType] = useState<VehicleType | 'all'>('all')
  const [distanceFilter, setDistanceFilter] = useState(50) // Default 10km
  const [searchResults, setSearchResults] = useState<Ride[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingRideId, setBookingRideId] = useState<string | null>(null)
  const [userBookings, setUserBookings] = useState<RideBooking[]>([])
  const [showDistanceFilter, setShowDistanceFilter] = useState(false)

  // Fetch user's bookings on mount
  useEffect(() => {
    if (user) {
      bookingsApi.getMyBookings()
        .then(setUserBookings)
        .catch(console.error)
    }
  }, [user])

  // Check if user has booked a specific ride
  const hasBookedRide = (rideId: string) => {
    return userBookings.some(
      (booking) => booking.ride_id === rideId && 
      ['pending', 'confirmed'].includes(booking.booking_status)
    )
  }

  const handleSearch = async () => {
    if (!fromLocation || !toLocation) {
      alert('Please enter both pickup and drop locations')
      return
    }

    setIsLoading(true)
    try {
      const rides = await ridesApi.getAvailable()
      
      // Filter rides based on criteria
      const filtered = rides.filter((ride) => {
        const matchesVehicle = vehicleType === 'all' || ride.vehicle_type === vehicleType
        const matchesSeats = ride.available_seats >= seatsNeeded
        
        // Distance-based filtering if coordinates available
        let matchesPickup = true
        let matchesDrop = true
        
        if (fromCoords && ride.pickup_latitude && ride.pickup_longitude) {
          const pickupDistance = getDistanceKm(
            fromCoords.lat, fromCoords.lng,
            ride.pickup_latitude, ride.pickup_longitude
          )
          matchesPickup = pickupDistance <= distanceFilter
        } else {
          // Fallback to text matching
          matchesPickup = ride.pickup_address.toLowerCase().includes(fromLocation.toLowerCase().split(',')[0])
        }
        
        if (toCoords && ride.drop_latitude && ride.drop_longitude) {
          const dropDistance = getDistanceKm(
            toCoords.lat, toCoords.lng,
            ride.drop_latitude, ride.drop_longitude
          )
          matchesDrop = dropDistance <= distanceFilter
          
          // Also check if passenger's drop location is along the driver's route
          if (!matchesDrop && fromCoords && ride.pickup_latitude && ride.pickup_longitude) {
            const rideStart = { lat: ride.pickup_latitude, lng: ride.pickup_longitude }
            const rideEnd = { lat: ride.drop_latitude, lng: ride.drop_longitude }
            const passengerDrop = { lat: toCoords.lat, lng: toCoords.lng }
            
            // Check if passenger drop is along the route
            const totalRouteDistance = getDistanceKm(
              rideStart.lat, rideStart.lng,
              rideEnd.lat, rideEnd.lng
            )
            const distanceToPassengerDrop = 
              getDistanceKm(rideStart.lat, rideStart.lng, passengerDrop.lat, passengerDrop.lng) +
              getDistanceKm(passengerDrop.lat, passengerDrop.lng, rideEnd.lat, rideEnd.lng)
            
            // If passenger drop is along the route (within 20% deviation)
            matchesDrop = distanceToPassengerDrop <= totalRouteDistance * 1.2
          }
        } else {
          // Fallback to text matching
          matchesDrop = ride.drop_address.toLowerCase().includes(toLocation.toLowerCase().split(',')[0])
        }
        
        return matchesVehicle && matchesSeats && matchesPickup && matchesDrop
      })
      
      setSearchResults(filtered)
      setShowResults(true)
    } catch (error) {
      console.error('Search failed:', error)
      alert('Failed to search rides. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBookRide = async (ride: Ride) => {
    if (!user) {
      alert('Please login to book a ride')
      return
    }

    setBookingRideId(ride.id)
    try {
      // Backend automatically sends booking notification to driver
      const booking = await bookingsApi.create({
        ride_id: ride.id,
        seats_booked: seatsNeeded,
      })
      // Update local bookings state
      setUserBookings((prev) => [...prev, booking])
      // Redirect to My Rides page with booked tab
      navigate('/rides?tab=booked')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to book ride')
    } finally {
      setBookingRideId(null)
    }
  }

  const handlePopularRoute = (from: string, to: string) => {
    setFromLocation(from)
    setToLocation(to)
  }

  if (showResults) {
    return (
      <div>
        {/* Results Header */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-card">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowResults(false)}
              className="text-neutral-600 hover:text-neutral-900"
            >
              ← Back
            </button>
            <div className="text-center">
              <p className="font-semibold text-neutral-900">{fromLocation} → {toLocation}</p>
              <p className="text-sm text-neutral-500">
                {selectedDate === 'today' ? 'Today' : 'Tomorrow'} • {seatsNeeded} seat{seatsNeeded > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowResults(false)}
              className="text-primary-main text-sm font-medium"
            >
              Modify
            </button>
          </div>
        </div>

        {/* Results Stats & Filter */}
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-neutral-900">
            {searchResults.length} ride{searchResults.length !== 1 ? 's' : ''} found
          </p>
          <div className="relative">
            <button
              onClick={() => setShowDistanceFilter(!showDistanceFilter)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <Filter className="w-4 h-4" />
              Within {distanceFilter} km
            </button>
            {showDistanceFilter && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg z-10 py-1 min-w-[120px]">
                {DISTANCE_FILTERS.map((df) => (
                  <button
                    key={df.value}
                    onClick={() => {
                      setDistanceFilter(df.value)
                      setShowDistanceFilter(false)
                      // Re-run search with new filter
                      handleSearch()
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      distanceFilter === df.value
                        ? 'bg-primary-100 text-primary-main font-medium'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {df.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results List */}
        {searchResults.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-card">
            <Car className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No rides found</h3>
            <p className="text-neutral-600 mb-4">Try adjusting your search criteria</p>
            <Button onClick={() => setShowResults(false)} variant="secondary">
              Modify Search
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                seatsNeeded={seatsNeeded}
                onBook={() => handleBookRide(ride)}
                isBooking={bookingRideId === ride.id}
                isBooked={hasBookedRide(ride.id)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Find your perfect ride</h1>
        <p className="text-neutral-600">Share costs, reduce traffic, make friends!</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="bg-primary-50 rounded-lg p-3 mb-4 flex items-start gap-2">
          <span className="text-lg">💡</span>
          <p className="text-sm text-neutral-700">
            Tip: Search city to city (e.g., "Faridabad" to "Noida") for better results
          </p>
        </div>

        <div className="space-y-4">
          <LocationPicker
            placeholder="From: Pickup location"
            value={fromLocation}
            onChange={(location, coords) => {
              setFromLocation(location)
              setFromCoords(coords || null)
            }}
            icon="pickup"
          />

          <LocationPicker
            placeholder="To: Drop location"
            value={toLocation}
            onChange={(location, coords) => {
              setToLocation(location)
              setToCoords(coords || null)
            }}
            icon="drop"
          />

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              When are you traveling?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedDate('today')}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-colors ${
                  selectedDate === 'today'
                    ? 'border-primary-main bg-primary-100 text-primary-main'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedDate('tomorrow')}
                className={`py-3 px-4 rounded-xl border text-center font-medium transition-colors ${
                  selectedDate === 'tomorrow'
                    ? 'border-primary-main bg-primary-100 text-primary-main'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          {/* Seats Selector */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Seats needed
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setSeatsNeeded(Math.max(1, seatsNeeded - 1))}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-lg font-semibold hover:bg-neutral-50"
              >
                -
              </button>
              <span className="text-xl font-semibold text-neutral-900 min-w-[40px] text-center">
                {seatsNeeded}
              </span>
              <button
                onClick={() => setSeatsNeeded(Math.min(4, seatsNeeded + 1))}
                className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-lg font-semibold hover:bg-neutral-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Preferred vehicle type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {vehicleTypes.map((vt) => (
                <button
                  key={vt.type}
                  onClick={() => setVehicleType(vt.type)}
                  className={`py-2 px-3 rounded-lg border text-center text-sm font-medium transition-colors flex flex-col items-center gap-1 ${
                    vehicleType === vt.type
                      ? 'border-primary-main bg-primary-100 text-primary-main'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <vt.icon className="w-5 h-5" />
                  {vt.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSearch} className="w-full" size="large" loading={isLoading}>
            <Search className="w-5 h-5 mr-2" />
            Search Rides
          </Button>
        </div>
      </div>

      {/* Popular Routes */}
      <div>
        <h3 className="font-semibold text-neutral-900 mb-3">Popular routes</h3>
        <div className="flex flex-wrap gap-2">
          {popularRoutes.map((route, index) => (
            <button
              key={index}
              onClick={() => handlePopularRoute(route.from, route.to)}
              className="bg-primary-50 text-primary-main px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
            >
              {route.from} → {route.to}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function RideCard({
  ride,
  seatsNeeded,
  onBook,
  isBooking,
  isBooked,
}: {
  ride: Ride
  seatsNeeded: number
  onBook: () => void
  isBooking: boolean
  isBooked: boolean
}) {
  const departureTime = new Date(ride.pickup_time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-primary-main" />
          <span className="text-sm font-semibold text-primary-main uppercase">
            {ride.vehicle_type}
          </span>
        </div>
        <span className="text-xs text-secondary-main font-medium bg-secondary-50 px-2 py-1 rounded">
          {ride.available_seats} seats available
        </span>
      </div>

      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-secondary-main"></div>
          <span className="text-sm text-neutral-700">{ride.pickup_address}</span>
        </div>
        <div className="ml-1 border-l border-dashed border-neutral-300 h-4"></div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-error"></div>
          <span className="text-sm text-neutral-700">{ride.drop_address}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-neutral-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{departureTime}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-neutral-900">₹{ride.price_per_seat}</span>
          <span className="text-sm text-neutral-500"> /seat</span>
        </div>
      </div>

      {ride.driver && (
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-200">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-main">
              {ride.driver.name?.charAt(0) || 'D'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">{ride.driver.name}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-special-gold fill-special-gold" />
            <span className="text-sm font-medium">{ride.driver.rating?.toFixed(1) || '5.0'}</span>
          </div>
        </div>
      )}

      {isBooked ? (
        <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-medium flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Already Booked
        </div>
      ) : (
        <Button onClick={onBook} className="w-full" loading={isBooking}>
          Book {seatsNeeded} Seat{seatsNeeded > 1 ? 's' : ''} • ₹{ride.price_per_seat * seatsNeeded}
        </Button>
      )}
    </div>
  )
}
