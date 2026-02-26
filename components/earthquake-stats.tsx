"use client";

import { BMKGEarthquake } from "@/types/earthquake";
import { calculateDistanceKmRounded } from "@/lib/distance-utils";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  MapPin,
} from "lucide-react";

interface EarthquakeStatsProps {
  earthquakes: BMKGEarthquake[];
  userLocation?: { latitude: number; longitude: number };
}

/**
 * Komponen untuk menampilkan statistik dan analisis gempa
 */
export function EarthquakeStats({
  earthquakes,
  userLocation,
}: EarthquakeStatsProps) {
  if (earthquakes.length === 0) {
    return null;
  }

  // Hitung statistik
  const avgMagnitude =
    earthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / earthquakes.length;

  const maxMagnitude = Math.max(...earthquakes.map((eq) => eq.magnitude));

  const avgDepth =
    earthquakes.reduce((sum, eq) => sum + eq.depth, 0) / earthquakes.length;

  const shallowCount = earthquakes.filter((eq) => eq.depth < 30).length;

  const deepCount = earthquakes.filter((eq) => eq.depth > 100).length;

  // Cari gempa terdekat dengan user menggunakan Haversine formula
  let closestEarthquake: BMKGEarthquake | null = null;
  let closestDistance: number | null = null;

  if (userLocation) {
    let minDistance = Infinity;

    earthquakes.forEach((eq) => {
      const distance = calculateDistanceKmRounded(
        userLocation.latitude,
        userLocation.longitude,
        eq.latitude,
        eq.longitude,
        1
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestEarthquake = eq;
        closestDistance = distance;
      }
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Total gempa */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-medium">Total Gempa</span>
        </div>
        <div className="text-3xl font-bold text-foreground">
          {earthquakes.length}
        </div>
        <p className="text-xs text-muted-foreground">
          Data terbaru dari BMKG
        </p>
      </div>

      {/* Average magnitude */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Rata-rata Magnitude</span>
        </div>
        <div className="text-3xl font-bold text-foreground">
          {avgMagnitude.toFixed(1)}
        </div>
        <p className="text-xs text-muted-foreground">
          Max: {maxMagnitude.toFixed(1)} SR
        </p>
      </div>

      {/* Depth info */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-xs font-medium">Kedalaman Rata-rata</span>
        </div>
        <div className="text-3xl font-bold text-foreground">
          {avgDepth.toFixed(0)} km
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Dangkal (&lt;30km): {shallowCount}</p>
          <p>Dalam (&gt;100km): {deepCount}</p>
        </div>
      </div>

      {/* Closest earthquake */}
      {closestEarthquake && userLocation && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Gempa Terdekat</span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {closestEarthquake.region}
            </p>
            <p className="text-xs text-muted-foreground">
              {closestDistance} km dari lokasi Anda
            </p>
            <p className="text-xs text-muted-foreground">
              Magnitude {closestEarthquake.magnitude}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
