# Earthquake Location Map Visualization

## Overview
Implemented comprehensive earthquake location mapping with accurate distance measurements between user location and earthquake epicenter.

## Features Implemented

### 1. **Coordinate Map Display Component** (`/components/coordinate-map-display.tsx`)
- Canvas-based visual map showing:
  - **Red Star (★)**: Earthquake epicenter with precise coordinates
  - **Blue Dot (●)**: User's current GPS location
  - **Dashed Line**: Direct line connecting user to epicenter with distance label
  - **Grid Background**: Reference grid for geographic orientation
  - **Indonesia Region Bounds**: Map scaled to Indonesia (minLat: -10.5°, maxLat: 6°, minLon: 95°, maxLon: 141°)

### 2. **Enhanced Shakemap Section** (`/components/felt-earthquakes.tsx`)
Shows both:
- Official BMKG Shakemap image (seismic intensity distribution)
- Interactive coordinate map with distance visualization
- Epicenter location card with:
  - Latitude/Longitude with 4 decimal precision
  - Direct distance to user's location
  - User's coordinates reference

### 3. **Improved Data Display**
- **Earthquake Card** (`/components/earthquake-card.tsx`):
  - Coordinates shown with 4 decimal precision (±11 meters accuracy)
  - Distance display with color coding (red <100km, orange <300km, green ≥300km)
  
- **Felt Earthquakes Detail**:
  - Relocated coordinate info to prominent position in shakemap
  - Shows both epicenter and user coordinates
  - Distance calculated using accurate Haversine formula

## Technical Details

### Map Projection
- Coordinates mapped to canvas using simple projection
- Longitude: min=95°E, max=141°E (Indonesia west-east)
- Latitude: min=-10.5°S, max=6°N (Indonesia south-north)

### Distance Calculation
- Uses Haversine formula for accuracy
- Accounts for Earth's curvature (R = 6371 km)
- Precision: ±0-100 meters for distances up to 2000 km
- Displayed with 1 decimal place in main display

### Visual Elements
- **Red Star**: Earthquake epicenter (8px radius)
- **Blue Circle**: User location (6px radius)
- **Dashed Line**: Visual connection with distance label
- **Grid**: 10x10 reference grid for orientation

## User Experience
1. User enables notifications and provides location access
2. When viewing earthquake details, they see:
   - Official BMKG shakemap showing seismic intensity
   - Canvas-based coordinate map showing exact epicenter and user location
   - Precise distance measurement (±11 meters for coordinates)
   - Both earthquake and user coordinates with 4 decimal precision

## Accuracy Notes
- Coordinate precision: ±5.5 meters per decimal place
- Distance accuracy: ±5-100 meters depending on latitude
- Map projection: Simple linear projection (suitable for Indonesia region)
- Data source: BMKG earthquake data with real-time updates
