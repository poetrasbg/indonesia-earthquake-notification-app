"use client";

import { useEffect, useState } from "react";
import { notificationService } from "@/lib/notification-service";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EarthquakeList } from "@/components/earthquake-list";
import { EarthquakeMonitor } from "@/components/earthquake-monitor";
import { EarthquakeStats } from "@/components/earthquake-stats";
import { FeltEarthquakes } from "@/components/felt-earthquakes";
import { ReportEarthquakeForm } from "@/components/report-earthquake-form";
import { NotificationSettings } from "@/components/notification-settings";
import { SafetyTips } from "@/components/safety-tips";
import { EarthquakeClusterMap } from "@/components/earthquake-clusters-map";
import { VerifiedClusterAlert } from "@/components/verified-cluster-alert";
import { MapPin, Bell, FileText, AlertTriangle, Map } from "lucide-react";
import { BMKGEarthquake, NotificationSetting } from "@/types/earthquake";
import { fetchLatestEarthquakes } from "@/lib/bmkg-api";
import { useReports } from "@/hooks/use-reports";
import { usePushNotifications } from "@/hooks/use-push";
import { EarthquakeCluster } from "@/lib/clustering-service";
import { calculateDistanceKmRounded } from "@/lib/distance-utils";
import { estimateIntensity } from "@/lib/intensity-utils";

