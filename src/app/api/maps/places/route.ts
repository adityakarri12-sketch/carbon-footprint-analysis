import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const type = searchParams.get('type'); // 'recycling' or 'ev'

  if (!lat || !lng || !type) {
    return NextResponse.json({ error: 'Lat, lng, and type are required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_DISTANCE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    // We use Text Search (Places API) to find specific things like "Recycling Center" or "EV Charging Station"
    const query = type === 'ev' ? 'EV charging station' : 'Recycling center';
    
    // We use the older Places API Text Search which doesn't require FieldMasks like Places API New,
    // because it's simpler and more robust for generic keys.
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=10000&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
        throw new Error(data.error_message || 'Request Denied by Google Maps');
    }

    if (data.results) {
      // Map it to the interface the frontend expects
      const places = data.results.slice(0, 10).map((place: any) => ({
        id: place.place_id,
        name: place.name,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        address: place.formatted_address,
      }));
      return NextResponse.json({ places });
    }

    return NextResponse.json({ places: [] });

  } catch (error) {
    console.error('Places API Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch places' }, { status: 500 });
  }
}
