import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Car, Bike, Truck, DollarSign, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { VehicleType } from '../types'
import { ridesApi } from '../services/api'

const vehicleTypes: { type: VehicleType; label: string; icon: any }[] = [
  { type: 'bike', label: 'Bike', icon: Bike },
  { type: 'car', label: 'Car', icon: Car },
  { type: 'cab', label: 'Cab', icon: Truck },
]

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

export default function PublishPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isPublishing, setIsPublishing] = useState(false)

  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    selectedDate: 'today' as 'today' | 'tomorrow',
    hour: '12',
    minute: '00',
    period: 'PM' as 'AM' | 'PM',
    availableSeats: 2,
    vehicleType: 'car' as VehicleType,
    pricePerSeat: '',
    description: '',
  })

  const totalSteps = 4

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
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

            <Input
              placeholder="From: Your starting point"
              value={formData.fromLocation}
              onChange={(e) => updateFormData('fromLocation', e.target.value)}
              leftIcon={MapPin}
            />

            <Input
              placeholder="To: Your destination"
              value={formData.toLocation}
              onChange={(e) => updateFormData('toLocation', e.target.value)}
              leftIcon={MapPin}
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
              <label className="block text-sm font-medium text-neutral-700 mb-2">Select Date</label>
              <div className="grid grid-cols-2 gap-3">
                {(['today', 'tomorrow'] as const).map((date) => (
                  <button
                    key={date}
                    onClick={() => updateFormData('selectedDate', date)}
                    className={`py-3 px-4 rounded-xl border text-center font-medium transition-colors ${
                      formData.selectedDate === date
                        ? 'border-primary-main bg-primary-100 text-primary-main'
                        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {date === 'today' ? 'Today' : 'Tomorrow'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Select Time</label>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={formData.hour}
                  onChange={(e) => updateFormData('hour', e.target.value)}
                  className="py-3 px-4 rounded-xl border border-neutral-300 text-center font-medium"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <select
                  value={formData.minute}
                  onChange={(e) => updateFormData('minute', e.target.value)}
                  className="py-3 px-4 rounded-xl border border-neutral-300 text-center font-medium"
                >
                  {minutes.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={formData.period}
                  onChange={(e) => updateFormData('period', e.target.value)}
                  className="py-3 px-4 rounded-xl border border-neutral-300 text-center font-medium"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <p className="mt-2 text-center text-lg font-semibold text-neutral-900">
                {formData.hour}:{formData.minute} {formData.period}
              </p>
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
              leftIcon={DollarSign}
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
