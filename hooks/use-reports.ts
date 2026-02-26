'use client';

import { useEffect, useState } from 'react';
import { EarthquakeCluster } from '@/lib/clustering-service';

interface EarthquakeReport {
  id: string;
  latitude: number;
  longitude: number;
  intensity_level: number;
  description?: string;
  location_name: string;
  created_at: string;
}

interface ReportsData {
  reports: EarthquakeReport[];
  clusters: EarthquakeCluster[];
  total: number;
  verifiedClusters: number;
}

export function useReports(radiusKm: number = 50, pollInterval: number = 30000) {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/reports?radius=${radiusKm}&hours=24`);

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const result = await response.json();
      setData(result.data);
      console.log('[v0] Reports fetched:', result.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('[v0] Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReports();
  }, [radiusKm]);

  // Auto-refresh every pollInterval
  useEffect(() => {
    const interval = setInterval(fetchReports, pollInterval);
    return () => clearInterval(interval);
  }, [pollInterval]);

  return { data, loading, error, refetch: fetchReports };
}
