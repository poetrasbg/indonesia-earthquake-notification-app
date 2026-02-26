"use client";

import { BMKGEarthquake, INTENSITY_LEVELS } from "@/types/earthquake";
import { calculateDistanceKmRounded } from "@/lib/distance-utils";
import { MapPin, Calendar, Gauge, ArrowDown } from "lucide-react";

export function EarthquakeCard({
  earthquake,
  userLocation,
}: {
  earthquake: BMKGEarthquake;
  userLocation?: { latitude: number; longitude: number };
}) {
  // Perkiraan intensitas berdasarkan magnitude dan kedalaman
  const estimateIntensity = (): number => {
    // Formula sederhana untuk estimasi intensitas
    let intensity = Math.ceil(earthquake.magnitude - 1);
    if (earthquake.depth < 30) intensity += 1;
    if (earthquake.depth > 100) intensity -= 1;
    return Math.max(1, Math.min(9, intensity));
  };

  const intensity = estimateIntensity();
  const intensityInfo = INTENSITY_LEVELS[intensity - 1];

  // Hitung jarak dari lokasi pengguna ke epicenter gempa dengan akurasi Haversine
  const distance = userLocation
    ? calculateDistanceKmRounded(
        userLocation.latitude,
        userLocation.longitude,
        earthquake.latitude,
        earthquake.longitude,
        0
      )
    : null;

  // Format waktu
  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Jakarta",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 md:p-4 space-y-3 hover:shadow-md transition-shadow">
      {/* Header dengan magnitude dan intensitas */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1 md:gap-2 mb-1">
            <span className="text-xl md:text-2xl font-bold text-primary">
              {earthquake.magnitude}
            </span>
            <span className="text-xs md:text-sm text-muted-foreground">Magnitudo</span>
          </div>
          <p className="text-xs md:text-sm font-medium text-foreground/80 truncate">
            {earthquake.region}
          </p>
        </div>

        {/* Badge intensitas */}
        <div className={`${intensityInfo.color} text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-center flex-shrink-0`}>
          <div className="text-xs font-bold">
            <div>{intensity}</div>
            <div className="text-[10px]">MMI</div>
          </div>
        </div>
      </div>

      {/* Detail teknis */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs md:text-sm">
        {/* Kedalaman */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ArrowDown className="w-4 h-4 flex-shrink-0" />
          <span>{earthquake.depth} km</span>
        </div>

        {/* Koordinat dengan presisi tinggi */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-start gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-mono">{earthquake.latitude.toFixed(4)}°</div>
              <div className="font-mono">{earthquake.longitude.toFixed(4)}°</div>
            </div>
          </div>
        </div>

        {/* Waktu */}
        <div className="col-span-2 md:col-span-3 flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs truncate">{formatTime(earthquake.datetime)}</span>
        </div>
      </div>

      {/* Jarak dari pengguna (jika tersedia) */}
      {distance !== null && (
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs md:text-sm font-medium text-foreground/70">
              Jarak dari Anda:
            </span>
            <span className={`font-bold text-sm md:text-base ${distance < 100 ? "text-destructive" : distance < 300 ? "text-orange-600" : "text-green-600"}`}>
              {distance} km
            </span>
          </div>
        </div>
      )}

      {/* Estimasi Intensitas */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Estimasi Intensitas
        </p>
        <p className="text-xs md:text-sm font-semibold text-foreground">
          {intensityInfo.name} (Level {intensity})
        </p>
        <p className="text-xs text-muted-foreground">
          Berdasarkan magnitude dan kedalaman
        </p>
      </div>
    </div>
  );
}
