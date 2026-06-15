import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withErrorHandler } from '@/lib/api-handler';

const geocodeSchema = z.object({
  address: z.string().min(1).max(200),
});

export const GET = withErrorHandler(async ({ req }) => {
  const { searchParams } = new URL(req.url);
  
  const data = geocodeSchema.parse({
    address: searchParams.get('address') || '',
  });

  const { address } = data;

  // We reuse the existing backend key which should now have Geocoding API enabled
  const apiKey = process.env.GOOGLE_MAPS_DISTANCE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === 'REQUEST_DENIED') {
        throw new Error(data.error_message || 'Request Denied by Google Maps');
    }

    if (data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      // We also determine a good zoom level based on the type of result
      const types = data.results[0].types;
      let zoom = 12; // Default city zoom
      if (types.includes('country')) {
          zoom = 5;
      } else if (types.includes('administrative_area_level_1')) { // State/Province
          zoom = 7;
      }

      return NextResponse.json({ lat: location.lat, lng: location.lng, zoom });
    }

    return NextResponse.json({ error: 'No results found' }, { status: 404 });

  } catch (error) {
    void(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to fetch geocode' }, { status: 500 });
  }
});
