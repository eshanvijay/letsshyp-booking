import { useEffect, useState } from 'react';
import { useBooking } from '../../context/BookingContext';
import { PACKAGE_SIZES } from '../../types';

export default function Step3PricingSummary() {
  const { state, dispatch } = useBooking();
  const [priceChanged, setPriceChanged] = useState(false);
  const [previousTotal, setPreviousTotal] = useState(state.pricing.total);

  useEffect(() => {
    dispatch({ type: 'CALCULATE_PRICING' });
  }, [dispatch]);

  useEffect(() => {
    if (previousTotal !== 0 && previousTotal !== state.pricing.total) {
      setPriceChanged(true);
      setTimeout(() => setPriceChanged(false), 3000);
    }
    setPreviousTotal(state.pricing.total);
  }, [state.pricing.total, previousTotal]);

  const handleEditStep = (step: number) => {
    dispatch({ type: 'SET_STEP', payload: step });
  };

  const handleNext = () => {
    dispatch({ type: 'SET_STEP', payload: 4 });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 2 });
  };

  const distance = Math.round(
    Math.sqrt(
      Math.pow(state.pickup.lat - state.drop.lat, 2) +
      Math.pow(state.pickup.lng - state.drop.lng, 2)
    ) * 111
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-shyp-lightRed rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-shyp-dark">Order Summary</h2>
              <p className="text-shyp-gray text-sm">Review your delivery details</p>
            </div>
          </div>

          {/* Route Details */}
          <div className="mb-6 p-5 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-shyp-dark flex items-center gap-2">
                <svg className="w-5 h-5 text-shyp-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Route Details
              </h3>
              <button
                onClick={() => handleEditStep(1)}
                className="text-sm text-shyp-red hover:text-shyp-darkRed font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 bg-shyp-green rounded-full mt-1.5 flex-shrink-0"></span>
                <div className="flex-1">
                  <p className="text-xs text-shyp-gray font-medium">PICKUP</p>
                  <p className="text-sm text-shyp-dark font-medium">{state.pickup.address}</p>
                </div>
              </div>
              
              <div className="flex items-center ml-1">
                <div className="w-0.5 h-8 bg-gray-300 ml-1"></div>
                <span className="ml-4 text-xs text-shyp-gray">~{distance} km</span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="w-3 h-3 bg-shyp-red rounded-full mt-1.5 flex-shrink-0"></span>
                <div className="flex-1">
                  <p className="text-xs text-shyp-gray font-medium">DROP</p>
                  <p className="text-sm text-shyp-dark font-medium">{state.drop.address}</p>
                </div>
              </div>
            </div>

            {state.deliveryNotes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-shyp-gray font-medium">DELIVERY NOTES</p>
                <p className="text-sm text-shyp-dark">{state.deliveryNotes}</p>
              </div>
            )}
          </div>

          {/* Package Details */}
          <div className="mb-6 p-5 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-shyp-dark flex items-center gap-2">
                <span className="text-xl">📦</span>
                Package Details
              </h3>
              <button
                onClick={() => handleEditStep(2)}
                className="text-sm text-shyp-red hover:text-shyp-darkRed font-medium flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-shyp-gray font-medium">SIZE</p>
                <p className="text-sm text-shyp-dark font-medium flex items-center gap-2">
                  <span>{state.packageDetails.size && PACKAGE_SIZES[state.packageDetails.size].icon}</span>
                  {state.packageDetails.size && PACKAGE_SIZES[state.packageDetails.size].label}
                </p>
              </div>
              <div>
                <p className="text-xs text-shyp-gray font-medium">WEIGHT</p>
                <p className="text-sm text-shyp-dark font-medium">{state.packageDetails.weight} kg</p>
              </div>
              {state.packageDetails.description && (
                <div className="col-span-2">
                  <p className="text-xs text-shyp-gray font-medium">DESCRIPTION</p>
                  <p className="text-sm text-shyp-dark">{state.packageDetails.description}</p>
                </div>
              )}
              {state.packageDetails.fragile && (
                <div className="col-span-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    🥚 Fragile - Handle with care
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Type */}
          <div className="p-5 bg-gradient-to-r from-shyp-lightRed to-orange-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {state.deliveryType.type === 'express' ? '🚀' : '📦'}
                </span>
                <div>
                  <p className="font-semibold text-shyp-dark">
                    {state.deliveryType.type === 'express' ? 'Express Delivery' : 'Standard Delivery'}
                  </p>
                  <p className="text-sm text-shyp-gray">
                    Estimated: {state.deliveryType.estimatedTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleEditStep(2)}
                className="text-sm text-shyp-red hover:text-shyp-darkRed font-medium"
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 animate-slide-in-right">
          <h3 className="font-bold text-shyp-dark text-lg mb-4 flex items-center gap-2">
            💰 Fare Breakdown
          </h3>

          {priceChanged && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl animate-pulse">
              <p className="text-sm text-amber-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Price updated based on changes
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-shyp-gray">Base Fare</span>
              <span className="text-shyp-dark font-medium">₹{state.pricing.baseFare}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-shyp-gray">Distance ({distance} km × ₹12)</span>
              <span className="text-shyp-dark font-medium">₹{state.pricing.distanceCharge}</span>
            </div>
            {state.pricing.weightCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-shyp-gray">Weight Surcharge</span>
                <span className="text-shyp-dark font-medium">₹{state.pricing.weightCharge}</span>
              </div>
            )}
            {state.pricing.expressCharge > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-shyp-orange flex items-center gap-1">
                  <span>⚡</span> Express Delivery
                </span>
                <span className="text-shyp-orange font-medium">₹{state.pricing.expressCharge}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-shyp-gray">GST (18%)</span>
                <span className="text-shyp-dark font-medium">₹{state.pricing.gst}</span>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-shyp-dark">Total</span>
                <span className={`text-2xl font-bold text-shyp-red transition-all ${priceChanged ? 'scale-110' : ''}`}>
                  ₹{state.pricing.total}
                </span>
              </div>
            </div>
          </div>

          {/* Promo Code */}
          <div className="mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-shyp-red transition-colors"
              />
              <button className="px-4 py-3 bg-gray-100 text-shyp-gray rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                Apply
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleNext}
              className="w-full py-4 bg-shyp-red text-white rounded-xl font-semibold text-lg hover:bg-shyp-darkRed transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button
              onClick={handleBack}
              className="w-full py-3 border-2 border-gray-200 text-shyp-gray rounded-xl font-medium hover:border-shyp-red hover:text-shyp-red transition-all"
            >
              ← Back to Package Details
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-xs text-shyp-gray">
              <span className="flex items-center gap-1">
                <span>🔒</span> Secure
              </span>
              <span className="flex items-center gap-1">
                <span>✓</span> Verified
              </span>
              <span className="flex items-center gap-1">
                <span>🛡️</span> Insured
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
