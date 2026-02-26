"use client";

import { useEffect, useRef } from "react";
import { BMKGEarthquake } from "@/types/earthquake";
import { calculateDistanceKmRounded } from "@/lib/distance-utils";

interface CoordinateMapDisplayProps {
  earthquake: BMKGEarthquake;
  userLocation?: { latitude: number; longitude: number };
}

export function CoordinateMapDisplay({
  earthquake,
  userLocation,
}: CoordinateMapDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const mapWidth = width - 2 * padding;
    const mapHeight = height - 2 * padding;

    // Clear canvas with light background
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, width, height);

    // Draw border
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 2;
    ctx.strokeRect(padding, padding, mapWidth, mapHeight);

    // Draw grid
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (mapWidth / 10) * i;
      const y = padding + (mapHeight / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Define map bounds (Indonesia region)
    const minLat = -10.5;
    const maxLat = 6;
    const minLon = 95;
    const maxLon = 141;

    // Convert latitude/longitude to canvas coordinates
    const latToY = (lat: number) => {
      const normalized = (maxLat - lat) / (maxLat - minLat);
      return padding + normalized * mapHeight;
    };

    const lonToX = (lon: number) => {
      const normalized = (lon - minLon) / (maxLon - minLon);
      return padding + normalized * mapWidth;
    };

    // Draw earthquake epicenter
    const epicenterX = lonToX(earthquake.longitude);
    const epicenterY = latToY(earthquake.latitude);

    // Draw epicenter marker
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(epicenterX, epicenterY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Draw epicenter star
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", epicenterX, epicenterY);

    // Draw user location if available
    if (userLocation) {
      const userX = lonToX(userLocation.longitude);
      const userY = latToY(userLocation.latitude);

      // Draw user marker
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(userX, userY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw user dot
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("●", userX, userY);

      // Draw line between user and epicenter
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(userX, userY);
      ctx.lineTo(epicenterX, epicenterY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw distance label on the line
      const midX = (userX + epicenterX) / 2;
      const midY = (userY + epicenterY) / 2;
      const distance = calculateDistanceKmRounded(
        userLocation.latitude,
        userLocation.longitude,
        earthquake.latitude,
        earthquake.longitude,
        0
      );

      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 11px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillRect(midX - 25, midY - 12, 50, 16);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`${distance}km`, midX, midY - 2);
    }

    // Draw title and coordinates
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Lokasi Gempa", padding + 5, 10);

    ctx.font = "11px Arial";
    ctx.fillStyle = "#4b5563";
    ctx.fillText(
      `Episenter: ${earthquake.latitude.toFixed(4)}°, ${earthquake.longitude.toFixed(4)}°`,
      padding + 5,
      30
    );

    if (userLocation) {
      ctx.fillText(
        `Anda: ${userLocation.latitude.toFixed(4)}°, ${userLocation.longitude.toFixed(4)}°`,
        padding + 5,
        50
      );
    }

    // Draw legend
    const legendY = height - 20;
    ctx.fillStyle = "#dc2626";
    ctx.beginPath();
    ctx.arc(padding + 10, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4b5563";
    ctx.font = "11px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Episenter Gempa", padding + 20, legendY);

    if (userLocation) {
      ctx.fillStyle = "#2563eb";
      ctx.beginPath();
      ctx.arc(padding + 120, legendY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4b5563";
      ctx.fillText("Lokasi Anda", padding + 130, legendY);
    }
  }, [earthquake, userLocation]);

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="w-full border border-border rounded-lg bg-white"
      />
      <p className="text-xs text-muted-foreground text-center">
        Peta Lokasi Episenter dan Posisi Anda (Indonesia Region)
      </p>
    </div>
  );
}
