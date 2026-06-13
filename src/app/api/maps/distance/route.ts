import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get('origin');
  const destination = searchParams.get('destination');

  if (!origin || !destination) {
    return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_DISTANCE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Distance Matrix API key is missing' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
        throw new Error(data.error_message || 'Request Denied by Google Maps');
    }

    if (data.rows && data.rows[0] && data.rows[0].elements[0]) {
      const element = data.rows[0].elements[0];
      if (element.status === 'OK') {
        // element.distance.value is in meters. Convert to kilometers.
        const distanceInKm = element.distance.value / 1000;
        return NextResponse.json({ distance: distanceInKm });
      } else {
        return NextResponse.json({ error: `Could not calculate route: ${element.status}` }, { status: 400 });
      }
    }

    return NextResponse.json({ error: 'Invalid response from Google Maps' }, { status: 500 });

  } catch (error) {
    console.error('Distance Matrix Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch distance' }, { status: 500 });
  }
}
