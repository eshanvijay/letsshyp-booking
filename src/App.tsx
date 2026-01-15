import { LoadScript } from '@react-google-maps/api';
import { BookingProvider } from './context/BookingContext';
import Header from './components/Header';
import BookingFlow from './components/BookingFlow';
import Footer from './components/Footer';

const GOOGLE_MAPS_API_KEY = 'AIzaSyA8TjA2kY2Gj6bJbHTbjFQYlG724_QXElg';
const libraries: ("places")[] = ['places'];

function App() {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <BookingProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8">
            <BookingFlow />
          </main>
          <Footer />
        </div>
      </BookingProvider>
    </LoadScript>
  );
}

export default App;
