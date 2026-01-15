import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveTrackingProps {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  pickupAddress: string;
  dropAddress: string;
  driverName?: string;
  vehicleNumber?: string;
}

// Custom icons
const pickupIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0 C7 0 0 7 0 16 C0 28 16 40 16 40 C16 40 32 28 32 16 C32 7 25 0 16 0 Z" fill="#4CAF50"/>
      <circle cx="16" cy="14" r="8" fill="white"/>
      <text x="16" y="18" text-anchor="middle" fill="#4CAF50" font-size="12" font-weight="bold">P</text>
    </svg>
  `),
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const dropIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0 C7 0 0 7 0 16 C0 28 16 40 16 40 C16 40 32 28 32 16 C32 7 25 0 16 0 Z" fill="#E53935"/>
      <circle cx="16" cy="14" r="8" fill="white"/>
      <text x="16" y="18" text-anchor="middle" fill="#E53935" font-size="12" font-weight="bold">D</text>
    </svg>
  `),
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

const deliveryIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="23" fill="#FF5722" stroke="white" stroke-width="3"/>
      <text x="25" y="32" text-anchor="middle" fill="white" font-size="24">🚚</text>
    </svg>
  `),
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

// Component to fit bounds
function FitBounds({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [bounds, map]);
  return null;
}

// Component to follow delivery vehicle
function FollowVehicle({ position, shouldFollow }: { position: [number, number]; shouldFollow: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (shouldFollow) {
      map.setView(position, 15, { animate: true });
    }
  }, [position, shouldFollow, map]);
  return null;
}

export default function LiveTracking({
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
  pickupAddress,
  dropAddress,
  driverName = 'Rajesh Kumar',
  vehicleNumber = 'MH 04 AB 1234',
}: LiveTrackingProps) {
  const [deliveryPosition, setDeliveryPosition] = useState<[number, number]>([pickupLat, pickupLng]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'pickup' | 'transit' | 'arriving' | 'delivered'>('pickup');
  const [eta, setEta] = useState(25);
  const [followVehicle, setFollowVehicle] = useState(true);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate delivery movement
  useEffect(() => {
    const startDelivery = () => {
      let currentProgress = 0;
      
      animationRef.current = setInterval(() => {
        currentProgress += 0.5;
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          setStatus('delivered');
          if (animationRef.current) {
            clearInterval(animationRef.current);
          }
        } else if (currentProgress >= 85) {
          setStatus('arriving');
        } else if (currentProgress >= 15) {
          setStatus('transit');
        }

        setProgress(currentProgress);
        setEta(Math.max(0, Math.round(25 * (1 - currentProgress / 100))));

        // Calculate new position along the route
        const lat = pickupLat + (dropLat - pickupLat) * (currentProgress / 100);
        const lng = pickupLng + (dropLng - pickupLng) * (currentProgress / 100);
        
        // Add some randomness to simulate real movement
        const jitterLat = (Math.random() - 0.5) * 0.001;
        const jitterLng = (Math.random() - 0.5) * 0.001;
        
        setDeliveryPosition([lat + jitterLat, lng + jitterLng]);
      }, 500);
    };

    // Start delivery after 2 seconds (simulating driver assignment)
    const startTimer = setTimeout(startDelivery, 2000);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      clearTimeout(startTimer);
    };
  }, [pickupLat, pickupLng, dropLat, dropLng]);

  const bounds = L.latLngBounds(
    [pickupLat, pickupLng],
    [dropLat, dropLng]
  );

  // Completed route (from pickup to current position)
  const completedRoute: [number, number][] = [
    [pickupLat, pickupLng],
    deliveryPosition
  ];

  // Remaining route (from current position to drop)
  const remainingRoute: [number, number][] = [
    deliveryPosition,
    [dropLat, dropLng]
  ];

  const getStatusText = () => {
    switch (status) {
      case 'pickup':
        return 'Driver is heading to pickup location';
      case 'transit':
        return 'Package picked up, on the way';
      case 'arriving':
        return 'Almost there! Arriving soon';
      case 'delivered':
        return 'Package delivered successfully! 🎉';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pickup':
        return 'bg-yellow-500';
      case 'transit':
        return 'bg-blue-500';
      case 'arriving':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Map */}
      <div className="relative" style={{ height: '350px' }}>
        <MapContainer
          center={[pickupLat, pickupLng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <FitBounds bounds={bounds} />
          <FollowVehicle position={deliveryPosition} shouldFollow={followVehicle} />

          {/* Completed route (green) */}
          <Polyline
            positions={completedRoute}
            color="#4CAF50"
            weight={5}
            opacity={1}
          />

          {/* Remaining route (dashed gray) */}
          <Polyline
            positions={remainingRoute}
            color="#9E9E9E"
            weight={4}
            opacity={0.6}
            dashArray="10, 10"
          />

          {/* Pickup Marker */}
          <Marker position={[pickupLat, pickupLng]} icon={pickupIcon}>
            <Popup>
              <div className="font-medium text-green-600">📍 Pickup</div>
              <div className="text-sm">{pickupAddress}</div>
            </Popup>
          </Marker>

          {/* Drop Marker */}
          <Marker position={[dropLat, dropLng]} icon={dropIcon}>
            <Popup>
              <div className="font-medium text-red-600">🎯 Drop</div>
              <div className="text-sm">{dropAddress}</div>
            </Popup>
          </Marker>

          {/* Delivery Vehicle Marker */}
          {status !== 'delivered' && (
            <Marker position={deliveryPosition} icon={deliveryIcon}>
              <Popup>
                <div className="font-medium">🚚 Your Delivery</div>
                <div className="text-sm text-gray-600">{driverName}</div>
                <div className="text-xs text-gray-500">{vehicleNumber}</div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={() => setFollowVehicle(!followVehicle)}
            className={`p-2 rounded-lg shadow-lg transition-all ${
              followVehicle ? 'bg-shyp-red text-white' : 'bg-white text-shyp-gray'
            }`}
            title={followVehicle ? 'Stop following' : 'Follow vehicle'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* ETA Badge */}
        {status !== 'delivered' && (
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-xl shadow-lg px-4 py-2">
            <div className="text-xs text-shyp-gray">Estimated arrival</div>
            <div className="text-2xl font-bold text-shyp-red">{eta} min</div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="p-4 border-t">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-shyp-gray mb-1">
            <span>Pickup</span>
            <span>Drop</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getStatusColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
          <span className="font-medium text-shyp-dark">{getStatusText()}</span>
        </div>

        {/* Driver Info */}
        {status !== 'delivered' && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-shyp-red rounded-full flex items-center justify-center text-white text-xl">
                👤
              </div>
              <div>
                <p className="font-semibold text-shyp-dark">{driverName}</p>
                <p className="text-sm text-shyp-gray">{vehicleNumber}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-shyp-green text-white rounded-full hover:bg-green-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="p-3 bg-shyp-red text-white rounded-full hover:bg-red-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Delivered Success */}
        {status === 'delivered' && (
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-lg font-semibold text-green-700">Delivery Completed!</p>
            <p className="text-sm text-green-600">Thank you for using Let's Shyp</p>
          </div>
        )}
      </div>
    </div>
  );
}
