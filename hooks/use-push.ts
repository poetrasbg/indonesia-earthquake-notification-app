'use client';

import { useCallback, useEffect } from "react";
import {
  requestNotificationPermission,
  sendEarthquakeAlert,
  sendClusterVerificationAlert,
  getNotificationStatus,
  setupNotificationHandlers,
  playNotificationSound,
} from "@/lib/push-utils";
import { BMKGEarthquake } from "@/types/earthquake";
import { EarthquakeCluster } from "@/lib/clustering-service";

/**
 * Hook for managing web push notifications
 */
export function usePushNotifications() {
  // Setup notification handlers on mount
  useEffect(() => {
    setupNotificationHandlers();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    try {
      const granted = await requestNotificationPermission();
      console.log("[v0] Notification permission result:", granted);
      return granted;
    } catch (error) {
      console.error("[v0] Error requesting notification permission:", error);
      return false;
    }
  }, []);

  // Send earthquake alert
  const sendEarthquakeNotification = useCallback(
    (earthquake: BMKGEarthquake, distance?: number, intensity?: number) => {
      try {
        playNotificationSound();
        sendEarthquakeAlert(
          earthquake.magnitude,
          earthquake.region,
          distance,
          intensity
        );
        console.log("[v0] Earthquake notification sent");
      } catch (error) {
        console.error("[v0] Error sending earthquake notification:", error);
      }
    },
    []
  );

  // Send cluster verification alert
  const sendClusterAlert = useCallback(
    (cluster: EarthquakeCluster) => {
      try {
        playNotificationSound();
        sendClusterVerificationAlert(
          cluster.reportCount,
          cluster.latitude,
          cluster.longitude,
          cluster.averageIntensity
        );
        console.log("[v0] Cluster verification notification sent");
      } catch (error) {
        console.error("[v0] Error sending cluster notification:", error);
      }
    },
    []
  );

  // Get current notification status
  const getStatus = useCallback(() => {
    return getNotificationStatus();
  }, []);

  return {
    requestPermission,
    sendEarthquakeNotification,
    sendClusterAlert,
    getStatus,
  };
}
