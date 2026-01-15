import { useBooking } from '../context/BookingContext';
import StepIndicator from './StepIndicator';
import Step1PickupDrop from './steps/Step1PickupDrop';
import Step2PackageDetails from './steps/Step2PackageDetails';
import Step3PricingSummary from './steps/Step3PricingSummary';
import Step4Checkout from './steps/Step4Checkout';
import Step5Confirmation from './steps/Step5Confirmation';

export default function BookingFlow() {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1PickupDrop />;
      case 2:
        return <Step2PackageDetails />;
      case 3:
        return <Step3PricingSummary />;
      case 4:
        return <Step4Checkout />;
      case 5:
        return <Step5Confirmation />;
      default:
        return <Step1PickupDrop />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Mobile Step Indicator */}
      {state.currentStep < 5 && (
        <div className="md:hidden mb-6">
          <StepIndicator />
        </div>
      )}

      {/* Main Content */}
      <div className="animate-fade-in">
        {renderStep()}
      </div>
    </div>
  );
}
