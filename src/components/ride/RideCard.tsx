import { Clock, Users, Star, Car, Bike } from 'lucide-react'
import { Ride, VehicleType } from '../../types'
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters'
import Button from '../ui/Button'

interface RideCardProps {
  ride: Ride;
  onBook?: (ride: Ride) => void;
  onViewDetails?: (ride: Ride) => void;
  showBookButton?: boolean;
  isBooking?: boolean;
}

const vehicleIcons: Record<VehicleType, typeof Car> = {
  bike: Bike,
  car: Car,
  cab: Car,
  suv: Car,
}

const vehicleLabels: Record<VehicleType, string> = {
  bike: 'Bike',
  car: 'Car',
  cab: 'Cab',
  suv: 'SUV',
}

export default function RideCard({
  ride,
  onBook,
  onViewDetails,
  showBookButton = true,
  isBooking = false,
}: RideCardProps) {
  const VehicleIcon = vehicleIcons[ride.vehicle_type] || Car
  const pickupDate = new Date(ride.pickup_time)

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 hover:shadow-lg transition-shadow">
      {/* Header - Driver Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-primary-main">
              {ride.driver?.name?.charAt(0).toUpperCase() || 'D'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{ride.driver?.name || 'Driver'}</p>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-special-gold fill-special-gold" />
              <span className="text-sm text-neutral-600">
                {ride.driver?.rating?.toFixed(1) || '5.0'} • {ride.driver?.total_rides || 0} rides
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary-main">{formatCurrency(ride.price_per_seat)}</p>
          <p className="text-xs text-neutral-500">per seat</p>
        </div>
      </div>

      {/* Route */}
      <div className="space-y-2 mb-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-3 h-3 bg-secondary-main rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 uppercase">Pickup</p>
            <p className="font-medium text-neutral-900 truncate">{ride.pickup_address}</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <div className="w-3 h-3 bg-status-error rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 uppercase">Drop</p>
            <p className="font-medium text-neutral-900 truncate">{ride.drop_address}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center gap-4 py-3 border-t border-neutral-100">
        <div className="flex items-center gap-1.5 text-neutral-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{formatDate(pickupDate)}, {formatTime(pickupDate)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-600">
          <Users className="w-4 h-4" />
          <span className="text-sm">{ride.available_seats} seat{ride.available_seats !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-600">
          <VehicleIcon className="w-4 h-4" />
          <span className="text-sm">{vehicleLabels[ride.vehicle_type]}</span>
        </div>
      </div>

      {/* Description */}
      {ride.description && (
        <p className="text-sm text-neutral-600 py-3 border-t border-neutral-100 line-clamp-2">
          {ride.description}
        </p>
      )}

      {/* Actions */}
      {showBookButton && (
        <div className="flex gap-3 pt-3 border-t border-neutral-100">
          {onViewDetails && (
            <Button variant="outline" className="flex-1" onClick={() => onViewDetails(ride)}>
              View Details
            </Button>
          )}
          {onBook && ride.available_seats > 0 && (
            <Button className="flex-1" onClick={() => onBook(ride)} loading={isBooking}>
              Book Now
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
