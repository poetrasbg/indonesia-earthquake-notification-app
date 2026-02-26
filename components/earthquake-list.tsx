"use client";

import { useEffect, useState } from "react";
import { fetchLatestEarthquakes } from "@/lib/bmkg-api";
import { BMKGEarthquake } from "@/types/earthquake";
import { EarthquakeCard } from "./earthquake-card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface EarthquakeListProps {
  userLocation?: { latitude: number; longitude: number };
  maxItems?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function EarthquakeList({
  userLocation,
  maxItems = 10,
  autoRefresh = true,
  refreshInterval = 30000, // 30 detik
}: EarthquakeListProps) {
  const [earthquakes, setEarthquakes] = useState<BMKGEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadEarthquakes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLatestEarthquakes();
      setEarthquakes(data.slice(0, maxItems));
      setLastUpdate(new Date());
      console.log("[v0] Earthquakes loaded:", data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data gempa");
      console.error("[v0] Error loading earthquakes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarthquakes();

    if (autoRefresh) {
      const interval = setInterval(loadEarthquakes, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [maxItems, autoRefresh, refreshInterval]);

  if (loading && earthquakes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Memuat data gempa terbaru dari BMKG...
          </p>
        </div>
      </div>
    );
  }

  if (error && earthquakes.length === 0) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Error</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Update info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {earthquakes.length} gempa terbaru
          {lastUpdate && ` (Update: ${lastUpdate.toLocaleTimeString("id-ID")})`}
        </span>
        <button
          onClick={loadEarthquakes}
          disabled={loading}
          className="hover:text-foreground transition-colors disabled:opacity-50"
          aria-label="Refresh earthquakes"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Earthquake cards */}
      <div className="space-y-3">
        {earthquakes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Tidak ada data gempa terbaru</p>
          </div>
        ) : (
          earthquakes.map((earthquake) => (
            <EarthquakeCard
              key={earthquake.id}
              earthquake={earthquake}
              userLocation={userLocation}
            />
          ))
        )}
      </div>

      {/* Loading state while refreshing */}
      {loading && earthquakes.length > 0 && (
        <div className="text-xs text-muted-foreground text-center py-2">
          <span>Memperbarui data...</span>
        </div>
      )}
    </div>
  );
}
