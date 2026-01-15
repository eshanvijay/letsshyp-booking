import { useBooking } from '../context/BookingContext';

export default function Header() {
  const { state } = useBooking();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top ticker bar */}
      <div className="bg-shyp-red text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 text-sm font-medium">
              <span>🔒 Best Prices Guaranteed</span>
              <span>•</span>
              <span>🚛 Safe & Secure Transport</span>
              <span>•</span>
              <span>⚡ Real-time Tracking</span>
              <span>•</span>
              <span>🚚 Fast & Reliable Delivery</span>
              <span>•</span>
              <span>📦 Book in Minutes</span>
              <span>•</span>
              <span>🔒 Best Prices Guaranteed</span>
              <span>•</span>
              <span>🚛 Safe & Secure Transport</span>
              <span>•</span>
              <span>⚡ Real-time Tracking</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-shyp-green text-white px-3 py-1 rounded-lg font-bold text-lg">
              <span className="text-xs block leading-none">10</span>
              <span className="text-xs">Mins</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-shyp-dark">Let's</span>
              <span className="text-xl font-bold text-shyp-red">Shyp</span>
            </div>
          </div>

          {/* Step indicator (desktop) */}
          {state.currentStep < 5 && (
            <div className="hidden md:flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      step < state.currentStep
                        ? 'bg-shyp-green text-white'
                        : step === state.currentStep
                        ? 'bg-shyp-red text-white scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step < state.currentStep ? '✓' : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`w-12 h-1 mx-1 rounded transition-all duration-300 ${
                        step < state.currentStep ? 'bg-shyp-green' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Help */}
          <div className="flex items-center gap-4">
            <a
              href="tel:+919876543210"
              className="hidden sm:flex items-center gap-2 text-shyp-gray hover:text-shyp-red transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="font-medium">Need Help?</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </header>
  );
}
