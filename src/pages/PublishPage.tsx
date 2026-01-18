import { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Car, Bike, Truck, IndianRupee, FileText, ChevronLeft, ChevronRight, Check, Clock, AlertCircle, ChevronDown } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LocationPicker from '../components/LocationPicker'
import { VehicleType } from '../types'
import { ridesApi } from '../services/api'

const vehicleTypes: { type: VehicleType; label: string; icon: any }[] = [
  { type: 'bike', label: 'Bike', icon: Bike },
  { type: 'car', label: 'Car', icon: Car },
  { type: 'cab', label: 'Cab', icon: Truck },
]

const ALL_HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
const ALL_MINUTES = ['00', '15', '30', '45']

export default function PublishPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isPublishing, setIsPublishing] = useState(false)

  // Initialize with a time that's at least 30 mins from now
  const getInitialTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)
    let hour = now.getHours()
    const minute = Math.ceil(now.getMinutes() / 15) * 15
    const period = hour >= 12 ? 'PM' : 'AM'
    if (hour > 12) hour -= 12
    if (hour === 0) hour = 12
    return {
      hour: hour.toString().padStart(2, '0'),
      minute: (minute === 60 ? 0 : minute).toString().padStart(2, '0'),
      period: period as 'AM' | 'PM'
    }
  }

  const initialTime = getInitialTime()

  const [formData, setFormData] = useState({
    fromLocation: '',
    fromCoords: null as { lat: number; lng: number } | null,
    toLocation: '',
    toCoords: null as { lat: number; lng: number } | null,
    selectedDate: 'today' as 'today' | 'tomorrow',
    hour: initialTime.hour,
    minute: initialTime.minute,
    period: initialTime.period,
    availableSeats: 2,
    vehicleType: 'car' as VehicleType,
    pricePerSeat: '',
    description: '',
  })

  const [timeError, setTimeError] = useState('')

  const totalSteps = 4

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    if (['hour', 'minute', 'period', 'selectedDate'].includes(key)) {
      setTimeError('')
    }
  }

  // Check if selected time is valid (at least 30 mins in future)
  const isTimeValid = useMemo(() => {
    const now = new Date()
    const selectedDate = new Date()
    
    if (formData.selectedDate === 'tomorrow') {
      selectedDate.setDate(selectedDate.getDate() + 1)
      return true // Tomorrow is always valid
    }

    let hour = parseInt(formData.hour)
    if (formData.period === 'PM' && hour !== 12) hour += 12
    if (formData.period === 'AM' && hour === 12) hour = 0
    
    selectedDate.setHours(hour, parseInt(formData.minute), 0, 0)
    
    const minTime = new Date(now.getTime() + 30 * 60 * 1000) // 30 mins from now
    return selectedDate >= minTime
  }, [formData.hour, formData.minute, formData.period, formData.selectedDate])

  // Get minimum allowed time for today
  const getMinTimeForToday = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)
    return now
  }

  const getPickupTime = () => {
    const date = new Date()
    if (formData.selectedDate === 'tomorrow') {
      date.setDate(date.getDate() + 1)
    }
    let hour = parseInt(formData.hour)
    if (formData.period === 'PM' && hour !== 12) hour += 12
    if (formData.period === 'AM' && hour === 12) hour = 0
    date.setHours(hour, parseInt(formData.minute), 0, 0)
    return date.toISOString()
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (validateStep()) {
        setCurrentStep((prev) => prev + 1)
      }
    } else {
      handlePublish()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fromLocation || !formData.toLocation) {
          alert('Please enter both pickup and drop locations')
          return false
        }
        return true
      case 2:
        if (!isTimeValid) {
          setTimeError('Please select a time at least 30 minutes from now')
          return false
        }
        return true
      case 3:
        if (!formData.pricePerSeat || isNaN(Number(formData.pricePerSeat))) {
          alert('Please enter a valid price per seat')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      await ridesApi.create({
        pickup_address: formData.fromLocation,
        drop_address: formData.toLocation,
        pickup_time: getPickupTime(),
        total_seats: formData.availableSeats,
        available_seats: formData.availableSeats,
        vehicle_type: formData.vehicleType,
        price_per_seat: Number(formData.pricePerSeat),
        description: formData.description,
        pickup_latitude: formData.fromCoords?.lat,
        pickup_longitude: formData.fromCoords?.lng,
        drop_latitude: formData.toCoords?.lat,
        drop_longitude: formData.toCoords?.lng,
      })
      alert('Ride published successfully!')
      navigate('/rides')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to publish ride')
    } finally {
      setIsPublishing(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Where are you going? 🗺️</h2>
              <p className="text-neutral-600">Select your pickup and drop-off locations</p>
            </div>

            <LocationPicker
              placeholder="From: Your starting point"
              value={formData.fromLocation}
              onChange={(location, coords) => {
                updateFormData('fromLocation', location)
                updateFormData('fromCoords', coords || null)
              }}
              icon="pickup"
            />

            <LocationPicker
              placeholder="To: Your destination"
              value={formData.toLocation}
              onChange={(location, coords) => {
                updateFormData('toLocation', location)
                updateFormData('toCoords', coords || null)
              }}
              icon="drop"
            />

            {formData.fromLocation && formData.toLocation && (
              <div className="bg-primary-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-primary-main">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">
                    {formData.fromLocation} → {formData.toLocation}
                  </span>
                </div>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">When are you leaving? ⏰</h2>
              <p className="text-neutral-600">Choose your departure date and time</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Select Date</label>
              <div className="grid grid-cols-2 gap-3">
                {(['today', 'tomorrow'] as const).map((date) => {
                  const isToday = date === 'today'
                  const dateObj = new Date()
                  if (!isToday) dateObj.setDate(dateObj.getDate() + 1)
                  const dayName = isToday ? 'Today' : 'Tomorrow'
                  const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                  
                  return (
                    <button
                      key={date}
                      onClick={() => updateFormData('selectedDate', date)}
                      className={`py-4 px-4 rounded-xl border text-center transition-all ${
                        formData.selectedDate === date
                          ? 'border-primary-main bg-primary-50 ring-2 ring-primary-main/20'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <p className={`font-semibold ${
                        formData.selectedDate === date ? 'text-primary-main' : 'text-neutral-900'
                      }`}>{dayName}</p>
                      <p className="text-sm text-neutral-500 mt-0.5">{dateStr}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">Select Time</label>
              <div className="flex items-center justify-center gap-2">
                {/* Hour */}
                <TimeDropdown
                  value={formData.hour}
                  options={ALL_HOURS}
                  onChange={(val) => updateFormData('hour', val)}
                />

                <span className="text-2xl font-bold text-neutral-400">:</span>

                {/* Minute */}
                <TimeDropdown
                  value={formData.minute}
                  options={ALL_MINUTES}
                  onChange={(val) => updateFormData('minute', val)}
                />

                {/* AM/PM Toggle */}
                <div className="flex rounded-xl border border-neutral-200 overflow-hidden ml-2">
                  {(['AM', 'PM'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFormData('period', p)}
                      className={`px-4 py-3 font-semibold text-sm transition-colors ${
                        formData.period === p
                          ? 'bg-primary-main text-white'
                          : 'bg-white text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Display */}
              <div className={`mt-4 p-4 rounded-xl flex items-center justify-center gap-3 ${
                isTimeValid ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <Clock className={`w-5 h-5 ${isTimeValid ? 'text-green-600' : 'text-red-500'}`} />
                <span className={`text-lg font-semibold ${
                  isTimeValid ? 'text-green-700' : 'text-red-600'
                }`}>
                  {formData.hour}:{formData.minute} {formData.period}
                </span>
                {!isTimeValid && formData.selectedDate === 'today' && (
                  <span className="text-sm text-red-500">(too soon)</span>
                )}
              </div>

              {/* Error/Info Message */}
              {timeError && (
                <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{timeError}</span>
                </div>
              )}
              {formData.selectedDate === 'today' && !timeError && (
                <p className="mt-3 text-center text-sm text-neutral-500">
                  Minimum departure: {getMinTimeForToday().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </p>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Ride Details 🚗</h2>
              <p className="text-neutral-600">Set your vehicle type, seats, and pricing</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Your vehicle type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {vehicleTypes.map((vt) => (
                  <button
                    key={vt.type}
                    onClick={() => updateFormData('vehicleType', vt.type)}
                    className={`py-4 px-3 rounded-xl border text-center font-medium transition-colors flex flex-col items-center gap-2 ${
                      formData.vehicleType === vt.type
                        ? 'border-primary-main bg-primary-100 text-primary-main'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <vt.icon className="w-6 h-6" />
                    {vt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Available seats
              </label>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => updateFormData('availableSeats', Math.max(1, formData.availableSeats - 1))}
                  className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center text-xl font-semibold hover:bg-neutral-50"
                >
                  -
                </button>
                <span className="text-3xl font-bold text-neutral-900">{formData.availableSeats}</span>
                <button
                  onClick={() => updateFormData('availableSeats', Math.min(5, formData.availableSeats + 1))}
                  className="w-12 h-12 rounded-full border border-neutral-300 flex items-center justify-center text-xl font-semibold hover:bg-neutral-50"
                >
                  +
                </button>
              </div>
            </div>

            <Input
              label="Price per seat (₹)"
              type="number"
              placeholder="e.g., 150"
              value={formData.pricePerSeat}
              onChange={(e) => updateFormData('pricePerSeat', e.target.value)}
              leftIcon={IndianRupee}
            />

            <Input
              label="Ride description (optional)"
              placeholder="Any additional details about the ride..."
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              leftIcon={FileText}
              helperText="E.g., AC car, music allowed, no smoking"
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Review & Publish 📝</h2>
              <p className="text-neutral-600">Review your ride details before publishing</p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 space-y-4">
              <ReviewItem label="Route" value={`${formData.fromLocation} → ${formData.toLocation}`} />
              <ReviewItem
                label="Departure"
                value={`${formData.selectedDate === 'today' ? 'Today' : 'Tomorrow'} at ${formData.hour}:${formData.minute} ${formData.period}`}
              />
              <ReviewItem
                label="Vehicle & Seats"
                value={`${formData.vehicleType.toUpperCase()} • ${formData.availableSeats} seats available`}
              />
              <ReviewItem label="Price" value={`₹${formData.pricePerSeat} per seat`} highlight />
              {formData.description && <ReviewItem label="Description" value={formData.description} />}
            </div>

            <div className="bg-secondary-50 rounded-xl p-4 text-center">
              <p className="text-neutral-600 text-sm mb-1">Estimated Earnings</p>
              <p className="text-2xl font-bold text-secondary-main">
                ₹{(Number(formData.pricePerSeat) || 0) * formData.availableSeats}
              </p>
              <p className="text-xs text-neutral-500">if all {formData.availableSeats} seats are booked</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={`p-2 rounded-lg ${
            currentStep === 1 ? 'text-neutral-300' : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-neutral-900">Publish Ride</h1>
          <p className="text-sm text-neutral-500">Step {currentStep} of {totalSteps}</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-neutral-200 rounded-full mb-6">
        <div
          className="h-full bg-primary-main rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <Button onClick={handleNext} className="w-full" size="large" loading={isPublishing}>
        {currentStep === totalSteps ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Publish Ride
          </>
        ) : (
          <>
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}

function TimeDropdown({ 
  value, 
  options, 
  onChange 
}: { 
  value: string
  options: string[]
  onChange: (val: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 py-3 px-4 rounded-xl border border-neutral-200 bg-white text-center font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-primary-main/20 focus:border-primary-main cursor-pointer flex items-center justify-center gap-1"
      >
        {value}
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-20 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 py-1 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={`w-full py-2 px-3 text-center font-medium transition-colors ${
                value === option
                  ? 'bg-primary-100 text-primary-main'
                  : 'text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-sm text-neutral-500 mb-1">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-primary-main text-lg' : 'text-neutral-900'}`}>
        {value}
      </p>
    </div>
  )
}
