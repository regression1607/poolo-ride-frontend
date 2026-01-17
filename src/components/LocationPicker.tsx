import { useState, useEffect, useRef, useMemo } from 'react'
import { MapPin, X, Search, Crosshair, Loader2, Map, Check } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in Leaflet with webpack/vite
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = defaultIcon

interface LocationPickerProps {
  placeholder: string
  value: string
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void
  icon?: 'pickup' | 'drop'
  error?: string
}

// Default center (Delhi, India)
const DEFAULT_CENTER: [number, number] = [28.6139, 77.2090]

// Popular cities with coordinates
const POPULAR_CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
  { name: 'Noida', lat: 28.5355, lng: 77.3910 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
]

// Draggable marker component
function DraggableMarker({ 
  position, 
  onPositionChange 
}: { 
  position: [number, number]
  onPositionChange: (lat: number, lng: number) => void 
}) {
  const markerRef = useRef<L.Marker>(null)
  
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          const latlng = marker.getLatLng()
          onPositionChange(latlng.lat, latlng.lng)
        }
      },
    }),
    [onPositionChange]
  )

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  )
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// Component to recenter map
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

// Reverse geocode using Nominatim (free)
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    const data = await response.json()
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch (error) {
    console.error('Reverse geocode error:', error)
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

// Search locations using Nominatim (free)
async function searchLocations(query: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    )
    return await response.json()
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

export default function LocationPicker({
  placeholder,
  value,
  onChange,
  icon = 'pickup',
  error,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<[number, number]>(DEFAULT_CENTER)
  const [selectedAddress, setSelectedAddress] = useState('')
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle marker position change (drag or click)
  const handleMarkerPositionChange = async (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
    setIsReverseGeocoding(true)
    const address = await reverseGeocode(lat, lng)
    setSelectedAddress(address)
    setIsReverseGeocoding(false)
  }

  // Handle search input
  const handleSearchChange = (text: string) => {
    setSearchText(text)
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (text.length > 2) {
      setIsLoading(true)
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchLocations(text)
        setSuggestions(results)
        setIsLoading(false)
      }, 300)
    } else {
      setSuggestions([])
      setIsLoading(false)
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: any) => {
    const lat = parseFloat(suggestion.lat)
    const lng = parseFloat(suggestion.lon)
    setMarkerPosition([lat, lng])
    setSelectedAddress(suggestion.display_name)
    setSearchText('')
    setSuggestions([])
    setShowMap(true)
  }

  // Handle current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setMarkerPosition([latitude, longitude])
        setIsReverseGeocoding(true)
        const address = await reverseGeocode(latitude, longitude)
        setSelectedAddress(address)
        setIsReverseGeocoding(false)
        setIsGettingLocation(false)
        setShowMap(true)
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please enable location permissions.')
        setIsGettingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  // Handle city quick select
  const handleCitySelect = (city: typeof POPULAR_CITIES[0]) => {
    setMarkerPosition([city.lat, city.lng])
    setSelectedAddress(`${city.name}, India`)
    setShowMap(true)
  }

  // Confirm selection
  const handleConfirmLocation = () => {
    onChange(selectedAddress, { lat: markerPosition[0], lng: markerPosition[1] })
    setIsOpen(false)
    setShowMap(false)
    setSearchText('')
    setSuggestions([])
  }

  // Open modal
  const openModal = () => {
    setIsOpen(true)
    setShowMap(false)
    setSelectedAddress('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  // Close modal
  const closeModal = () => {
    setIsOpen(false)
    setShowMap(false)
    setSearchText('')
    setSuggestions([])
    setSelectedAddress('')
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={openModal}
        className={`w-full flex items-center gap-3 bg-white border rounded-xl px-4 py-3 text-left transition-colors hover:border-primary-main ${
          error ? 'border-red-500' : 'border-neutral-300'
        }`}
      >
        <MapPin className={`w-5 h-5 flex-shrink-0 ${
          icon === 'pickup' ? 'text-green-500' : 'text-red-500'
        }`} />
        <span className={`flex-1 truncate ${value ? 'text-neutral-900' : 'text-neutral-500'}`}>
          {value || placeholder}
        </span>
      </button>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          {/* Modal Content */}
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] h-[85vh] flex flex-col animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <button
                onClick={showMap ? () => setShowMap(false) : closeModal}
                className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
              <h2 className="font-semibold text-neutral-900">
                {showMap ? 'Drag pin to adjust' : 'Select Location'}
              </h2>
              {showMap ? (
                <button
                  onClick={handleConfirmLocation}
                  disabled={!selectedAddress || isReverseGeocoding}
                  className="p-2 -mr-2 hover:bg-neutral-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <Check className="w-5 h-5 text-green-600" />
                </button>
              ) : (
                <div className="w-9" />
              )}
            </div>

            {showMap ? (
              /* Map View */
              <div className="flex-1 flex flex-col">
                {/* Map */}
                <div className="flex-1 relative">
                  <MapContainer
                    center={markerPosition}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker
                      position={markerPosition}
                      onPositionChange={handleMarkerPositionChange}
                    />
                    <MapClickHandler onMapClick={handleMarkerPositionChange} />
                    <MapRecenter center={markerPosition} />
                  </MapContainer>
                  
                  {/* Recenter button */}
                  <button
                    onClick={handleCurrentLocation}
                    disabled={isGettingLocation}
                    className="absolute bottom-4 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-neutral-50"
                  >
                    {isGettingLocation ? (
                      <Loader2 className="w-5 h-5 text-primary-main animate-spin" />
                    ) : (
                      <Crosshair className="w-5 h-5 text-primary-main" />
                    )}
                  </button>
                </div>

                {/* Selected Address */}
                <div className="p-4 border-t border-neutral-200 bg-white">
                  <div className="flex items-start gap-3">
                    <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      icon === 'pickup' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      {isReverseGeocoding ? (
                        <div className="flex items-center gap-2 text-neutral-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Getting address...</span>
                        </div>
                      ) : (
                        <p className="text-neutral-900 text-sm">{selectedAddress || 'Drag the pin to select location'}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmLocation}
                    disabled={!selectedAddress || isReverseGeocoding}
                    className="w-full mt-3 bg-primary-main text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                  >
                    Confirm Location
                  </button>
                </div>
              </div>
            ) : (
              /* Search View */
              <>
                {/* Search Input */}
                <div className="p-4">
                  <div className="flex items-center gap-3 bg-neutral-100 rounded-xl px-4 py-3">
                    <Search className="w-5 h-5 text-neutral-500" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search for a location..."
                      value={searchText}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-neutral-900 placeholder:text-neutral-500"
                    />
                    {isLoading && <Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />}
                  </div>
                </div>

                {/* Current Location & Pick on Map */}
                <div className="px-4 pb-2 space-y-2">
                  <button
                    onClick={handleCurrentLocation}
                    disabled={isGettingLocation}
                    className="w-full flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {isGettingLocation ? (
                        <Loader2 className="w-5 h-5 text-primary-main animate-spin" />
                      ) : (
                        <Crosshair className="w-5 h-5 text-primary-main" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-neutral-900">Use current location</p>
                      <p className="text-sm text-neutral-500">Detect your location automatically</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowMap(true)}
                    className="w-full flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Map className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-neutral-900">Pick on map</p>
                      <p className="text-sm text-neutral-500">Drag pin to select location</p>
                    </div>
                  </button>
                </div>

                {/* Suggestions or Popular Cities */}
                <div className="flex-1 overflow-y-auto">
                  {suggestions.length > 0 ? (
                    <div className="px-4">
                      <p className="text-sm font-medium text-neutral-600 mb-2">Search Results</p>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full flex items-center gap-3 py-3 hover:bg-neutral-50 transition-colors rounded-lg"
                        >
                          <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-neutral-600" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <p className="font-medium text-neutral-900 truncate">
                              {suggestion.address?.city || suggestion.address?.town || suggestion.address?.village || suggestion.name}
                            </p>
                            <p className="text-sm text-neutral-500 truncate">{suggestion.display_name}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : searchText.length > 2 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🗺️</span>
                      </div>
                      <p className="font-medium text-neutral-800 mb-2">Can't find this place?</p>
                      <p className="text-sm text-neutral-500 mb-4">
                        We're a bootstrapped startup without fancy APIs 😅
                        <br />
                        But hey, our map works great!
                      </p>
                      <button
                        onClick={() => setShowMap(true)}
                        className="flex items-center gap-2 bg-primary-main text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors"
                      >
                        <Map className="w-4 h-4" />
                        Drop pin on map instead
                      </button>
                    </div>
                  ) : (
                    <div className="p-4">
                      <p className="text-sm font-medium text-neutral-600 mb-3">Popular Cities</p>
                      <div className="grid grid-cols-2 gap-2">
                        {POPULAR_CITIES.map((city) => (
                          <button
                            key={city.name}
                            onClick={() => handleCitySelect(city)}
                            className="flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
                          >
                            <MapPin className="w-4 h-4 text-neutral-500" />
                            <span className="text-neutral-700 font-medium">{city.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
