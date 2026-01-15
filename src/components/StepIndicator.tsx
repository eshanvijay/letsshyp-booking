import { useBooking } from '../context/BookingContext';

const steps = [
  { number: 1, title: 'Pickup & Drop', icon: '📍' },
  { number: 2, title: 'Package', icon: '📦' },
  { number: 3, title: 'Summary', icon: '📋' },
  { number: 4, title: 'Checkout', icon: '💳' },
];

export default function StepIndicator() {
  const { state } = useBooking();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  step.number < state.currentStep
                    ? 'bg-shyp-green text-white'
                    : step.number === state.currentStep
                    ? 'bg-shyp-red text-white scale-110 shadow-lg'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.number < state.currentStep ? '✓' : step.icon}
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  step.number === state.currentStep
                    ? 'text-shyp-red'
                    : step.number < state.currentStep
                    ? 'text-shyp-green'
                    : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-1 mx-2 rounded transition-all duration-300 ${
                  step.number < state.currentStep
                    ? 'bg-shyp-green'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
