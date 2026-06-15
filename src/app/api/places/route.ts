import { NextResponse } from 'next/server';
import { z } from 'zod';
import { withErrorHandler } from '@/lib/api-handler';

const placesQuerySchema = z.object({
  query: z.string().min(1).max(200).default('recycling center'),
});

export const GET = withErrorHandler(async ({ req }) => {
  const { searchParams } = new URL(req.url);
  
  const data = placesQuerySchema.parse({
    query: searchParams.get('query') || undefined,
  });

  const { query } = data;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Graceful fallback to mock data if key is missing
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate latency
    return NextResponse.json({
      places: [
        { id: "mock1", name: `Mock ${query} 1`, address: "123 Green Ave, NY", distance: "0.5 km", type: "recycling" },
        { id: "mock2", name: "ChargePoint Station (Mock)", address: "45 Broadway, NY", distance: "1.2 km", type: "ev" },
      ],
      fallback: true
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
    });
  }

  // Live Google Places API Text Search Integration
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  const response = await fetch(url);
  const placesData = await response.json();

  if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
    throw new Error(`Google API returned status: ${placesData.status}`);
  }

  interface GooglePlace {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    }
  }

  const places = placesData.results.slice(0, 5).map((place: GooglePlace) => ({
    id: place.place_id,
    name: place.name,
    address: place.formatted_address,
    distance: "Live", // Without distance matrix we just return Live
    type: query.toLowerCase().includes('ev') ? 'ev' : 'recycling'
  }));

  return NextResponse.json({ places, fallback: false });
});
