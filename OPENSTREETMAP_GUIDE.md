# OpenStreetMap (OpenMaps) Integration

## Overview
Earthquake notification app now uses **OpenStreetMap** (free, open-source alternative to Google Maps) for displaying earthquake locations and user positions.

## Key Benefits
- **No API Key Required** - Completely free to use
- **Open Source** - Community-driven, transparent data
- **Privacy Friendly** - No tracking or data collection
- **Always Available** - Reliable and stable service
- **Fast Performance** - Optimized static map tiles

## How It Works

### Server-Side Processing
The `/api/earthquake-map` route:
1. Receives earthquake coordinates and optional user location
2. Generates OpenStreetMap Static Map URL using free tiles
3. Returns the map URL to the client

### Client Display
The `GoogleMapDisplay` component (now OpenMaps):
1. Calls the API route with coordinates
2. Displays the static map image
3. Shows magnitude badge and OpenStreetMap attribution

## Map Features

### Markers
- **Red Pin (E)** - Earthquake Epicenter
- **Blue Pin (U)** - User's GPS Location (if available)

### Information Display
- Magnitude (top-right corner)
- OpenStreetMap Attribution (bottom-left)
- Zoom Level 6 (optimal for Indonesia region)
- Terrain Map Style

## No Configuration Needed
Unlike Google Maps, OpenStreetMap requires NO environment variables or API key setup. The service is completely free and ready to use out of the box!

## Switching Back to Google Maps
If you need to switch back to Google Maps:
1. Restore the original API route code
2. Add `GOOGLE_MAPS_API_KEY` environment variable
3. No component changes needed

## Attribution
OpenStreetMap uses data from © OpenStreetMap contributors, which is displayed on all maps for compliance with their open license.
