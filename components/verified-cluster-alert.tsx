'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, MapPin } from 'lucide-react';
import { EarthquakeCluster } from '@/lib/clustering-service';

interface VerifiedClusterAlertProps {
  clusters: EarthquakeCluster[];
  onClose?: () => void;
}

export function VerifiedClusterAlert({ clusters, onClose }: VerifiedClusterAlertProps) {
  const [shownAlerts, setShownAlerts] = useState<Set<string>>(new Set());
  const [visibleAlerts, setVisibleAlerts] = useState<EarthquakeCluster[]>([]);

  // Show alerts untuk clusters terverifikasi yang belum ditampilkan
  useEffect(() => {
    const verifiedClusters = clusters.filter(c => c.isVerified && !shownAlerts.has(c.id));
    
    if (verifiedClusters.length > 0) {
      setVisibleAlerts(prev => [...prev, ...verifiedClusters]);
      setShownAlerts(prev => new Set([...prev, ...verifiedClusters.map(c => c.id)]));

      // Auto-hide alert setelah 8 detik
      const timer = setTimeout(() => {
        setVisibleAlerts([]);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [clusters, shownAlerts]);

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 md:max-w-md">
      {visibleAlerts.map((cluster) => (
        <div
          key={cluster.id}
          className="bg-red-600 text-white rounded-lg p-4 shadow-lg border-2 border-red-700 animate-in slide-in-from-right-4 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3 flex-1 min-w-0">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm md:text-base mb-1">
                  Cluster Gempa Terverifikasi! ✓
                </h3>
                <p className="text-xs md:text-sm text-red-100 mb-2">
                  {cluster.reportCount} pengguna melaporkan getaran di area ini
                </p>
                <div className="flex items-center gap-2 text-xs bg-red-700 rounded px-2 py-1 w-fit">
                  <MapPin className="w-3 h-3" />
                  <span className="font-mono">
                    {cluster.latitude.toFixed(2)}°, {cluster.longitude.toFixed(2)}°
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setVisibleAlerts([])}
              className="flex-shrink-0 hover:bg-red-700 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress bar untuk auto-hide */}
          <div className="mt-3 h-1 bg-red-700 rounded overflow-hidden">
            <div
              className="h-full bg-red-400 animate-pulse"
              style={{
                animation: 'shrink 8s linear forwards',
              }}
            />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slide-in-from-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
