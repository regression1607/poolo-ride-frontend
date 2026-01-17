export interface User {
  id: string
  email: string
  name: string
  username: string
  phone_number?: string
  profile_picture?: string
  rating: number
  total_rides: number
  is_verified: boolean
  created_at: string
}

export type VehicleType = 'bike' | 'car' | 'cab' | 'suv'
export type RideStatus = 'available' | 'active' | 'completed' | 'cancelled'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Ride {
  id: string
  driver_id: string
  pickup_address: string
  pickup_latitude?: number
  pickup_longitude?: number
  drop_address: string
  drop_latitude?: number
  drop_longitude?: number
  pickup_time: string
  expected_drop_time?: string
  total_seats: number
  available_seats: number
  vehicle_type: VehicleType
  price_per_seat: number
  description?: string
  status: RideStatus
  created_at: string
  updated_at: string
  driver?: User
}

export interface RideBooking {
  id: string
  ride_id: string
  passenger_id: string
  seats_booked: number
  booking_status: BookingStatus
  total_price: number
  booked_at: string
  updated_at: string
  ride?: Ride
  passenger?: User
}

export interface RideMessage {
  id: string
  ride_id: string
  sender_id: string
  receiver_id: string
  message: string
  message_type: 'text' | 'image' | 'location'
  is_read: boolean
  sent_at: string
  sender?: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  username: string
  phone_number?: string
}

export interface SearchFilters {
  pickup_location?: string
  drop_location?: string
  pickup_date?: string
  seats_needed?: number
  vehicle_type?: VehicleType
  max_price?: number
}
