import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function POST(req) {
  try {
    const { origins, destinations } = await req.json();

    if (!origins || !Array.isArray(destinations)) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 });
    }

    const destinationsQuery = destinations
      .map((i) => `${i.geolocation.y},${i.geolocation.x}`)
      .join("|");

    const googleApiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins.lat},${origins.lng}&destinations=${destinationsQuery}&mode=walking&key=${API_KEY}`;
    const response = await fetch(googleApiUrl);
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data from Google API" }, { status: response.status });
    }
    
    const data = await response.json();

    // Sort by nearest
    const sortedResults = data.rows[0]?.elements
      ?.map((element, i) => ({
        fatid: destinations[i].fatid,
        destination: `${destinations[i].geolocation.y},${destinations[i].geolocation.x}`,
        distance: element.distance?.value,
        duration: element.duration?.text,
      }))
      .filter((item) => item.distance !== undefined)
      .sort((a, b) => a.distance - b.distance);


    return NextResponse.json(sortedResults);
  } catch (error) {
    console.error("Error fetching Google Distance Matrix API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
