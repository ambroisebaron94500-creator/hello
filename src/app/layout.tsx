import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Location Data Collector",
  description: "Collect and manage user location data with permission",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-blue-600">Location Tracker</h1>
              <div className="space-x-4">
                <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
