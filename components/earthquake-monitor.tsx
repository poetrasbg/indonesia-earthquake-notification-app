"use client";

import { useEffect, useRef } from "react";
import { useEarthquakeMonitor } from "@/hooks/use-earthquake-monitor";
import { NotificationSetting } from "@/types/earthquake";
import { Bell, AlertCircle } from "lucide-react";

interface EarthquakeMonitorProps {
  userLocation?: { latitude: number; longitude: number };
  notificationSettings?: NotificationSetting[];
  onEarthquakeDetected?: (message: string) => void;
}

/**
 * Komponen untuk real-time monitoring gempa dengan notifikasi dan suara
 * - Otomatis mengecek gempa terbaru setiap 30 detik
 * - Memicu notifikasi popup dan suara alarm jika memenuhi kriteria
 * - Mensinkronkan dengan pengaturan notifikasi pengguna
 */
export function EarthquakeMonitor({
  userLocation,
  notificationSettings = [],
  onEarthquakeDetected,
}: EarthquakeMonitorProps) {
  const { earthquakes, checkForNotifications } = useEarthquakeMonitor(
    true,
    30000 // Check setiap 30 detik
  );
  const lastCheckedRef = useRef<number>(0);

  // Cek notifikasi setiap kali ada update gempa
  useEffect(() => {
    if (!userLocation || notificationSettings.length === 0) {
      return;
    }

    // Debounce untuk mencegah notifikasi duplikat
    const now = Date.now();
    if (now - lastCheckedRef.current < 5000) {
      return;
    }

    lastCheckedRef.current = now;

    try {
      checkForNotifications(userLocation, notificationSettings);

      if (earthquakes.length > 0 && onEarthquakeDetected) {
        onEarthquakeDetected(
          `Gempa ${earthquakes[0].magnitude} SR terbaru di ${earthquakes[0].region}`
        );
      }
    } catch (error) {
      console.error("[v0] Error in earthquake monitor:", error);
    }
  }, [earthquakes, userLocation, notificationSettings, checkForNotifications, onEarthquakeDetected]);

  return (
    <div className="hidden">
      {/* Component ini bekerja di background untuk real-time monitoring */}
      {/* Tidak perlu render UI, hanya menjalankan side effects */}
    </div>
  );
}

/**
 * Alternative: Hook-only version tanpa component wrapper
 * Gunakan ini jika ingin lebih control atas monitoring logic
 */
export function useEarthquakeNotificationMonitor(
  userLocation?: { latitude: number; longitude: number },
  notificationSettings?: NotificationSetting[]
) {
  const { earthquakes, checkForNotifications } = useEarthquakeMonitor(
    true,
    30000
  );
  const lastCheckedRef = useRef<number>(0);

  useEffect(() => {
    if (!userLocation || !notificationSettings || notificationSettings.length === 0) {
      return;
    }

    // Debounce untuk mencegah notifikasi duplikat
    const now = Date.now();
    if (now - lastCheckedRef.current < 5000) {
      return;
    }

    lastCheckedRef.current = now;

    try {
      checkForNotifications(userLocation, notificationSettings);
    } catch (error) {
      console.error("[v0] Error in notification monitor:", error);
    }
  }, [earthquakes, userLocation, notificationSettings, checkForNotifications]);

  return { earthquakes };
}
