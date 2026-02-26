"use client";

import { useEffect, useState } from "react";

interface Location {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  location: Location | null;
  loading: boolean;
  error: string | null;
  requestLocation: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak mendukung Geolocation");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
        console.log("[v0] Location obtained:", position.coords);
      },
      (error) => {
        let errorMessage = "Gagal mendapatkan lokasi";

        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Izin geolocation ditolak";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Informasi lokasi tidak tersedia";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Timeout mendapatkan lokasi";
        }

        setError(errorMessage);
        setLoading(false);
        console.error("[v0] Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { location, loading, error, requestLocation };
}
