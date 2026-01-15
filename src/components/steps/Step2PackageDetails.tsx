import { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';
import { PACKAGE_SIZES, PackageDetails } from '../../types';

type PackageSize = 'small' | 'medium' | 'large' | 'extra-large';

export default function Step2PackageDetails() {
  const { state, dispatch } = useBooking();
  const [packageDetails, setPackageDetails] = useState<PackageDetails>(state.packageDetails);
  const [deliveryType, setDeliveryType] = useState<'express' | 'standard'>(state.deliveryType.type);
  const [errors, setErrors] = useState({
    size: '',
    weight: '',
  });
  const [weightWarning, setWeightWarning] = useState('');

  const handleSizeSelect = (size: PackageSize) => {
    setPackageDetails(prev => ({ ...prev, size }));
    setErrors(prev => ({ ...prev, size: '' }));
    
    if (packageDetails.weight > PACKAGE_SIZES[size].maxWeight) {
      setWeightWarning(`Maximum weight for ${PACKAGE_SIZES[size].label} package is ${PACKAGE_SIZES[size].maxWeight}kg`);
    } else {
      setWeightWarning('');
    }
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = parseFloat(e.target.value) || 0;
    setPackageDetails(prev => ({ ...prev, weight }));
    setErrors(prev => ({ ...prev, weight: '' }));

    if (packageDetails.size && weight > PACKAGE_SIZES[packageDetails.size].maxWeight) {
      setWeightWarning(`Maximum weight for ${PACKAGE_SIZES[packageDetails.size].label} package is ${PACKAGE_SIZES[packageDetails.size].maxWeight}kg. Consider upgrading package size.`);
    } else {
      setWeightWarning('');
    }
  };

  const handleNext = () => {
    const newErrors = {
      size: '',
      weight: '',
    };

    if (!packageDetails.size) {
      newErrors.size = 'Please select a package size';
    }

    if (packageDetails.weight <= 0) {
      newErrors.weight = 'Please enter package weight';
    } else if (packageDetails.size && packageDetails.weight > PACKAGE_SIZES[packageDetails.size].maxWeight) {
      newErrors.weight = `Weight exceeds ${PACKAGE_SIZES[packageDetails.size].maxWeight}kg limit for ${PACKAGE_SIZES[packageDetails.size].label} package`;
    }

    setErrors(newErrors);

    if (!newErrors.size && !newErrors.weight) {
      dispatch({ type: 'SET_PACKAGE_DETAILS', payload: packageDetails });
      dispatch({
        type: 'SET_DELIVERY_TYPE',
        payload: {
          type: deliveryType,
          estimatedTime: deliveryType === 'express' ? '45-60 mins' : '2-4 hours',
          price: deliveryType === 'express' ? 99 : 0,
        },
      });
      dispatch({ type: 'CALCULATE_PRICING' });
      dispatch({ type: 'SET_STEP', payload: 3 });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  const isNextDisabled = !packageDetails.size || packageDetails.weight <= 0 ||
    (packageDetails.size && packageDetails.weight > PACKAGE_SIZES[packageDetails.size].maxWeight);

  useEffect(() => {
    if (packageDetails.weight > 0 && !packageDetails.size) {
      // Suggest package size based on weight (optional enhancement)
    }
  }, [packageDetails.weight, packageDetails.size]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 lg:p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-shyp-lightRed rounded-xl flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-shyp-dark">Package Details</h2>
            <p className="text-shyp-gray text-sm">Tell us about your package</p>
          </div>
        </div>

        {/* Package Size Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-shyp-dark mb-3">
            Select Package Size *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.entries(PACKAGE_SIZES) as [PackageSize, typeof PACKAGE_SIZES[PackageSize]][]).map(([key, size]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSizeSelect(key)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  packageDetails.size === key
                    ? 'border-shyp-red bg-shyp-lightRed shadow-lg scale-[1.02]'
                    : 'border-gray-200 hover:border-shyp-red hover:bg-red-50'
                }`}
              >
                <span className="text-3xl block mb-2">{size.icon}</span>
                <span className="font-semibold text-shyp-dark block">{size.label}</span>
                <span className="text-xs text-shyp-gray block">{size.description}</span>
                <span className="text-xs text-shyp-red font-medium block mt-1">
                  Up to {size.maxWeight}kg
                </span>
              </button>
            ))}
          </div>
          {errors.size && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.size}
            </p>
          )}
        </div>

        {/* Package Weight */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-shyp-dark mb-3">
            Package Weight (kg) *
          </label>
          <div className="relative">
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={packageDetails.weight || ''}
              onChange={handleWeightChange}
              placeholder="Enter weight in kg"
              className={`w-full px-4 py-4 border-2 rounded-xl transition-all ${
                errors.weight
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-shyp-red'
              }`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-shyp-gray font-medium">
              kg
            </span>
          </div>
          {errors.weight && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {errors.weight}
            </p>
          )}
          {weightWarning && !errors.weight && (
            <p className="mt-2 text-sm text-amber-600 flex items-center gap-1 bg-amber-50 p-2 rounded-lg">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {weightWarning}
            </p>
          )}
          {packageDetails.size && (
            <p className="mt-2 text-xs text-shyp-gray">
              💡 Maximum weight for {PACKAGE_SIZES[packageDetails.size].label}: {PACKAGE_SIZES[packageDetails.size].maxWeight}kg
            </p>
          )}
        </div>

        {/* Package Description */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-shyp-dark mb-3">
            Package Description (Optional)
          </label>
          <input
            type="text"
            value={packageDetails.description}
            onChange={(e) => setPackageDetails(prev => ({ ...prev, description: e.target.value }))}
            placeholder="e.g., Electronics, Clothes, Documents..."
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-shyp-red transition-all"
          />
        </div>

        {/* Fragile Checkbox */}
        <div className="mb-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={packageDetails.fragile}
              onChange={(e) => setPackageDetails(prev => ({ ...prev, fragile: e.target.checked }))}
              className="custom-checkbox"
            />
            <span className="flex items-center gap-2">
              <span className="text-lg">🥚</span>
              <span className="font-medium text-shyp-dark group-hover:text-shyp-red transition-colors">
                This package is fragile
              </span>
            </span>
          </label>
          <p className="text-xs text-shyp-gray ml-8 mt-1">
            We'll handle your package with extra care
          </p>
        </div>

        {/* Delivery Type - Express vs Standard (EDGE CASE) */}
        <div className="mb-8 p-6 bg-gradient-to-r from-shyp-lightRed to-orange-50 rounded-2xl">
          <label className="block text-sm font-semibold text-shyp-dark mb-4">
            ⚡ Choose Delivery Speed
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Express Delivery */}
            <button
              type="button"
              onClick={() => setDeliveryType('express')}
              className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left overflow-hidden ${
                deliveryType === 'express'
                  ? 'border-shyp-orange bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-shyp-orange'
              }`}
            >
              {deliveryType === 'express' && (
                <div className="absolute top-0 right-0 bg-shyp-orange text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                  SELECTED
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🚀</span>
                <div>
                  <span className="font-bold text-shyp-dark block">Express Delivery</span>
                  <span className="text-shyp-orange font-semibold text-sm">+ ₹99</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-shyp-gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>45-60 minutes</span>
              </div>
              <p className="text-xs text-shyp-gray mt-2">
                Priority pickup & fastest delivery
              </p>
            </button>

            {/* Standard Delivery */}
            <button
              type="button"
              onClick={() => setDeliveryType('standard')}
              className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left ${
                deliveryType === 'standard'
                  ? 'border-shyp-green bg-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-shyp-green'
              }`}
            >
              {deliveryType === 'standard' && (
                <div className="absolute top-0 right-0 bg-shyp-green text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                  SELECTED
                </div>
              )}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">📦</span>
                <div>
                  <span className="font-bold text-shyp-dark block">Standard Delivery</span>
                  <span className="text-shyp-green font-semibold text-sm">No extra charge</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-shyp-gray">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>2-4 hours</span>
              </div>
              <p className="text-xs text-shyp-gray mt-2">
                Reliable same-day delivery
              </p>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            className="px-6 py-4 rounded-xl font-semibold text-shyp-gray border-2 border-gray-200 hover:border-shyp-red hover:text-shyp-red transition-all"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isNextDisabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-shyp-red text-white hover:bg-shyp-darkRed hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            Continue to Summary
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar - Package Info */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 animate-slide-in-right">
          <h3 className="font-bold text-shyp-dark mb-4">📋 Package Guidelines</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-800 text-sm mb-2">📄 Small Package</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Documents, envelopes</li>
                <li>• Small electronics</li>
                <li>• Up to 30×20×10 cm</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <h4 className="font-semibold text-green-800 text-sm mb-2">📦 Medium Package</h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• Shoeboxes, parcels</li>
                <li>• Laptops, tablets</li>
                <li>• Up to 50×40×30 cm</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl">
              <h4 className="font-semibold text-orange-800 text-sm mb-2">📫 Large Package</h4>
              <ul className="text-xs text-orange-700 space-y-1">
                <li>• Large boxes</li>
                <li>• Small appliances</li>
                <li>• Up to 80×60×50 cm</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <h4 className="font-semibold text-purple-800 text-sm mb-2">🚚 Extra Large</h4>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Furniture, mattresses</li>
                <li>• Large appliances</li>
                <li>• Up to 120×80×80 cm</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Important Note
            </h4>
            <p className="text-xs text-amber-700 mt-1">
              Exceeding weight limits may result in additional charges or rejection of shipment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
