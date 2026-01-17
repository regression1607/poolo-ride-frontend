import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, X, Loader2, Navigation } from 'lucide-react'
import clsx from 'clsx'

interface LocationSuggestion {
  id: string;
  description: string;
  main_text: string;
  secondary_text: string;
  place_id?: string;
}

interface LocationPickerProps {
  placeholder: string;
  value?: string;
  onLocationSelect: (location: string, coordinates?: { lat: number; lng: number }) => void;
  error?: string;
  className?: string;
}

export default function LocationPicker({
  placeholder,
  value,
  onLocationSelect,
  error,
  className,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const fetchGooglePlaces = async (input: string) => {
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_google_maps_api_key_here') {
      // Use mock data if no API key
      setSuggestions([
        { id: '1', description: `${input}, New Delhi, India`, main_text: input, secondary_text: 'New Delhi, India' },
        { id: '2', description: `${input} Station, Delhi`, main_text: `${input} Station`, secondary_text: 'Delhi, India' },
      ])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}&components=country:in&language=en`
      )
      const data = await response.json()

      if (data.status === 'OK' && data.predictions) {
        const formatted: LocationSuggestion[] = data.predictions.map((p: any) => ({
          id: p.place_id,
          description: p.description,
          main_text: p.structured_formatting.main_text,
          secondary_text: p.structured_formatting.secondary_text || '',
          place_id: p.place_id,
        }))
        setSuggestions(formatted)
      } else {
        setSuggestions([])
      }
    } catch (err) {
      console.error('Error fetching places:', err)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (text: string) => {
    setSearchText(text)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (text.length > 2) {
      timeoutRef.current = setTimeout(() => {
        fetchGooglePlaces(text)
      }, 400)
    } else {
      setSuggestions([])
    }
  }

  const handleLocationSelect = (location: LocationSuggestion) => {
    onLocationSelect(location.description, undefined)
    setIsOpen(false)
    setSearchText('')
    setSuggestions([])
  }

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        // For now, just use coordinates as location
        const locationStr = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
        onLocationSelect(locationStr, { lat: latitude, lng: longitude })
        setIsOpen(false)
        setIsGettingLocation(false)
      },
      (err) => {
        console.error('Error getting location:', err)
        alert('Failed to get your location. Please search manually.')
        setIsGettingLocation(false)
      }
    )
  }

  return (
    <div className={clsx('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={clsx(
          'w-full flex items-center gap-3 px-4 py-3 bg-white border rounded-xl text-left transition-colors',
          error ? 'border-status-error' : 'border-neutral-300 hover:border-primary-main'
        )}
      >
        <MapPin className={clsx('w-5 h-5', error ? 'text-status-error' : 'text-neutral-500')} />
        <span className={clsx('flex-1 truncate', value ? 'text-neutral-900' : 'text-neutral-500')}>
          {value || placeholder}
        </span>
      </button>
      
      {error && <p className="text-sm text-status-error mt-1 ml-1">{error}</p>}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-10 sm:pt-20">
          <div className="bg-white w-full max-w-lg mx-4 rounded-2xl shadow-xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900">Select Location</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <div className="flex items-center gap-3 bg-neutral-100 rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-neutral-500" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a location..."
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-neutral-900 placeholder-neutral-500"
                />
                {isLoading && <Loader2 className="w-5 h-5 text-primary-main animate-spin" />}
              </div>
            </div>

            {/* Current Location */}
            <button
              onClick={handleCurrentLocation}
              disabled={isGettingLocation}
              className="flex items-center gap-3 px-4 py-3 mx-4 mb-2 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                {isGettingLocation ? (
                  <Loader2 className="w-5 h-5 text-primary-main animate-spin" />
                ) : (
                  <Navigation className="w-5 h-5 text-primary-main" />
                )}
              </div>
              <div className="text-left">
                <p className="font-medium text-neutral-900">
                  {isGettingLocation ? 'Getting location...' : 'Use current location'}
                </p>
                <p className="text-sm text-neutral-600">We'll detect your location automatically</p>
              </div>
            </button>

            {/* Suggestions */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {suggestions.length > 0 ? (
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-neutral-50 rounded-xl text-left transition-colors"
                    >
                      <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-neutral-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 truncate">{suggestion.main_text}</p>
                        <p className="text-sm text-neutral-500 truncate">{suggestion.secondary_text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchText.length > 2 && !isLoading ? (
                <div className="text-center py-8 text-neutral-500">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No locations found</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
