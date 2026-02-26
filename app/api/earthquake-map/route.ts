import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for OpenStreetMap (OpenMaps) earthquake visualization
 * Uses Nominatim Staticmap service - free and open-source alternative to Google Maps
 * No API key required
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Get parameters from query string
    const epicenterLat = searchParams.get('lat');
    const epicenterLon = searchParams.get('lon');
    const userLat = searchParams.get('userLat');
    const userLon = searchParams.get('userLon');

    // Validate parameters
    if (!epicenterLat || !epicenterLon) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat, lon' },
        { status: 400 }
      );
    }

    // Parse numeric values
    const eqLat = parseFloat(epicenterLat);
    const eqLon = parseFloat(epicenterLon);

    if (isNaN(eqLat) || isNaN(eqLon)) {
      return NextResponse.json(
        { error: 'Invalid coordinate values' },
        { status: 400 }
      );
    }

    const mapWidth = 600;
    const mapHeight = 400;
    const zoom = 6;

    // Calculate center point
    let centerLat = eqLat;
    let centerLon = eqLon;

    if (userLat && userLon) {
      const userLatNum = parseFloat(userLat);
      const userLonNum = parseFloat(userLon);

      if (!isNaN(userLatNum) && !isNaN(userLonNum)) {
        // Center map between epicenter and user location
        centerLat = (eqLat + userLatNum) / 2;
        centerLon = (eqLon + userLonNum) / 2;
      }
    }

    // Build OpenStreetMap URL using tile.openstreetmap.org
    // Calculate tile coordinates from latitude/longitude
    const n = Math.pow(2, zoom);
    const xtile = Math.floor(((centerLon + 180) / 360) * n);
    const ytile = Math.floor(
      ((1 - Math.log(Math.tan((centerLat * Math.PI) / 180) + 1 / Math.cos((centerLat * Math.PI) / 180)) / Math.PI) / 2) * n
    );

    // Use OSM's official tile server with proper URL format
    // This generates a direct link to the map tile
    const finalUrl = `https://tile.openstreetmap.org/${zoom}/${xtile}/${ytile}.png`;

    console.log('[v0] Generated OpenMaps URL:', finalUrl);
    console.log('[v0] Earthquake location:', { lat: eqLat, lon: eqLon });
    if (userLat && userLon) {
      console.log('[v0] User location:', { lat: parseFloat(userLat), lon: parseFloat(userLon) });
    }

    return NextResponse.json({ 
      url: finalUrl,
      earthquake: { lat: eqLat, lon: eqLon },
      user: userLat && userLon ? { lat: parseFloat(userLat), lon: parseFloat(userLon) } : null,
    }, { status: 200 });
  } catch (error) {
    console.error('[v0] Error generating OpenMaps URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate map URL' },
      { status: 500 }
    );
  }
}
