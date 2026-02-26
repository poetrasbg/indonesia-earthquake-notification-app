"use client";

import React from "react";

import { useState, useEffect } from "react";
import { INTENSITY_LEVELS } from "@/types/earthquake";
import { IntensityScale } from "./intensity-scale";
import { GPSGuide } from "./gps-guide";
import { Send, MapPin, AlertCircle, Loader } from "lucide-react";

interface ReportEarthquakeFormProps {
  onSuccess?: () => void;
  userLocation?: { latitude: number; longitude: number };
}

export function ReportEarthquakeForm({
  onSuccess,
  userLocation,
}: ReportEarthquakeFormProps) {
  const [intensity, setIntensity] = useState<number>(3);
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gettingGPS, setGettingGPS] = useState(false);

  // Refresh GPS location with high accuracy
  const handleRefreshGPS = () => {
    setGettingGPS(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsAccuracy(position.coords.accuracy);
          console.log("[v0] GPS accuracy:", position.coords.accuracy, "meters");
          setGettingGPS(false);
        },
        (error) => {
          setError("Gagal memperbarui lokasi GPS: " + error.message);
          setGettingGPS(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0, // Don't use cache for accurate location
        }
      );
    } else {
      setError("Browser tidak mendukung geolocation");
      setGettingGPS(false);
    }
  };

  // Set initial GPS accuracy when location changes
  useEffect(() => {
    if (userLocation) {
      // Request high accuracy location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setGpsAccuracy(position.coords.accuracy);
          },
          () => {
            // Ignore errors on initial load
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    }
  }, [userLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!userLocation) {
      setError("Lokasi GPS tidak tersedia. Silakan aktifkan geolocation.");
      return;
    }

    if (!locationName.trim()) {
      setError("Nama lokasi harus diisi");
      return;
    }

    try {
      setLoading(true);

      // Kirim laporan ke server (akan dibuat route handler)
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          intensity_level: intensity,
          description: description || null,
          location_name: locationName,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim laporan");
      }

      setSuccess(true);
      setDescription("");
      setLocationName("");
      setIntensity(3);

      if (onSuccess) {
        onSuccess();
      }

      // Reset success message setelah 3 detik
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("[v0] Error submitting report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">
            <AlertCircle className="inline w-4 h-4 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-2">
          <p className="text-sm text-green-800 font-semibold">
            ✓ Laporan Anda telah dikirim. Terima kasih!
          </p>
          <p className="text-xs text-green-700">
            Laporan Anda akan dianalisis bersama dengan laporan pengguna lainnya. 
            Jika 20+ pengguna dalam radius 50km melaporkan getaran yang sama, 
            laporan akan muncul di "Peta Gempa" sebagai cluster terverifikasi.
          </p>
        </div>
      )}

      {/* Lokasi GPS - Enhanced */}
      {userLocation && (
        <div className="space-y-2">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex gap-3 flex-1">
                <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 flex items-center gap-2">
                    ✓ Lokasi GPS Terdeteksi
                    {gpsAccuracy && (
                      <span className="text-xs font-normal bg-green-100 text-green-800 px-2 py-0.5 rounded">
                        ±{Math.round(gpsAccuracy)}m
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-green-800 mt-1 font-mono">
                    {userLocation.latitude.toFixed(6)}°, {userLocation.longitude.toFixed(6)}°
                  </p>
                  {gpsAccuracy && (
                    <p className="text-xs text-green-700 mt-1">
                      Akurasi: {gpsAccuracy.toFixed(0)} meter
                      {gpsAccuracy < 50 && <span className="ml-1">(Sangat akurat)</span>}
                      {gpsAccuracy >= 50 && gpsAccuracy < 100 && (
                        <span className="ml-1">(Akurat)</span>
                      )}
                      {gpsAccuracy >= 100 && <span className="ml-1">(Perlu diperbaiki)</span>}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleRefreshGPS}
                disabled={gettingGPS}
                className="flex-shrink-0 bg-green-600 hover:bg-green-700 disabled:bg-green-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                {gettingGPS ? (
                  <>
                    <Loader className="w-3 h-3 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>Perbarui GPS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Accuracy notice */}
          {gpsAccuracy && gpsAccuracy > 100 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2 flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">
                Akurasi GPS Anda kurang presisi. Coba klik "Perbarui GPS" untuk mendapatkan lokasi yang lebih akurat.
              </p>
            </div>
          )}
        </div>
      )}

      {/* GPS Tips */}
      <GPSGuide />

      {/* Intensity level selector using IntensityScale component */}
      <div>
        <IntensityScale
          selectedLevel={intensity}
          showDescription={true}
          interactive={true}
          onSelect={setIntensity}
          compact={false}
        />
      </div>

      {/* Location name */}
      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium text-foreground">
          Nama Lokasi Anda
        </label>
        <input
          id="location"
          type="text"
          placeholder="Contoh: Jakarta Pusat, Jl. Sudirman"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Deskripsi / Observasi (Opsional)
        </label>
        <textarea
          id="description"
          placeholder="Contoh: Getaran terasa dalam 5 detik, perabotan bergeser sedikit..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || !userLocation}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            <span>Mengirim...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Kirim Laporan</span>
          </>
        )}
      </button>
    </form>
  );
}
