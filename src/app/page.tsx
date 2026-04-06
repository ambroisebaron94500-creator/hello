'use client';

import { useState } from 'react';
import LocationForm from '@/components/LocationForm';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Share Your Location
          </h2>
          <p className="text-gray-600 mb-8">
            Help us improve our services by sharing your location data. We promise to keep your information safe and use it only for research purposes.
          </p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Thank You!
              </h3>
              <p className="text-green-700">
                Your location data has been successfully recorded. You can view all collected data on our dashboard.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <LocationForm onSuccess={() => setSubmitted(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
