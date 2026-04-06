import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), 'data');
const ALL_LOCATIONS_FILE = path.join(DATA_DIR, 'all_locations.json');

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDateFolder(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return path.join(DATA_DIR, `${year}-${month}-${day}`);
}

function readLocations(): LocationData[] {
  ensureDataDirectory();
  if (!fs.existsSync(ALL_LOCATIONS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(ALL_LOCATIONS_FILE, 'utf-8');
    const locations = JSON.parse(data);
    // Sort by timestamp (newest first)
    return locations.sort((a: LocationData, b: LocationData) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch {
    return [];
  }
}

function saveLocations(locations: LocationData[]) {
  ensureDataDirectory();
  // Sort all locations by timestamp
  const sorted = locations.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  // Save master file
  fs.writeFileSync(ALL_LOCATIONS_FILE, JSON.stringify(sorted, null, 2));
}

function saveDailyLocations(location: LocationData) {
  ensureDataDirectory();
  const dateFolder = getDateFolder(new Date(location.timestamp));
  
  // Create date folder if it doesn't exist
  if (!fs.existsSync(dateFolder)) {
    fs.mkdirSync(dateFolder, { recursive: true });
  }
  
  const dailyFile = path.join(dateFolder, 'locations.json');
  let dailyLocations: LocationData[] = [];
  
  if (fs.existsSync(dailyFile)) {
    try {
      const data = fs.readFileSync(dailyFile, 'utf-8');
      dailyLocations = JSON.parse(data);
    } catch {
      dailyLocations = [];
    }
  }
  
  dailyLocations.push(location);
  // Sort daily locations by time
  dailyLocations.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  fs.writeFileSync(dailyFile, JSON.stringify(dailyLocations, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, latitude, longitude, accuracy } = body;

    if (!name || latitude === undefined || longitude === undefined || accuracy === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newLocation: LocationData = {
      id: Date.now().toString(),
      name,
      latitude,
      longitude,
      accuracy,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'Unknown',
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown',
    };

    const locations = readLocations();
    locations.push(newLocation);
    saveLocations(locations);
    saveDailyLocations(newLocation);

    return NextResponse.json({
      success: true,
      data: newLocation,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save location' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const locations = readLocations();
    return NextResponse.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve locations' },
      { status: 500 }
    );
  }
}
