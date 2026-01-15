import { useRef, useState, useEffect, useCallback } from 'react';

interface AddressInputProps {
  placeholder: string;
  value: string;
  onSelect: (address: string, lat: number, lng: number) => void;
  error?: string;
}

interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function AddressInput({
  placeholder,
  value,
  onSelect,
  error,
}: AddressInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      // Create a dummy div for PlacesService
      const dummyDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(dummyDiv);
    }
  }, []);

  const searchPlaces = useCallback((input: string) => {
    if (!autocompleteService.current || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    autocompleteService.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'in' },
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions as Suggestion[]);
        } else {
          setSuggestions([]);
        }
      }
    );
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Debounce the search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      searchPlaces(newValue);
    }, 300);
  };

  const handleSelect = (suggestion: Suggestion) => {
    if (!placesService.current) return;

    setInputValue(suggestion.description);
    setSuggestions([]);

    // Get place details to retrieve lat/lng
    placesService.current.getDetails(
      {
        placeId: suggestion.place_id,
        fields: ['geometry'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          onSelect(suggestion.description, lat, lng);
        }
      }
    );
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    onSelect('', 0, 0);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div
        className={`relative flex items-center border-2 rounded-xl transition-all duration-300 ${
          error
            ? 'border-red-400 bg-red-50'
            : isFocused
            ? 'border-shyp-red shadow-lg shadow-red-100'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="pl-4">
          <svg
            className={`w-5 h-5 transition-colors ${
              error ? 'text-red-400' : isFocused ? 'text-shyp-red' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full px-3 py-4 bg-transparent outline-none text-shyp-dark placeholder-gray-400"
        />
        {isLoading && (
          <div className="pr-2">
            <div className="w-5 h-5 border-2 border-shyp-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {inputValue && !isLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="pr-4 text-gray-400 hover:text-shyp-red transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && isFocused && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="px-4 py-3 hover:bg-shyp-lightRed cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <p className="font-medium text-shyp-dark">
                {suggestion.structured_formatting.main_text}
              </p>
              <p className="text-sm text-shyp-gray">
                {suggestion.structured_formatting.secondary_text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
