"use client";

import { useState, useEffect } from "react";
import { NotificationSetting, INTENSITY_LEVELS } from "@/types/earthquake";
import { MapPin, Volume2, Save, AlertCircle, Plus, Trash2 } from "lucide-react";

interface NotificationSettingsProps {
  userLocation?: { latitude: number; longitude: number };
  onSettingsSaved?: () => void;
}

export function NotificationSettings({
  userLocation,
  onSettingsSaved,
}: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form state untuk tambah setting baru
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [minIntensity, setMinIntensity] = useState<number>(3);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Buat notifikasi setting dari lokasi pengguna saat ini
  const handleAddSetting = async () => {
    if (!userLocation) {
      setError("Lokasi GPS tidak tersedia");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/notification-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius_km: radiusKm,
          min_intensity_level: minIntensity,
          notification_enabled: notificationEnabled,
          sound_enabled: soundEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan pengaturan");
      }

      // Reset form
      setRadiusKm(50);
      setMinIntensity(3);
      setNotificationEnabled(true);
      setSoundEnabled(true);

      // Muat ulang settings
      await loadSettings();
      setMessage("Pengaturan notifikasi berhasil ditambahkan!");

      if (onSettingsSaved) {
        onSettingsSaved();
      }

      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("[v0] Error adding notification setting:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hapus setting notifikasi
  const handleDeleteSetting = async (settingId: string) => {
    try {
      setLoading(true);

      const response = await fetch(`/api/notification-settings/${settingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus pengaturan");
      }

      await loadSettings();
      setMessage("Pengaturan notifikasi berhasil dihapus!");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      console.error("[v0] Error deleting notification setting:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/notification-settings");
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setSettings(data.settings || []);
    } catch (err) {
      console.error("[v0] Error loading notification settings:", err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      {/* Section title */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Pengaturan Notifikasi Gempa
        </h3>
        <p className="text-sm text-muted-foreground">
          Atur preferensi notifikasi berdasarkan radius dan intensitas gempa dari lokasi Anda
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">✓ {message}</p>
        </div>
      )}

      {/* GPS Location Info */}
      {userLocation && (
        <div className="bg-secondary/10 border border-secondary/20 rounded-md p-3 flex gap-2">
          <MapPin className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-secondary/90">
            <p className="font-medium">Lokasi GPS Anda</p>
            <p className="text-xs">
              {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
            </p>
          </div>
        </div>
      )}

      {/* Add new notification setting */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h4 className="font-semibold text-foreground">Tambah Notifikasi Baru</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Radius input */}
          <div className="space-y-2">
            <label htmlFor="radius" className="text-sm font-medium text-foreground">
              Radius Area (KM)
            </label>
            <input
              id="radius"
              type="number"
              min="5"
              max="500"
              step="5"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Notifikasi akan ditampilkan untuk gempa dalam radius {radiusKm} km dari lokasi Anda
            </p>
          </div>

          {/* Minimum intensity */}
          <div className="space-y-2">
            <label htmlFor="intensity" className="text-sm font-medium text-foreground">
              Intensitas Minimum
            </label>
            <select
              id="intensity"
              value={minIntensity}
              onChange={(e) => setMinIntensity(Number(e.target.value))}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {INTENSITY_LEVELS.map((level) => (
                <option key={level.level} value={level.level}>
                  Level {level.level}: {level.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Hanya notifikasi untuk intensitas level {minIntensity} ke atas
            </p>
          </div>
        </div>

        {/* Toggle options */}
        <div className="space-y-3 pt-2 border-t border-border">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationEnabled}
              onChange={(e) => setNotificationEnabled(e.target.checked)}
              className="w-4 h-4 rounded border border-border cursor-pointer"
            />
            <span className="text-sm font-medium text-foreground">
              Aktifkan Notifikasi Popup
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 rounded border border-border cursor-pointer"
            />
            <div className="flex items-center gap-1">
              <Volume2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Aktifkan Suara Alarm
              </span>
            </div>
          </label>
        </div>

        {/* Add button */}
        <button
          onClick={handleAddSetting}
          disabled={loading || !userLocation}
          className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-medium py-2 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Tambah Pengaturan</span>
            </>
          )}
        </button>
      </div>

      {/* Existing settings list */}
      {settings.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Pengaturan Aktif</h4>
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="bg-card border border-border rounded-lg p-4 flex items-start justify-between"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Radius {setting.radius_km} km
                  </span>
                  {setting.notification_enabled && (
                    <span className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded">
                      Popup
                    </span>
                  )}
                  {setting.sound_enabled && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded flex items-center gap-1">
                      <Volume2 className="w-3 h-3" /> Suara
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Intensitas minimum: Level {setting.min_intensity_level}
                  {" "} ({INTENSITY_LEVELS[setting.min_intensity_level - 1].name})
                </p>
                <p className="text-xs text-muted-foreground">
                  {setting.latitude.toFixed(4)}°, {setting.longitude.toFixed(4)}°
                </p>
              </div>
              <button
                onClick={() => handleDeleteSetting(setting.id)}
                disabled={loading}
                className="text-destructive hover:text-destructive/80 disabled:opacity-50 ml-4"
                aria-label="Delete setting"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {settings.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Belum ada pengaturan notifikasi</p>
          <p className="text-xs">Tambahkan pengaturan di atas untuk memulai</p>
        </div>
      )}
    </div>
  );
}
