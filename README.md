# Location Data Collection Website

A Next.js application that collects user location data with explicit permission and displays it in a dashboard.

## Features

- **Location Permission Request**: Uses the Geolocation API to request user location with explicit consent
- **Secure Data Storage**: Stores location data securely in JSON format
- **Dashboard**: View all collected location data with statistics
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern, responsive UI design
- **ESLint**: Code quality assurance

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── locations/
│   │       └── route.ts          # API endpoint for location data
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard view
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   └── LocationForm.tsx          # Location permission & form component
└── lib/                          # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd floor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build

Build the application for production:

```bash
npm run build
npm run start
```

## Usage

1. **Home Page** (`/`): 
   - Click "Share My Location" button to request your location
   - Your location data will be saved securely

2. **Dashboard** (`/dashboard`):
   - View all collected location data
   - See statistics about submissions and accuracy

## Data Storage

Location data is stored in `data/locations.json` with the following structure:

```json
{
  "id": "timestamp",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 25.5,
  "timestamp": "2024-01-15T10:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

## API Endpoints

### POST `/api/locations`

Save a new location entry.

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 25.5
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...location object }
}
```

### GET `/api/locations`

Retrieve all collected location data.

**Response:**
```json
{
  "success": true,
  "count": 42,
  "data": [ ...location objects ]
}
```

## Privacy & Security

- Users must explicitly grant location permission
- Data is stored locally on the server
- No data is sent to third parties
- Users can review their submitted data in the dashboard

## Technologies Used

- **Next.js 14**: React framework for server and client rendering
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Node.js**: Server-side runtime

## License

MIT
