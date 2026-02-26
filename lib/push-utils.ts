/**
 * Web Push Notification Utilities
 * Handles browser push notifications for earthquake alerts
 */

export interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

/**
 * Check if browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

/**
 * Check if browser supports service workers (for background push)
 */
export function isServiceWorkerSupported(): boolean {
  return "serviceWorker" in navigator;
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    console.warn("[v0] Notifications not supported");
    return false;
  }

  if (Notification.permission === "granted") {
    console.log("[v0] Notification permission already granted");
    return true;
  }

  if (Notification.permission === "denied") {
    console.warn("[v0] Notification permission denied by user");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log("[v0] Notification permission requested, result:", permission);
    return permission === "granted";
  } catch (error) {
    console.error("[v0] Error requesting notification permission:", error);
    return false;
  }
}

/**
 * Send web push notification
 */
export function sendPushNotification(options: PushNotificationOptions): Notification | null {
  if (!isNotificationSupported()) {
    console.warn("[v0] Notifications not supported");
    return null;
  }

  if (Notification.permission !== "granted") {
    console.warn("[v0] Notification permission not granted");
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || "/earthquake-icon.jpg",
      badge: options.badge,
      tag: options.tag || "earthquake-alert",
      requireInteraction: options.requireInteraction !== false,
      actions: options.actions || [],
    });

    console.log("[v0] Push notification sent:", options.title);

    // Auto-close notification after 10 seconds if requireInteraction is false
    if (!options.requireInteraction) {
      setTimeout(() => {
        notification.close();
      }, 10000);
    }

    return notification;
  } catch (error) {
    console.error("[v0] Error sending push notification:", error);
    return null;
  }
}

/**
 * Send earthquake alert notification
 */
export function sendEarthquakeAlert(
  magnitude: number,
  region: string,
  distance?: number,
  intensity?: number
): Notification | null {
  const intensityText = intensity
    ? ` - Intensitas: Level ${intensity}`
    : "";
  const distanceText = distance
    ? ` (${distance} km dari Anda)`
    : "";

  const title = `⚠️ PERINGATAN GEMPA BUMI`;
  const body = `Magnitude ${magnitude} di ${region}${distanceText}${intensityText}`;

  return sendPushNotification({
    title,
    body,
    icon: "/earthquake-icon.jpg",
    tag: `earthquake-${Date.now()}`,
    requireInteraction: true,
    actions: [
      {
        action: "open-app",
        title: "Buka Aplikasi",
      },
      {
        action: "dismiss",
        title: "Tutup",
      },
    ],
  });
}

/**
 * Send cluster verification notification
 */
export function sendClusterVerificationAlert(
  reportCount: number,
  latitude: number,
  longitude: number,
  avgIntensity: number
): Notification | null {
  const title = `🚨 GEMPA TERVERIFIKASI PENGGUNA`;
  const body = `${reportCount} pengguna melaporkan gempa dalam jangkauan 50km (Intensitas: ${avgIntensity.toFixed(1)})`;

  return sendPushNotification({
    title,
    body,
    icon: "/earthquake-icon.jpg",
    tag: "cluster-verified",
    requireInteraction: true,
    actions: [
      {
        action: "view-map",
        title: "Lihat Peta",
      },
      {
        action: "dismiss",
        title: "Tutup",
      },
    ],
  });
}

/**
 * Handle notification click events
 */
export function setupNotificationHandlers(): void {
  if (!isNotificationSupported()) return;

  // Handle notification click
  (window as any).notificationClickHandler = (action: string) => {
    if (action === "open-app" || action === "view-map") {
      window.focus();
      // Navigate to app or specific tab if needed
    }
  };

  console.log("[v0] Notification handlers setup complete");
}

/**
 * Get notification permission status
 */
export function getNotificationStatus(): "granted" | "denied" | "prompt" | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission as "granted" | "denied" | "prompt";
}

/**
 * Play notification sound
 */
export function playNotificationSound(soundPath: string = "/notification.mp3"): void {
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.8;
    audio.play().catch((error) => {
      console.warn("[v0] Could not play notification sound:", error);
    });
  } catch (error) {
    console.error("[v0] Error playing notification sound:", error);
  }
}
