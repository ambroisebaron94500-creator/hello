'use client';

import { useEffect, useState } from 'react';

interface LocationData {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
}

export default function Dashboard() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      const data = await response.json();
      if (data.success) {
        setLocations(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Location Data Dashboard
        </h2>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">Total Submissions</p>
              <p className="text-3xl font-bold text-blue-600">{locations.length}</p>
            </div>
            {locations.length > 0 && (
              <>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Average Accuracy (m)</p>
                  <p className="text-3xl font-bold text-green-600">
                    {(locations.reduce((sum, loc) => sum + loc.accuracy, 0) / locations.length).toFixed(2)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Last Submission</p>
                  <p className="text-sm font-semibold text-purple-600">
                    {new Date(locations[locations.length - 1].timestamp).toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Collected Location Data
            </h3>
          </div>
          {locations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Latitude</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Longitude</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Accuracy (m)</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {locations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{location.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{location.latitude.toFixed(6)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{location.longitude.toFixed(6)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{location.accuracy.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(location.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No location data collected yet. Start by submitting your location on the home page.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
