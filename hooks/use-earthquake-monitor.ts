"use client";

import { useEffect, useState, useCallback } from "react";
import { BMKGEarthquake, NotificationSetting } from "@/types/earthquake";
import { fetchLatestEarthquakes } from "@/lib/bmkg-api";
import { notificationService } from "@/lib/notification-service";

interface UseEarthquakeMonitorReturn {
  earthquakes: BMKGEarthquake[];
  loading: boolean;
  error: string | null;
  lastUpdate: Date | null;
  checkForNotifications: (
    userLocation: { latitude: number; longitude: number },
    settings: NotificationSetting[]
  ) => void;
}

export function useEarthquakeMonitor(
  autoRefresh: boolean = true,
  refreshInterval: number = 30000
): UseEarthquakeMonitorReturn {
  const [earthquakes, setEarthquakes] = useState<BMKGEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchEarthquakes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLatestEarthquakes();
      setEarthquakes(data);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data gempa");
      console.error("[v0] Error fetching earthquakes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkForNotifications = useCallback(
    (
      userLocation: { latitude: number; longitude: number },
      settings: NotificationSetting[]
    ) => {
      if (earthquakes.length === 0 || settings.length === 0) return;

      earthquakes.forEach((earthquake) => {
        settings.forEach((setting) => {
          if (!setting.notification_enabled && !setting.sound_enabled) return;

          // Hitung jarak dari user ke epicenter gempa
          const distance = notificationService.calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            earthquake.latitude,
            earthquake.longitude
          );

          // Hitung estimasi intensitas
          let intensity = Math.ceil(earthquake.magnitude - 1);
          if (earthquake.depth < 30) intensity += 1;
          if (earthquake.depth > 100) intensity -= 1;
          intensity = Math.max(1, Math.min(9, intensity));

          // Cek apakah notifikasi harus ditampilkan
          if (
            distance <= setting.radius_km &&
            intensity >= setting.min_intensity_level
          ) {
            console.log(
              "[v0] Earthquake notification triggered:",
              earthquake.region,
              intensity,
              distance,
              "km"
            );

            // Tampilkan popup notifikasi
            if (setting.notification_enabled) {
              notificationService.showEarthquakeNotification(
                `Gempa ${earthquake.magnitude} SR di ${earthquake.region}`,
                `Jarak dari lokasi Anda: ${Math.round(distance)} km\nIntensitas: Level ${intensity}`
              );
            }

            // Putar suara alarm
            if (setting.sound_enabled) {
              notificationService.playAlarmSound(5000);
            }
          }
        });
      });
    },
    [earthquakes]
  );

  useEffect(() => {
    // Initial fetch
    fetchEarthquakes();

    if (autoRefresh) {
      const interval = setInterval(fetchEarthquakes, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchEarthquakes]);

  return {
    earthquakes,
    loading,
    error,
    lastUpdate,
    checkForNotifications,
  };
}
