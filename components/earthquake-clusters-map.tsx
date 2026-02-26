'use client';

import React, { useState } from 'react';
import { EarthquakeCluster, getClusterColor, getClusterSeverity } from '@/lib/clustering-service';
import { AlertTriangle, MapPin, Users, Zap } from 'lucide-react';

interface EarthquakeClusterMapProps {
  clusters: EarthquakeCluster[];
  userLocation?: { latitude: number; longitude: number };
}

export function EarthquakeClusterMap({
  clusters,
  userLocation,
}: EarthquakeClusterMapProps) {
  const [selectedCluster, setSelectedCluster] = useState<EarthquakeCluster | null>(null);

  if (clusters.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">Tidak ada cluster laporan gempa dalam area ini</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold mb-1">Penting: Disclaimer Laporan Pengguna</p>
            <p className="text-xs md:text-sm">
              Laporan Getaran Gempa ini merupakan hasil informasi/interaksi pengguna, bukan mencerminkan getaran gempa sesungguhnya. 
              Getaran Gempa menggunakan Skala Richter tetap mengacu kepada informasi yang disampaikan oleh BMKG Indonesia.
            </p>
          </div>
        </div>
      </div>

      {/* Clusters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clusters.map((cluster) => {
          const severity = getClusterSeverity(cluster);
          const color = getClusterColor(cluster);
          const isVerified = cluster.isVerified;

          return (
            <div
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                selectedCluster?.id === cluster.id
                  ? 'ring-2 ring-offset-2'
                  : ''
              }`}
              style={{
                borderColor: color,
                backgroundColor: `${color}15`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm md:text-base">
                      {cluster.latitude.toFixed(2)}°, {cluster.longitude.toFixed(2)}°
                    </p>
                  </div>
                </div>

                {/* Verified Badge */}
                {isVerified && (
                  <div className="flex-shrink-0 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold ml-2">
                    ✓ Verified
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                {/* Report Count */}
                <div className="bg-white/50 rounded p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="w-4 h-4" style={{ color }} />
                    <span className="text-xs font-medium text-muted-foreground">Laporan</span>
                  </div>
                  <p className="text-lg font-bold">{cluster.reportCount}</p>
                </div>

                {/* Average Intensity */}
                <div className="bg-white/50 rounded p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap className="w-4 h-4" style={{ color }} />
                    <span className="text-xs font-medium text-muted-foreground">Rata-rata</span>
                  </div>
                  <p className="text-lg font-bold">{cluster.averageIntensity.toFixed(1)}</p>
                </div>

                {/* Intensity Range */}
                <div className="bg-white/50 rounded p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4" style={{ color }} />
                    <span className="text-xs font-medium text-muted-foreground">Range</span>
                  </div>
                  <p className="text-lg font-bold">
                    {cluster.minIntensity}-{cluster.maxIntensity}
                  </p>
                </div>
              </div>

              {/* Severity Badge */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <div
                  className="px-3 py-1 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: color }}
                >
                  {severity === 'critical' && 'CRITICAL (20+ Reports)'}
                  {severity === 'high' && 'HIGH PRIORITY (15+ Reports)'}
                  {severity === 'medium' && 'MEDIUM (10+ Reports)'}
                  {severity === 'low' && 'LOW (3+ Reports)'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Cluster Details */}
      {selectedCluster && (
        <div className="bg-card border-2 rounded-lg p-4 md:p-6" style={{ borderColor: getClusterColor(selectedCluster) }}>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2">
              Detail Cluster: {selectedCluster.latitude.toFixed(3)}°, {selectedCluster.longitude.toFixed(3)}°
            </h3>
            {selectedCluster.isVerified && (
              <div className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-semibold">
                ✓ Laporan Terverifikasi (20+ Pengguna)
              </div>
            )}
          </div>

          {/* Reports List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedCluster.reports.slice(0, 10).map((report, idx) => (
              <div key={report.id} className="bg-muted/50 rounded p-3 text-sm">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium">
                    #{idx + 1} - Level {report.intensity_level}
                  </p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(report.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  📍 {report.location_name}
                </p>
                {report.description && (
                  <p className="text-xs mt-1 text-foreground/80">{report.description}</p>
                )}
              </div>
            ))}
            {selectedCluster.reports.length > 10 && (
              <p className="text-center text-xs text-muted-foreground py-2">
                +{selectedCluster.reports.length - 10} laporan lainnya
              </p>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm font-semibold mb-3">Legenda Severity</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span>Critical (20+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600" />
            <span>High (15+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span>Medium (10+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Low (3+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
