import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'recycling center';
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
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google API returned status: ${data.status}`);
    }

    const places = data.results.slice(0, 5).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      distance: "Live", // Without distance matrix we just return Live
      type: query.toLowerCase().includes('ev') ? 'ev' : 'recycling'
    }));

    return NextResponse.json({ places, fallback: false });

  } catch (error) {
    console.error("[PLACES_API_ERROR]", error);
    return NextResponse.json({
      places: [
        { id: "error1", name: "Error Loading Live Places", address: "Please check API limits", distance: "N/A", type: "recycling" }
      ],
      fallback: true
    });
  }
}
