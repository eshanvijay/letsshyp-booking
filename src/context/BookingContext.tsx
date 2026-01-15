import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { BookingState, BookingAction } from '../types';

const initialState: BookingState = {
  currentStep: 1,
  pickup: {
    address: '',
    lat: 0,
    lng: 0,
    isValid: false,
    isServiceable: true,
  },
  drop: {
    address: '',
    lat: 0,
    lng: 0,
    isValid: false,
    isServiceable: true,
  },
  deliveryNotes: '',
  packageDetails: {
    size: null,
    weight: 0,
    description: '',
    fragile: false,
  },
  deliveryType: {
    type: 'standard',
    estimatedTime: '2-4 hours',
    price: 0,
  },
  userDetails: {
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
  },
  pricing: {
    baseFare: 49,
    distanceCharge: 0,
    weightCharge: 0,
    expressCharge: 0,
    gst: 0,
    total: 0,
  },
  bookingId: null,
  isLoading: false,
  error: null,
};

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_PICKUP':
      return { ...state, pickup: action.payload };
    
    case 'SET_DROP':
      return { ...state, drop: action.payload };
    
    case 'SET_DELIVERY_NOTES':
      return { ...state, deliveryNotes: action.payload };
    
    case 'SET_PACKAGE_DETAILS':
      return { ...state, packageDetails: action.payload };
    
    case 'SET_DELIVERY_TYPE':
      return { ...state, deliveryType: action.payload };
    
    case 'SET_USER_DETAILS':
      return { ...state, userDetails: action.payload };
    
    case 'CALCULATE_PRICING': {
      const distance = calculateDistance(
        state.pickup.lat, state.pickup.lng,
        state.drop.lat, state.drop.lng
      );
      
      const baseFare = 49;
      const distanceCharge = Math.round(distance * 12); // ₹12 per km
      const weightCharge = state.packageDetails.weight > 5 
        ? Math.round((state.packageDetails.weight - 5) * 5) // ₹5 per kg above 5kg
        : 0;
      const expressCharge = state.deliveryType.type === 'express' ? 99 : 0;
      const subtotal = baseFare + distanceCharge + weightCharge + expressCharge;
      const gst = Math.round(subtotal * 0.18);
      const total = subtotal + gst;

      return {
        ...state,
        pricing: {
          baseFare,
          distanceCharge,
          weightCharge,
          expressCharge,
          gst,
          total,
        },
      };
    }
    
    case 'SET_BOOKING_ID':
      return { ...state, bookingId: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