export default function Home() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "report" | "clusters" | "settings"
  >("dashboard");
  const [notificationPermission, setNotificationPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [earthquakes, setEarthquakes] = useState<BMKGEarthquake[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
  const [clusters, setClusters] = useState<EarthquakeCluster[]>([]);
  const [lastNotifiedEarthquakeId, setLastNotifiedEarthquakeId] = useState<string | null>(null);
  const [lastNotifiedClusterId, setLastNotifiedClusterId] = useState<string | null>(null);

  // Initialize push notifications
  const { requestPermission, sendEarthquakeNotification, sendClusterAlert } = usePushNotifications();

  // Initialize geolocation dan notification permission
  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
          console.log("[v0] User location obtained");
        },
        (error) => {
          setLocationError(error.message);
          console.error("[v0] Geolocation error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes cache
        }
      );
    } else {
      setLocationError("Browser tidak mendukung geolocation");
    }

    // Check notification permission
    if ("Notification" in window) {
      setNotificationPermission(
        Notification.permission as "granted" | "denied" | "prompt"
      );
    }

    // Load earthquakes on mount
    const loadEarthquakes = async () => {
      try {
        const data = await fetchLatestEarthquakes();
        setEarthquakes(data);
      } catch (error) {
        console.error("[v0] Error loading earthquakes:", error);
      }
    };

    loadEarthquakes();

    // Auto-refresh earthquakes every 30 seconds
    const interval = setInterval(loadEarthquakes, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch reports and clusters
  const { data: reportsData } = useReports(50, 30000);

  useEffect(() => {
    if (reportsData?.clusters) {
      setClusters(reportsData.clusters);
      console.log("[v0] Clusters updated:", reportsData.clusters.length);

      // Send push notification for verified clusters if notifications are enabled
      if (notificationPermission === "granted") {
        reportsData.clusters.forEach((cluster) => {
          // Only notify once per cluster
          if (!lastNotifiedClusterId || lastNotifiedClusterId !== cluster.id) {
            if (cluster.isVerified && cluster.reportCount >= 20) {
              sendClusterAlert(cluster);
              setLastNotifiedClusterId(cluster.id);
              console.log("[v0] Sent cluster notification for cluster:", cluster.id);
            }
          }
        });
      }
    }
  }, [reportsData, notificationPermission, sendClusterAlert, lastNotifiedClusterId]);

  // Monitor earthquakes and send notifications
  useEffect(() => {
    if (
      earthquakes.length > 0 &&
      userLocation &&
      notificationPermission === "granted"
    ) {
      // Check the most recent earthquake
      const latestEarthquake = earthquakes[0];

      // Only notify once per earthquake
      if (!lastNotifiedEarthquakeId || lastNotifiedEarthquakeId !== latestEarthquake.id) {
        const distance = calculateDistanceKmRounded(
          userLocation.latitude,
          userLocation.longitude,
          latestEarthquake.latitude,
          latestEarthquake.longitude,
          0
        );

        // Send notification for earthquakes within 500km or magnitude > 5.0
        if (distance <= 500 || latestEarthquake.magnitude >= 5.0) {
          const estimatedIntensity = estimateIntensity(
            latestEarthquake.magnitude,
            latestEarthquake.depth
          );
          sendEarthquakeNotification(
            latestEarthquake,
            distance,
            estimatedIntensity
          );
          setLastNotifiedEarthquakeId(latestEarthquake.id);
          console.log("[v0] Sent earthquake notification for:", latestEarthquake.region);
        }
      }
    }
  }, [
    earthquakes,
    userLocation,
    notificationPermission,
    sendEarthquakeNotification,
    lastNotifiedEarthquakeId,
  ]);

  // Request notification permission with web push enabled
  const handleEnableNotifications = async () => {
    try {
      const permission = await requestPermission();
      if (permission) {
        setNotificationPermission("granted");
        console.log("[v0] Web push notifications enabled");
      }
    } catch (error) {
      console.error("[v0] Error requesting notification permission:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Verified Cluster Alert - Floating Notification */}
      <VerifiedClusterAlert clusters={clusters} />

      {/* Earthquake Monitor - Real-time notifications */}
      <EarthquakeMonitor
        userLocation={userLocation || undefined}
        notificationSettings={notificationSettings}
        onEarthquakeDetected={(message) => {
          console.log("[v0] Earthquake detected:", message);
        }}
      />

      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="w-full px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Notification banner */}
        {notificationPermission !== "granted" && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            <div className="flex gap-2 md:gap-3 flex-1">
              <Bell className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-amber-900 text-sm md:text-base">
                  Aktifkan Notifikasi
                </h3>
                <p className="text-xs md:text-sm text-amber-800 mt-0.5">
                  Izinkan notifikasi browser untuk mendapatkan peringatan gempa secara real-time
                </p>
              </div>
            </div>
            <button
              onClick={handleEnableNotifications}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-xs md:text-sm font-medium whitespace-nowrap flex-shrink-0"
            >
              Aktifkan
            </button>
          </div>
        )}

        {/* Location status */}
        <div className={`rounded-lg p-3 md:p-4 flex items-start gap-2 md:gap-3 ${
          userLocation
            ? "bg-green-50 border border-green-200"
            : "bg-red-50 border border-red-200"
        }`}>
          <MapPin
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              userLocation ? "text-green-600" : "text-red-600"
            }`}
          />
          <div className="flex-1 min-w-0">
            {userLocation ? (
              <>
                <p className="font-semibold text-green-900 text-sm md:text-base">
                  ✓ Lokasi GPS Terdeteksi
                </p>
                <p className="text-xs text-green-800 mt-0.5 font-mono break-all">
                  {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold text-red-900 text-sm md:text-base">
                  ✗ Lokasi GPS Tidak Terdeteksi
                </p>
                <p className="text-xs md:text-sm text-red-800 mt-0.5">
                  {locationError || "Silakan aktifkan geolocation di browser Anda"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Tab navigation - Responsive */}
        <div className="flex gap-0.5 md:gap-2 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 font-medium text-xs md:text-base transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "dashboard"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Gempa</span>
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 font-medium text-xs md:text-base transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "report"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Laporan Gempa</span>
            <span className="sm:hidden">Laporan</span>
          </button>
          <button
            onClick={() => setActiveTab("clusters")}
            className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 font-medium text-xs md:text-base transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "clusters"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Peta Gempa</span>
            <span className="sm:hidden">Peta</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 font-medium text-xs md:text-base transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "settings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifikasi</span>
            <span className="sm:hidden">Notif</span>
          </button>
        </div>

          {/* Tab content - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-max">
            {/* Main content area */}
            <div className="md:col-span-2">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2">
                      Gempa Bumi Terbaru
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Data real-time dari BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
                    </p>
                  </div>

                  {/* Earthquake Statistics */}
                  {earthquakes.length > 0 && (
                    <EarthquakeStats
                      earthquakes={earthquakes}
                      userLocation={userLocation || undefined}
                    />
                  )}

                  <EarthquakeList userLocation={userLocation || undefined} />

                  {/* Daftar 15 Gempabumi Dirasakan dengan Shakemap */}
                  <div className="mt-8">
                    <FeltEarthquakes
                      limit={15}
                      userLocation={userLocation || undefined}
                    />
                  </div>
                </div>
              )}

              {activeTab === "report" && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Laporkan Getaran Gempa
                  </h2>
                  <ReportEarthquakeForm userLocation={userLocation || undefined} />
                </div>
              )}

              {activeTab === "clusters" && (
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                      Peta Clustering Laporan Gempa
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Visualisasi clustering dari laporan pengguna dalam radius 50 km
                      {clusters.length > 0 && (
                        <span className="font-semibold text-primary ml-2">
                          ({clusters.filter(c => c.isVerified).length} cluster terverifikasi)
                        </span>
                      )}
                    </p>
                  </div>
                  <EarthquakeClusterMap
                    clusters={clusters}
                    userLocation={userLocation || undefined}
                  />
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Pengaturan Notifikasi
                  </h2>
                  <NotificationSettings userLocation={userLocation || undefined} />
                </div>
              )}
            </div>

          {/* Sidebar - Info dan tips - Responsive */}
          <div className="space-y-3 md:space-y-4">
            {/* Quick info card */}
            <div className="bg-card border border-border rounded-lg p-3 md:p-4 space-y-3">
              <h3 className="font-semibold text-sm md:text-base text-foreground">Cara Penggunaan</h3>
              <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="font-semibold text-primary flex-shrink-0">1.</span>
                  <span>Aktifkan geolocation untuk deteksi lokasi Anda</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary flex-shrink-0">2.</span>
                  <span>Lihat gempa terbaru di dashboard</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary flex-shrink-0">3.</span>
                  <span>Laporkan getaran yang Anda rasakan</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-primary flex-shrink-0">4.</span>
                  <span>Atur notifikasi untuk area tertentu</span>
                </li>
              </ul>
            </div>

              {/* Safety tips */}
              <SafetyTips />

            {/* Info card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 space-y-2">
              <h3 className="font-semibold text-xs md:text-sm text-blue-900">Tentang BMKG</h3>
              <p className="text-xs text-blue-800 leading-relaxed">
                Data gempa bumi bersumber dari BMKG (Badan Meteorologi, Klimatologi, dan
                Geofisika) Indonesia melalui API publik mereka.
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
