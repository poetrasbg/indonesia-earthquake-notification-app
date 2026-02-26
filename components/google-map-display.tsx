'use client';

import { useEffect, useRef, useState } from 'react';
import { BMKGEarthquake } from '@/types/earthquake';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OpenMapsDisplayProps {
  earthquake: BMKGEarthquake;
  userLocation?: { latitude: number; longitude: number };
}

export function GoogleMapDisplay({
  earthquake,
  userLocation,
}: OpenMapsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(6);
  const [loading, setLoading] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  // Web Mercator projection helper functions
  const lngLatToWebMercator = (lng: number, lat: number, zoom: number, canvasWidth: number, canvasHeight: number) => {
    const n = Math.pow(2, zoom);
    
    // Convert to tile coordinates
    const xtile = (lng + 180) / 360 * n;
    const ytile = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n;
    
    // Get center tile coordinates
    const centerXtile = (earthquake.longitude + 180) / 360 * n;
    const centerYtile = (1 - Math.log(Math.tan(earthquake.latitude * Math.PI / 180) + 1 / Math.cos(earthquake.latitude * Math.PI / 180)) / Math.PI) / 2 * n;
    
    // Calculate pixel position relative to center
    const pixelX = Math.round((xtile - centerXtile) * 256 + canvasWidth / 2);
    const pixelY = Math.round((ytile - centerYtile) * 256 + canvasHeight / 2);
    
    return { x: pixelX, y: pixelY };
  };

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: Math.max(800, rect.width), height: 500 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Draw the map with earthquake and user location markers
  const drawMap = (zoomLevel: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setLoading(true);

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Fill with gray background
    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const n = Math.pow(2, zoomLevel);
    const centerXtile = (earthquake.longitude + 180) / 360 * n;
    const centerYtile = (1 - Math.log(Math.tan((earthquake.latitude * Math.PI) / 180) + 1 / Math.cos((earthquake.latitude * Math.PI) / 180)) / Math.PI) / 2 * n;

    const centerTileX = Math.floor(centerXtile);
    const centerTileY = Math.floor(centerYtile);

    // Calculate position of center tile's top-left corner relative to canvas center
    const centerOffsetX = (centerXtile - centerTileX) * 256;
    const centerOffsetY = (centerYtile - centerTileY) * 256;

    const startX = centerTileX - 1;
    const startY = centerTileY - 1;
    const tilesNeeded = 3;

    let tilesLoaded = 0;
    let totalTiles = tilesNeeded * tilesNeeded;

    // Load 3x3 grid of tiles
    for (let i = 0; i < tilesNeeded; i++) {
      for (let j = 0; j < tilesNeeded; j++) {
        const tileX = startX + i;
        const tileY = startY + j;

        const tileUrl = `https://tile.openstreetmap.org/${zoomLevel}/${tileX}/${tileY}.png`;
        const img = new Image();
        img.crossOrigin = 'anonymous';

        const drawPositionX = canvasSize.width / 2 + (i - 1) * 256 - centerOffsetX;
        const drawPositionY = canvasSize.height / 2 + (j - 1) * 256 - centerOffsetY;

        img.onload = () => {
          ctx.drawImage(img, drawPositionX, drawPositionY);
          tilesLoaded++;

          if (tilesLoaded === totalTiles) {
            drawMarkers(ctx);
          }
        };

        img.onerror = () => {
          tilesLoaded++;
          if (tilesLoaded === totalTiles) {
            drawMarkers(ctx);
          }
        };

        img.src = tileUrl;
      }
    }

    // Draw markers and overlays
    const drawMarkers = (ctx: CanvasRenderingContext2D) => {
      // Earthquake marker position (always center)
      const eqX = canvasSize.width / 2;
      const eqY = canvasSize.height / 2;

      // User marker position using Web Mercator projection
      let userX = eqX;
      let userY = eqY;

      if (userLocation) {
        const userPos = lngLatToWebMercator(
          userLocation.longitude,
          userLocation.latitude,
          zoomLevel,
          canvasSize.width,
          canvasSize.height
        );
        userX = userPos.x;
        userY = userPos.y;
      }

      // Draw dashed line between points
      if (userLocation) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(eqX, eqY);
        ctx.lineTo(userX, userY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw earthquake marker (red)
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.beginPath();
      ctx.arc(eqX, eqY, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw earthquake label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('E', eqX, eqY);

      // Draw user marker (blue) if location available
      if (userLocation) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
        ctx.beginPath();
        ctx.arc(userX, userY, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw user label
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('U', userX, userY);
      }

      // Draw magnitude badge
      const magnitude = earthquake.magnitude.toFixed(1);
      const badgeX = canvasSize.width - 60;
      const badgeY = 25;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(badgeX - 15, badgeY - 10, 60, 22);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${magnitude} SR`, badgeX + 15, badgeY);

      // Draw attribution
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(5, canvasSize.height - 20, 120, 18);
      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('© OpenStreetMap', 8, canvasSize.height - 11);

      setLoading(false);
    };
  };

  useEffect(() => {
    drawMap(zoom);
  }, [zoom, earthquake.latitude, earthquake.longitude, userLocation, canvasSize]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 2));
  };

  return (
    <div ref={containerRef} className="w-full space-y-2">
      {/* Interactive OpenStreetMap Canvas */}
      <div className="relative bg-muted/30 rounded-lg overflow-hidden border border-border w-full">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="w-full h-auto block bg-muted/50"
        />

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-white text-sm font-medium">Loading map...</div>
          </div>
        )}

        {/* Zoom controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomIn}
            className="w-10 h-10 p-0"
            disabled={zoom >= 18}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomOut}
            className="w-10 h-10 p-0"
            disabled={zoom <= 2}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom level indicator */}
        <div className="absolute top-3 left-3 bg-black/50 text-white rounded px-2 py-1 text-xs font-medium">
          Zoom: {zoom}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground px-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Episenter Gempa (E)</span>
        </div>
        {userLocation && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Lokasi Anda (U)</span>
          </div>
        )}
      </div>
    </div>
  );
}
