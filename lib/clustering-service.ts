// Clustering service untuk mendeteksi lokasi gempa dari multiple reports
import { calculateDistanceKm } from "@/lib/distance-utils";

export interface EarthquakeReport {
  id: string;
  latitude: number;
  longitude: number;
  intensity_level: number;
  description?: string;
  location_name: string;
  created_at: string;
}

export interface EarthquakeCluster {
  id: string;
  latitude: number;
  longitude: number;
  reportCount: number;
  averageIntensity: number;
  minIntensity: number;
  maxIntensity: number;
  reports: EarthquakeReport[];
  isVerified: boolean;
}

// Group reports into clusters within 50km radius
export function clusterReports(
  reports: EarthquakeReport[],
  radiusKm: number = 50
): EarthquakeCluster[] {
  if (reports.length === 0) return [];

  const clusters: EarthquakeCluster[] = [];
  const visited = new Set<string>();

  for (const report of reports) {
    if (visited.has(report.id)) continue;

    const cluster: EarthquakeReport[] = [report];
    visited.add(report.id);

    // Find all reports within radiusKm
    for (const otherReport of reports) {
      if (visited.has(otherReport.id)) continue;

      const distance = calculateDistanceKm(
        report.latitude,
        report.longitude,
        otherReport.latitude,
        otherReport.longitude
      );

      if (distance <= radiusKm) {
        cluster.push(otherReport);
        visited.add(otherReport.id);
      }
    }

    // Only create cluster if it has minimum reports
    if (cluster.length >= 3) {
      const avgLat = cluster.reduce((sum, r) => sum + r.latitude, 0) / cluster.length;
      const avgLon = cluster.reduce((sum, r) => sum + r.longitude, 0) / cluster.length;
      const avgIntensity =
        cluster.reduce((sum, r) => sum + r.intensity_level, 0) / cluster.length;
      const intensities = cluster.map((r) => r.intensity_level);
      const minIntensity = Math.min(...intensities);
      const maxIntensity = Math.max(...intensities);

      clusters.push({
        id: `cluster-${Date.now()}-${Math.random()}`,
        latitude: avgLat,
        longitude: avgLon,
        reportCount: cluster.length,
        averageIntensity: avgIntensity,
        minIntensity,
        maxIntensity,
        reports: cluster,
        isVerified: cluster.length >= 20, // Verified cluster needs 20+ reports
      });
    }
  }

  // Sort by report count descending
  return clusters.sort((a, b) => b.reportCount - a.reportCount);
}

// Get severity level based on report count and intensity
export function getClusterSeverity(cluster: EarthquakeCluster): 'low' | 'medium' | 'high' | 'critical' {
  if (cluster.isVerified) return 'critical'; // 20+ reports = critical/verified

  if (cluster.reportCount >= 15) return 'high';
  if (cluster.reportCount >= 10) return 'medium';
  return 'low';
}

// Get color for cluster based on severity
export function getClusterColor(cluster: EarthquakeCluster): string {
  const severity = getClusterSeverity(cluster);
  switch (severity) {
    case 'critical':
      return '#dc2626'; // red-600
    case 'high':
      return '#ea580c'; // orange-600
    case 'medium':
      return '#eab308'; // yellow-500
    default:
      return '#3b82f6'; // blue-500
  }
}
