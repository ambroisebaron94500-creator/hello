'use client';

import { useState } from 'react';

interface LocationFormProps {
  onSuccess: () => void;
}

export default function LocationForm({ onSuccess }: LocationFormProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);

  const requestLocation = async () => {
    if (!name.trim()) {
      setError('Please enter your name before sharing your location.');
      return;
    }

    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocation({ latitude, longitude, accuracy });

        try {
          const response = await fetch('/api/locations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: name.trim(),
              latitude,
              longitude,
              accuracy,
            }),
          });

          if (response.ok) {
            onSuccess();
          } else {
            setError('Failed to save location data. Please try again.');
          }
        } catch (err) {
          setError('An error occurred while saving your location.');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('The request to get user location timed out.');
            break;
          default:
            setError('An error occurred while retrieving your location.');
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Your location data will be stored securely and used only for research purposes. We respect your privacy.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Your Name
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      <button
        onClick={requestLocation}
        disabled={loading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Retrieving Location...' : 'Share My Location'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {location && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm font-semibold mb-2">Location Data Captured:</p>
          <ul className="text-green-700 text-sm space-y-1">
            <li>
              <strong>Latitude:</strong> {location.latitude.toFixed(6)}
            </li>
            <li>
              <strong>Longitude:</strong> {location.longitude.toFixed(6)}
            </li>
            <li>
              <strong>Accuracy:</strong> {location.accuracy.toFixed(2)} meters
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
