export interface Location {
  address: string;
  lat: number;
  lng: number;
  isValid: boolean;
  isServiceable: boolean;
}

export interface PackageDetails {
  size: 'small' | 'medium' | 'large' | 'extra-large' | null;
  weight: number;
  description: string;
  fragile: boolean;
}

export interface DeliveryType {
  type: 'express' | 'standard';
  estimatedTime: string;
  price: number;
}

export interface UserDetails {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
}

export interface PricingBreakdown {
  baseFare: number;
  distanceCharge: number;
  weightCharge: number;
  expressCharge: number;
  gst: number;
  total: number;
}

export interface BookingState {
  currentStep: number;
  pickup: Location;
  drop: Location;
  deliveryNotes: string;
  packageDetails: PackageDetails;
  deliveryType: DeliveryType;
  userDetails: UserDetails;
  pricing: PricingBreakdown;
  bookingId: string | null;
  isLoading: boolean;
  error: string | null;
}

export type BookingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_PICKUP'; payload: Location }
  | { type: 'SET_DROP'; payload: Location }
  | { type: 'SET_DELIVERY_NOTES'; payload: string }
  | { type: 'SET_PACKAGE_DETAILS'; payload: PackageDetails }
  | { type: 'SET_DELIVERY_TYPE'; payload: DeliveryType }
  | { type: 'SET_USER_DETAILS'; payload: UserDetails }
  | { type: 'CALCULATE_PRICING'; payload?: undefined }
  | { type: 'SET_BOOKING_ID'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET'; payload?: undefined };

export const PACKAGE_SIZES = {
  small: {
    label: 'Small',
    description: 'Documents, small items',
    maxWeight: 2,
    icon: '📄',
    dimensions: 'Up to 30×20×10 cm',
  },
  medium: {
    label: 'Medium',
    description: 'Parcels, electronics',
    maxWeight: 10,
    icon: '📦',
    dimensions: 'Up to 50×40×30 cm',
  },
  large: {
    label: 'Large',
    description: 'Large boxes, appliances',
    maxWeight: 25,
    icon: '📫',
    dimensions: 'Up to 80×60×50 cm',
  },
  'extra-large': {
    label: 'Extra Large',
    description: 'Furniture, heavy items',
    maxWeight: 50,
    icon: '🚚',
    dimensions: 'Up to 120×80×80 cm',
  },
};

export const SERVICEABLE_AREAS = [
  'Mumbai', 'Navi Mumbai', 'Thane', 'Kharghar', 'Panvel', 'Vashi', 'Nerul',
  'Belapur', 'Airoli', 'Ghansoli', 'Kopar Khairane', 'Turbhe', 'Sanpada',
  'Juinagar', 'Seawoods', 'Ulwe', 'Dronagiri', 'Kamothe', 'Kalamboli',
  'Delhi', 'Noida', 'Gurgaon', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune'
];
