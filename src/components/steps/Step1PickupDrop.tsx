import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useBooking } from '../../context/BookingContext';
import { SERVICEABLE_AREAS } from '../../types';
import AddressInput from '../AddressInput';

// Fix for default marker icons in Leaflet with React
const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <path d="M20 0 C9 0 0 9 0 20 C0 35 20 50 20 50 C20 50 40 35 40 20 C40 9 31 0 20 0 Z" fill="#4CAF50"/>
      <circle cx="20" cy="18" r="10" fill="white"/>
      <text x="20" y="23" text-anchor="middle" fill="#4CAF50" font-size="14" font-weight="bold">P</text>
    </svg>
  `),
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50],
});

const dropIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
      <path d="M20 0 C9 0 0 9 0 20 C0 35 20 50 20 50 C20 50 40 35 40 20 C40 9 31 0 20 0 Z" fill="#E53935"/>
      <circle cx="20" cy="18" r="10" fill="white"/>
      <text x="20" y="23" text-anchor="middle" fill="#E53935" font-size="14" font-weight="bold">D</text>
    </svg>
  `),
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -50],
});

// Component to update map view
function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to fit bounds when both markers are present
function FitBounds({ pickup, drop }: { pickup: [number, number] | null; drop: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pickup && drop) {
      const bounds = L.latLngBounds([pickup, drop]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickup, drop, map]);
  return null;
}

