import { Bike, Car } from 'lucide-react'
import clsx from 'clsx'
import { VehicleType } from '../../types'

interface VehicleOption {
  type: VehicleType;
  label: string;
  description: string;
  seats: string;
  icon: typeof Bike | typeof Car;
}

const vehicleOptions: VehicleOption[] = [
  { type: 'bike', label: 'Bike', description: '2-wheeler', seats: '1 seat', icon: Bike },
  { type: 'car', label: 'Car', description: 'Hatchback/Sedan', seats: '3 seats', icon: Car },
  { type: 'cab', label: 'Cab', description: 'Taxi/Cab', seats: '4 seats', icon: Car },
  { type: 'suv', label: 'SUV', description: 'SUV/MUV', seats: '6 seats', icon: Car },
]

interface VehicleTypeSelectorProps {
  value: VehicleType | 'all';
  onChange: (value: VehicleType | 'all') => void;
  showAllOption?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

export default function VehicleTypeSelector({
  value,
  onChange,
  showAllOption = false,
  label = 'Vehicle Type',
  error,
  className,
}: VehicleTypeSelectorProps) {
  const options = showAllOption
    ? [{ type: 'all' as const, label: 'All', description: 'Any vehicle', seats: 'Any', icon: Car }, ...vehicleOptions]
    : vehicleOptions

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = value === option.type
          
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => onChange(option.type)}
              className={clsx(
                'p-4 rounded-xl border-2 transition-all text-left',
                isSelected
                  ? 'border-primary-main bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              )}
            >
              <div className={clsx(
                'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                isSelected ? 'bg-primary-main' : 'bg-neutral-100'
              )}>
                <Icon className={clsx('w-5 h-5', isSelected ? 'text-white' : 'text-neutral-600')} />
              </div>
              <p className={clsx(
                'font-semibold',
                isSelected ? 'text-primary-main' : 'text-neutral-900'
              )}>
                {option.label}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">{option.seats}</p>
            </button>
          )
        })}
      </div>
      
      {error && <p className="text-sm text-status-error mt-2">{error}</p>}
    </div>
  )
}
