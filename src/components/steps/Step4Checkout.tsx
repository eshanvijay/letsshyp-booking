import { useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export default function Step4Checkout() {
  const { state, dispatch } = useBooking();
  const [userDetails, setUserDetails] = useState(state.userDetails);
  const [errors, setErrors] = useState({
    senderName: '',
    senderPhone: '',
    receiverName: '',
    receiverPhone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      senderName: '',
      senderPhone: '',
      receiverName: '',
      receiverPhone: '',
    };

    if (!userDetails.senderName.trim()) {
      newErrors.senderName = 'Please enter sender name';
    }

    if (!userDetails.senderPhone.trim()) {
      newErrors.senderPhone = 'Please enter sender phone';
    } else if (!validatePhone(userDetails.senderPhone)) {
      newErrors.senderPhone = 'Please enter a valid 10-digit phone number';
    }

    if (!userDetails.receiverName.trim()) {
      newErrors.receiverName = 'Please enter receiver name';
    }

    if (!userDetails.receiverPhone.trim()) {
      newErrors.receiverPhone = 'Please enter receiver phone';
    } else if (!validatePhone(userDetails.receiverPhone)) {
      newErrors.receiverPhone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setSubmitError(null);

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (retryCount === 0 && Math.random() < 0.1) {
            reject(new Error('Network error'));
          } else {
            resolve(true);
          }
        }, 2000);
      });

      const bookingId = `LS-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      dispatch({ type: 'SET_USER_DETAILS', payload: userDetails });
      dispatch({ type: 'SET_BOOKING_ID', payload: bookingId });
      dispatch({ type: 'SET_STEP', payload: 5 });
    } catch {
      setSubmitError('Failed to place booking. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: 3 });
  };

  const handleInputChange = (field: keyof typeof userDetails) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field.includes('Phone') 
      ? e.target.value.replace(/\D/g, '').slice(0, 10)
      : e.target.value;
    
    setUserDetails(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setSubmitError(null);
  };

  const isFormValid = userDetails.senderName && userDetails.senderPhone && 
    userDetails.receiverName && userDetails.receiverPhone;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 lg:p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-shyp-lightRed rounded-xl flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-shyp-dark">Contact Details</h2>
            <p className="text-shyp-gray text-sm">Enter sender and receiver information</p>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-up">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-red-700">{submitError}</p>
                <p className="text-sm text-red-600 mt-1">
                  Don't worry, your information is saved. Click the button below to try again.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sender Details */}
        <div className="mb-8">
          <h3 className="font-semibold text-shyp-dark mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">1</span>
            Sender Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-shyp-gray mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={userDetails.senderName}
                onChange={handleInputChange('senderName')}
                placeholder="Enter sender's full name"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                  errors.senderName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-shyp-red'
                }`}
              />
              {errors.senderName && (
                <p className="mt-1 text-sm text-red-500">{errors.senderName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-shyp-gray mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-shyp-gray">+91</span>
                <input
                  type="tel"
                  value={userDetails.senderPhone}
                  onChange={handleInputChange('senderPhone')}
                  placeholder="9876543210"
                  className={`w-full pl-14 pr-4 py-3 border-2 rounded-xl transition-all ${
                    errors.senderPhone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-shyp-red'
                  }`}
                />
              </div>
              {errors.senderPhone && (
                <p className="mt-1 text-sm text-red-500">{errors.senderPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Receiver Details */}
        <div className="mb-8">
          <h3 className="font-semibold text-shyp-dark mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-red-100 text-shyp-red rounded-full flex items-center justify-center text-sm">2</span>
            Receiver Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-shyp-gray mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={userDetails.receiverName}
                onChange={handleInputChange('receiverName')}
                placeholder="Enter receiver's full name"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all ${
                  errors.receiverName ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-shyp-red'
                }`}
              />
              {errors.receiverName && (
                <p className="mt-1 text-sm text-red-500">{errors.receiverName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-shyp-gray mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-shyp-gray">+91</span>
                <input
                  type="tel"
                  value={userDetails.receiverPhone}
                  onChange={handleInputChange('receiverPhone')}
                  placeholder="9876543210"
                  className={`w-full pl-14 pr-4 py-3 border-2 rounded-xl transition-all ${
                    errors.receiverPhone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-shyp-red'
                  }`}
                />
              </div>
              {errors.receiverPhone && (
                <p className="mt-1 text-sm text-red-500">{errors.receiverPhone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="custom-checkbox mt-0.5"
            />
            <span className="text-sm text-shyp-gray">
              I agree to the <a href="#" className="text-shyp-red hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-shyp-red hover:underline">Privacy Policy</a>. I confirm that the package
              does not contain any prohibited items.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBack}
            disabled={isProcessing}
            className="px-6 py-4 rounded-xl font-semibold text-shyp-gray border-2 border-gray-200 hover:border-shyp-red hover:text-shyp-red transition-all disabled:opacity-50"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !isFormValid}
            className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              isProcessing || !isFormValid
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-shyp-red text-white hover:bg-shyp-darkRed hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : submitError ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Booking
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Place Booking • ₹{state.pricing.total}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 animate-slide-in-right">
          <h3 className="font-bold text-shyp-dark text-lg mb-4">📋 Order Summary</h3>

          <div className="mb-4 p-4 bg-gray-50 rounded-xl">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-shyp-green rounded-full mt-2 flex-shrink-0"></span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-shyp-gray">FROM</p>
                  <p className="text-sm text-shyp-dark truncate">{state.pickup.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-shyp-red rounded-full mt-2 flex-shrink-0"></span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-shyp-gray">TO</p>
                  <p className="text-sm text-shyp-dark truncate">{state.drop.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-shyp-gray">Package</span>
              <span className="text-shyp-dark font-medium">{state.packageDetails.weight}kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-shyp-gray">Delivery</span>
              <span className={`font-medium ${state.deliveryType.type === 'express' ? 'text-shyp-orange' : 'text-shyp-dark'}`}>
                {state.deliveryType.type === 'express' ? '🚀 Express' : '📦 Standard'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-shyp-gray">ETA</span>
              <span className="text-shyp-dark font-medium">{state.deliveryType.estimatedTime}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-shyp-dark">Total Amount</span>
              <span className="text-2xl font-bold text-shyp-red">₹{state.pricing.total}</span>
            </div>
            <p className="text-xs text-shyp-gray mt-1">Inclusive of all taxes</p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-shyp-gray mb-3">Payment on delivery</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded text-xs">💵 Cash</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-xs">📱 UPI</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-xs">💳 Card</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">100% Secure Booking</span>
            </div>
            <p className="text-xs text-green-600 mt-1 ml-7">
              Your details are encrypted and safe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