export default function Step1PickupDrop() {
  const { state, dispatch } = useBooking();
  const [mapCenter, setMapCenter] = useState<[number, number]>([19.0330, 73.0297]);
  const [mapZoom, setMapZoom] = useState(13);
  const [deliveryNotes, setDeliveryNotes] = useState(state.deliveryNotes);
  const [errors, setErrors] = useState({
    pickup: '',
    drop: '',
  });

  const checkServiceability = (address: string): boolean => {
    const lowerAddress = address.toLowerCase();
    return SERVICEABLE_AREAS.some(area => 
      lowerAddress.includes(area.toLowerCase())
    );
  };

  const handlePickupSelect = useCallback((address: string, lat: number, lng: number) => {
    const isServiceable = checkServiceability(address);
    dispatch({
      type: 'SET_PICKUP',
      payload: {
        address,
        lat,
        lng,
        isValid: true,
        isServiceable,
      },
    });
    setMapCenter([lat, lng]);
    setMapZoom(14);
    setErrors(prev => ({ ...prev, pickup: '' }));
  }, [dispatch]);

  const handleDropSelect = useCallback((address: string, lat: number, lng: number) => {
    const isServiceable = checkServiceability(address);
    dispatch({
      type: 'SET_DROP',
      payload: {
        address,
        lat,
        lng,
        isValid: true,
        isServiceable,
      },
    });
    if (!state.pickup.isValid) {
      setMapCenter([lat, lng]);
      setMapZoom(14);
    }
    setErrors(prev => ({ ...prev, drop: '' }));
  }, [dispatch, state.pickup.isValid]);

  const handleNext = () => {
    const newErrors = {
      pickup: '',
      drop: '',
    };

    if (!state.pickup.address) {
      newErrors.pickup = 'Please enter pickup address';
    } else if (!state.pickup.isServiceable) {
      newErrors.pickup = 'Sorry, this area is not serviceable yet';
    }

    if (!state.drop.address) {
      newErrors.drop = 'Please enter drop address';
    } else if (!state.drop.isServiceable) {
      newErrors.drop = 'Sorry, this area is not serviceable yet';
    }

    setErrors(newErrors);

    if (!newErrors.pickup && !newErrors.drop && state.pickup.isValid && state.drop.isValid) {
      dispatch({ type: 'SET_DELIVERY_NOTES', payload: deliveryNotes });
      dispatch({ type: 'SET_STEP', payload: 2 });
    }
  };

  const isNextDisabled = !state.pickup.address || !state.drop.address || 
    !state.pickup.isServiceable || !state.drop.isServiceable;

  // Calculate distance
  const distance = state.pickup.isValid && state.drop.isValid
    ? Math.round(
        Math.sqrt(
          Math.pow(state.pickup.lat - state.drop.lat, 2) +
          Math.pow(state.pickup.lng - state.drop.lng, 2)
        ) * 111
      )
    : 0;

  // Route line coordinates
  const routePositions: [number, number][] = state.pickup.isValid && state.drop.isValid
    ? [[state.pickup.lat, state.pickup.lng], [state.drop.lat, state.drop.lng]]
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-shyp-lightRed rounded-xl flex items-center justify-center">
            <span className="text-2xl">📍</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-shyp-dark">Pickup & Drop Details</h2>
            <p className="text-shyp-gray text-sm">Enter your delivery addresses</p>
          </div>
        </div>

        {/* Pickup Address */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-shyp-dark mb-2">
            <span className="w-3 h-3 bg-shyp-green rounded-full"></span>
            Pickup Location (FROM)
          </label>
          <AddressInput
            placeholder="Enter pickup address"
            value={state.pickup.address}
            onSelect={handlePickupSelect}
            error={errors.pickup}
          />
          {!state.pickup.isServiceable && state.pickup.address && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm text-red-700">
                This area is currently not serviceable. We're expanding soon!
              </span>
            </div>
          )}
        </div>

        {/* Drop Address */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-shyp-dark mb-2">
            <span className="w-3 h-3 bg-shyp-red rounded-full"></span>
            Drop Location (TO)
          </label>
          <AddressInput
            placeholder="Enter drop address"
            value={state.drop.address}
            onSelect={handleDropSelect}
            error={errors.drop}
          />
          {!state.drop.isServiceable && state.drop.address && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm text-red-700">
                This area is currently not serviceable. We're expanding soon!
              </span>
            </div>
          )}
        </div>

        {/* Delivery Notes */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-shyp-dark mb-2">
            <svg className="w-4 h-4 text-shyp-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Delivery Instructions (Optional)
          </label>
          <textarea
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            placeholder="Any special instructions for pickup or delivery? (e.g., Ring the doorbell, Leave at reception)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-shyp-red transition-colors resize-none"
            rows={3}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            isNextDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-shyp-red text-white hover:bg-shyp-darkRed hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          Continue to Package Details
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Right Column - Map */}
      <div className="bg-white rounded-2xl shadow-xl p-6 animate-slide-in-right">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-shyp-dark">Route Preview</h3>
          {state.pickup.isValid && state.drop.isValid && (
            <span className="text-sm text-shyp-red font-medium bg-shyp-lightRed px-3 py-1 rounded-full">
              ~{distance} km
            </span>
          )}
        </div>
        
        <div className="rounded-xl overflow-hidden shadow-lg" style={{ height: '300px' }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            
            {state.pickup.isValid && state.drop.isValid && (
              <FitBounds 
                pickup={[state.pickup.lat, state.pickup.lng]} 
                drop={[state.drop.lat, state.drop.lng]} 
              />
            )}
            
            {state.pickup.isValid && (
              <Marker position={[state.pickup.lat, state.pickup.lng]} icon={pickupIcon}>
                <Popup>
                  <div className="font-medium">📍 Pickup Location</div>
                  <div className="text-sm text-gray-600">{state.pickup.address}</div>
                </Popup>
              </Marker>
            )}
            
            {state.drop.isValid && (
              <Marker position={[state.drop.lat, state.drop.lng]} icon={dropIcon}>
                <Popup>
                  <div className="font-medium">🎯 Drop Location</div>
                  <div className="text-sm text-gray-600">{state.drop.address}</div>
                </Popup>
              </Marker>
            )}
            
            {routePositions.length === 2 && (
              <Polyline
                positions={routePositions}
                color="#E53935"
                weight={4}
                opacity={0.8}
                dashArray="10, 10"
              />
            )}
          </MapContainer>
        </div>

        {/* Location Summary */}
        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
            <span className="w-3 h-3 bg-shyp-green rounded-full mt-1.5 flex-shrink-0"></span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-shyp-gray font-medium">FROM</p>
              <p className="text-sm text-shyp-dark truncate">
                {state.pickup.address || 'Select pickup location'}
              </p>
              {state.pickup.isValid && (
                <p className="text-xs text-shyp-gray mt-1">
                  📍 {state.pickup.lat.toFixed(4)}, {state.pickup.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-0.5 h-4 bg-gray-300"></div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
            <span className="w-3 h-3 bg-shyp-red rounded-full mt-1.5 flex-shrink-0"></span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-shyp-gray font-medium">TO</p>
              <p className="text-sm text-shyp-dark truncate">
                {state.drop.address || 'Select drop location'}
              </p>
              {state.drop.isValid && (
                <p className="text-xs text-shyp-gray mt-1">
                  📍 {state.drop.lat.toFixed(4)}, {state.drop.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <span className="text-lg">✓</span>
            <p className="text-xs text-shyp-gray">Verified Drivers</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <span className="text-lg">📍</span>
            <p className="text-xs text-shyp-gray">Live Tracking</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <span className="text-lg">🛡️</span>
            <p className="text-xs text-shyp-gray">Insurance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
