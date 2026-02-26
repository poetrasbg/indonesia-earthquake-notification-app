"use client";

import { useEffect, useState } from "react";
import { fetchEarthquakeHistory } from "@/lib/bmkg-api";
import { BMKGEarthquake } from "@/types/earthquake";
import { calculateDistanceKmRounded } from "@/lib/distance-utils";
import { Clock, Locate, BarChart3 } from "lucide-react";

interface EarthquakeHistoryProps {
  limit?: number;
  userLocation?: { latitude: number; longitude: number };
}

// Helper to get magnitude color
function getMagnitudeColor(magnitude: number): string {
  if (magnitude < 3) return "bg-green-100 text-green-800";
  if (magnitude < 5) return "bg-yellow-100 text-yellow-800";
  if (magnitude < 6) return "bg-orange-100 text-orange-800";
  if (magnitude < 7) return "bg-red-100 text-red-800";
  return "bg-red-200 text-red-900";
}

export function EarthquakeHistory({
  limit = 5,
  userLocation,
}: EarthquakeHistoryProps) {
  const [earthquakes, setEarthquakes] = useState<BMKGEarthquake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const data = await fetchEarthquakeHistory(limit);
        console.log("[v0] Earthquake history loaded:", data.length, "items");
        setEarthquakes(data);
      } catch (error) {
        console.error("[v0] Error loading earthquake history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          5 Gempa Terakhir
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-muted/50 rounded-md animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (earthquakes.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">
          Tidak ada data gempa dari BMKG saat ini
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5" />
          5 Gempa Terakhir
        </h3>
        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
          {earthquakes.length} gempa
        </span>
      </div>

      <div className="space-y-3">
        {earthquakes.map((earthquake, index) => {
          const distance = userLocation
            ? calculateDistanceKmRounded(
                userLocation.latitude,
                userLocation.longitude,
                earthquake.latitude,
                earthquake.longitude,
                0
              )
            : null;

          const timeAgo = new Date(earthquake.datetime);
          const now = new Date();
          const diffMs = now.getTime() - timeAgo.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          let timeText = "";
          if (diffMins < 1) timeText = "Baru saja";
          else if (diffMins < 60) timeText = `${diffMins} menit lalu`;
          else if (diffHours < 24) timeText = `${diffHours} jam lalu`;
          else timeText = `${diffDays} hari lalu`;

          return (
            <div
              key={earthquake.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Magnitude and location */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-12 h-12 rounded-lg ${getMagnitudeColor(earthquake.magnitude)} flex items-center justify-center font-bold text-lg`}
                    >
                      {earthquake.magnitude.toFixed(1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {earthquake.region}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {timeText}
                      </p>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 text-xs">
                    {/* Depth */}
                    <div className="bg-muted/30 rounded p-2">
                      <p className="text-muted-foreground text-xs">Kedalaman</p>
                      <p className="font-semibold text-foreground">
                        {earthquake.depth} km
                      </p>
                    </div>

                    {/* Coordinates */}
                    <div className="bg-muted/30 rounded p-2">
                      <p className="text-muted-foreground text-xs">Lokasi</p>
                      <p className="font-mono text-xs text-foreground">
                        {earthquake.latitude.toFixed(2)}°, {earthquake.longitude.toFixed(2)}°
                      </p>
                    </div>

                    {/* Distance from user */}
                    {distance !== null && (
                      <div className="bg-muted/30 rounded p-2 col-span-2 md:col-span-1">
                        <p className="text-muted-foreground text-xs flex items-center gap-1">
                          <Locate className="w-3 h-3" />
                          Jarak dari Anda
                        </p>
                        <p className="font-semibold text-foreground">
                          {distance < 1000
                            ? `${distance.toFixed(0)} km`
                            : `${(distance / 1000).toFixed(1)}k km`}
                        </p>
                      </div>
                    )}

                    {/* Time */}
                    <div className="bg-muted/30 rounded p-2">
                      <p className="text-muted-foreground text-xs">Waktu</p>
                      <p className="font-mono text-xs text-foreground">
                        {timeAgo.toLocaleTimeString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                      <BarChart3 className="w-3 h-3" />
                      {earthquake.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t border-border">
        <p>Data gempa terbaru dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)</p>
      </div>
    </div>
  );
}
