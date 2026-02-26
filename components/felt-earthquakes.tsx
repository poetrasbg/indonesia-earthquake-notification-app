"use client";

import { useEffect, useState } from "react";
import { fetchFeltEarthquakes } from "@/lib/bmkg-api";
import { BMKGEarthquake } from "@/types/earthquake";
import { calculateDistanceKmRounded } from "@/lib/distance-utils";
import { GoogleMapDisplay } from "@/components/google-map-display";
import { Clock, AlertTriangle } from "lucide-react";

interface FeltEarthquakesProps {
  limit?: number;
  userLocation?: { latitude: number; longitude: number };
}

// Get color based on magnitude
function getMagnitudeColor(magnitude: number): string {
  if (magnitude < 3) return "bg-green-500";
  if (magnitude < 5) return "bg-yellow-500";
  if (magnitude < 6) return "bg-orange-500";
  if (magnitude < 7) return "bg-red-500";
  return "bg-red-700";
}

// Get magnitude badge color
function getMagnitudeBadgeColor(magnitude: number): string {
  if (magnitude < 3) return "bg-green-100 text-green-800";
  if (magnitude < 5) return "bg-yellow-100 text-yellow-800";
  if (magnitude < 6) return "bg-orange-100 text-orange-800";
  if (magnitude < 7) return "bg-red-100 text-red-800";
  return "bg-red-200 text-red-900";
}

export function FeltEarthquakes({
  limit = 15,
  userLocation,
}: FeltEarthquakesProps) {
  const [earthquakes, setEarthquakes] = useState<BMKGEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const loadEarthquakes = async () => {
      setLoading(true);
      try {
        const data = await fetchFeltEarthquakes(limit);
        console.log("[v0] Felt earthquakes loaded:", data.length, "items");
        setEarthquakes(data);
      } catch (error) {
        console.error("[v0] Error loading felt earthquakes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEarthquakes();
  }, [limit]);

  if (loading) {
    return (
      <div className="w-full bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <h3 className="text-lg md:text-xl font-bold text-foreground">
          Daftar 15 Gempabumi Dirasakan
        </h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (earthquakes.length === 0) {
    return (
      <div className="w-full bg-card border border-border rounded-lg p-4 md:p-6 text-center">
        <p className="text-muted-foreground">
          Tidak ada data gempa dirasakan dari BMKG saat ini
        </p>
      </div>
    );
  }

  const selectedEarthquake = earthquakes[selectedIndex];

  return (
    <div className="w-full space-y-4">
      {/* Main Card - Responsive Grid */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            Daftar 15 Gempabumi Dirasakan
          </h3>
        </div>

        {/* Selected Earthquake Detail with Shakemap - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Shakemap Image + Location Info - Full width on mobile, 2/3 on desktop */}
          <div className="md:col-span-2 space-y-3">
            {/* OpenStreetMap Display */}
            <GoogleMapDisplay
              earthquake={selectedEarthquake}
              userLocation={userLocation}
            />
          </div>

          {/* Details - 1/3 on desktop, full width on mobile */}
          <div className="space-y-3">
            {/* Magnitude Box */}
            <div className={`${getMagnitudeBadgeColor(selectedEarthquake.magnitude)} rounded-lg p-4 text-center`}>
              <p className="text-xs font-medium opacity-75 mb-1">MAGNITUDE</p>
              <p className="text-3xl md:text-4xl font-bold">
                {selectedEarthquake.magnitude.toFixed(1)}
              </p>
              <p className="text-xs font-medium mt-1">Skala Richter</p>
            </div>

            {/* Region */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">LOKASI</p>
              <p className="text-sm md:text-base font-semibold text-foreground line-clamp-2">
                {selectedEarthquake.region}
              </p>
            </div>

            {/* Depth */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">KEDALAMAN</p>
              <p className="text-lg font-bold text-foreground">
                {selectedEarthquake.depth} km
              </p>
            </div>

            {/* Waktu */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                WAKTU
              </p>
              <p className="text-xs font-mono text-foreground">
                {new Date(selectedEarthquake.datetime).toLocaleString("id-ID")}
              </p>
            </div>


          </div>
        </div>
      </div>

      {/* Earthquake List - Responsive Scrollable */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground px-1">
          Pilih Gempa Lainnya ({earthquakes.length} data)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 auto-rows-max">
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

            let timeText = "";
            if (diffMins < 1) timeText = "Baru saja";
            else if (diffMins < 60) timeText = `${diffMins}m`;
            else timeText = `${diffHours}h`;

            return (
              <button
                key={earthquake.id}
                onClick={() => setSelectedIndex(index)}
                className={`text-left p-3 rounded-lg border-2 transition-all ${
                  selectedIndex === index
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`${getMagnitudeColor(earthquake.magnitude)} text-white rounded w-10 h-10 md:w-12 md:h-12 flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 mt-0.5`}
                  >
                    {earthquake.magnitude.toFixed(1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-semibold text-foreground truncate">
                      {earthquake.region}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {timeText}
                    </p>
                    {distance !== null && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {distance.toFixed(0)} km
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-muted-foreground text-center py-2">
        <p>Data dari BMKG • Shakemap dapat tidak tersedia untuk beberapa gempa</p>
      </div>
    </div>
  );
}
