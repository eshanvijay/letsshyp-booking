import { useEffect, useState } from 'react';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import BookingFlow from './components/BookingFlow';
import Footer from './components/Footer';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA8TjA2kY2Gj6bJbHTbjFQYlG724_QXElg';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Places API script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-shyp-lightRed to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-shyp-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-shyp-gray font-medium">Loading Let's Shyp...</p>
        </div>
      </div>
    );
  }

  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <BookingFlow />
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}

export default App;
