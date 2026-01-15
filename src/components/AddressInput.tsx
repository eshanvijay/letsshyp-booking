import { useRef, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

interface AddressInputProps {
  placeholder: string;
  value: string;
  onSelect: (address: string, lat: number, lng: number) => void;
  error?: string;
}

export default function AddressInput({
  placeholder,
  value,
  onSelect,
  error,
}: AddressInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    ready,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'in' },
    },
    debounce: 300,
    defaultValue: value,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect(description, lat, lng);
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const handleClear = () => {
    setValue('');
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
          value={value || ''}
          onChange={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          disabled={!ready}
          placeholder={placeholder}
          className="w-full px-3 py-4 bg-transparent outline-none text-shyp-dark placeholder-gray-400"
        />
        {value && (
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
      {status === 'OK' && isFocused && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fade-in">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
              <li
                key={place_id}
                onClick={() => handleSelect(suggestion.description)}
                className="px-4 py-3 hover:bg-shyp-lightRed cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
              >
                <p className="font-medium text-shyp-dark">{main_text}</p>
                <p className="text-sm text-shyp-gray">{secondary_text}</p>
              </li>
            );
          })}
        </ul>
      )}

      {/* Loading State */}
      {!ready && (
        <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-shyp-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
