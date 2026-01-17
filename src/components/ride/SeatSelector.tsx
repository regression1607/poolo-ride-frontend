import { Minus, Plus, Users } from 'lucide-react'
import clsx from 'clsx'

interface SeatSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  error?: string;
  className?: string;
}

export default function SeatSelector({
  value,
  onChange,
  min = 1,
  max = 6,
  label = 'Number of Seats',
  error,
  className,
}: SeatSelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">{label}</label>
      )}
      
      <div className={clsx(
        'flex items-center justify-between p-4 bg-white border rounded-xl',
        error ? 'border-status-error' : 'border-neutral-300'
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-main" />
          </div>
          <div>
            <p className="font-medium text-neutral-900">{value} {value === 1 ? 'Seat' : 'Seats'}</p>
            <p className="text-sm text-neutral-500">Max {max} available</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            className={clsx(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              value <= min
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            )}
          >
            <Minus className="w-5 h-5" />
          </button>
          
          <span className="w-8 text-center text-xl font-semibold text-neutral-900">{value}</span>
          
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            className={clsx(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              value >= max
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-primary-main text-white hover:bg-primary-dark'
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {error && <p className="text-sm text-status-error mt-1">{error}</p>}
    </div>
  )
}
