import { useEffect, useState } from 'react';
import { useBooking } from '../../context/BookingContext';

interface Confetti {
  id: number;
  left: number;
  delay: number;
  color: string;
}

export default function Step5Confirmation() {
  const { state, dispatch } = useBooking();
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const colors = ['#E53935', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0'];
    const newConfetti: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);

    const timer = setTimeout(() => setConfetti([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyBookingId = () => {
    if (state.bookingId) {
      navigator.clipboard.writeText(state.bookingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewBooking = () => {
    dispatch({ type: 'RESET' });
  };

  const handleTrackOrder = () => {
    alert(`Tracking page for ${state.bookingId} - Coming soon!`);
  };

  return (
    <div className="relative">
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti fixed w-3 h-3 rounded-full pointer-events-none z-50"
          style={{
            left: `${c.left}%`,
            top: '-20px',
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
          }}
        />
      ))}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center animate-slide-up">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  className="checkmark-path"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-shyp-dark mb-2">Booking Confirmed!</h1>
          <p className="text-shyp-gray mb-6">
            Your delivery has been successfully booked. We've sent the details to your phone.
          </p>

          <div className="mb-8 p-4 bg-shyp-lightRed rounded-xl inline-flex items-center gap-3">
            <div>
              <p className="text-xs text-shyp-gray">Booking Reference</p>
              <p className="text-xl font-bold text-shyp-red">{state.bookingId}</p>
            </div>
            <button
              onClick={handleCopyBookingId}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="Copy booking ID"
            >
              {copied ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-shyp-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          <div className="text-left mb-8 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-shyp-dark mb-4">Order Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="w-3 h-3 bg-shyp-green rounded-full"></span>
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                  <span className="w-3 h-3 bg-shyp-red rounded-full"></span>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs text-shyp-gray">PICKUP</p>
                    <p className="text-sm text-shyp-dark">{state.pickup.address}</p>
                    <p className="text-xs text-shyp-gray mt-1">
                      {state.userDetails.senderName} • +91 {state.userDetails.senderPhone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-shyp-gray">DROP</p>
                    <p className="text-sm text-shyp-dark">{state.drop.address}</p>
                    <p className="text-xs text-shyp-gray mt-1">
                      {state.userDetails.receiverName} • +91 {state.userDetails.receiverPhone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-shyp-gray">DELIVERY TYPE</p>
                  <p className="text-sm text-shyp-dark font-medium flex items-center gap-1">
                    {state.deliveryType.type === 'express' ? '🚀' : '📦'}
                    {state.deliveryType.type === 'express' ? 'Express' : 'Standard'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-shyp-gray">ESTIMATED TIME</p>
                  <p className="text-sm text-shyp-dark font-medium">{state.deliveryType.estimatedTime}</p>
                </div>
                <div>
                  <p className="text-xs text-shyp-gray">PACKAGE</p>
                  <p className="text-sm text-shyp-dark font-medium">{state.packageDetails.weight}kg</p>
                </div>
                <div>
                  <p className="text-xs text-shyp-gray">TOTAL PAID</p>
                  <p className="text-lg text-shyp-red font-bold">₹{state.pricing.total}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 p-6 bg-blue-50 rounded-xl text-left">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What happens next?
            </h3>
            <ol className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">1</span>
                <span>Our delivery partner will be assigned shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">2</span>
                <span>You'll receive a call before pickup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">3</span>
                <span>Track your delivery in real-time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs flex-shrink-0">4</span>
                <span>Receive confirmation once delivered</span>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleTrackOrder}
              className="flex-1 py-4 bg-shyp-red text-white rounded-xl font-semibold hover:bg-shyp-darkRed transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Track Order
            </button>
            <button
              onClick={handleNewBooking}
              className="flex-1 py-4 border-2 border-shyp-red text-shyp-red rounded-xl font-semibold hover:bg-shyp-lightRed transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Booking
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-shyp-gray">
              Need help? Contact us at{' '}
              <a href="tel:+919876543210" className="text-shyp-red hover:underline">+91 98765 43210</a>
              {' '}or{' '}
              <a href="mailto:support@letsshyp.com" className="text-shyp-red hover:underline">support@letsshyp.com</a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center animate-fade-in">
          <p className="text-shyp-gray text-sm flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            Your booking is confirmed and payment will be collected on delivery
          </p>
        </div>
      </div>
    </div>
  );
}
