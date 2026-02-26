// Data gempa dari BMKG API
export interface BMKGEarthquake {
  id: string;
  earthquake_id: string;
  source: string;
  status: string;
  region: string;
  magnitude: number;
  depth: number;
  datetime: string;
  latitude: number;
  longitude: number;
}

// Laporan gempa dari pengguna
export interface EarthquakeReport {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  intensity_level: number; // 1-9 (MMI Scale)
  description: string;
  location_name: string;
  created_at: string;
  updated_at: string;
}

// Pengaturan notifikasi pengguna
export interface NotificationSetting {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  min_intensity_level: number;
  notification_enabled: boolean;
  sound_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Tingkat intensitas gempa (MMI Scale)
export const INTENSITY_LEVELS = [
  { level: 1, name: "Tidak Terasa", color: "bg-green-500" },
  { level: 2, name: "Sangat Lemah", color: "bg-green-400" },
  { level: 3, name: "Lemah", color: "bg-yellow-300" },
  { level: 4, name: "Sedang", color: "bg-yellow-500" },
  { level: 5, name: "Agak Kuat", color: "bg-orange-400" },
  { level: 6, name: "Kuat", color: "bg-orange-500" },
  { level: 7, name: "Sangat Kuat", color: "bg-red-500" },
  { level: 8, name: "Dahsyat", color: "bg-red-700" },
  { level: 9, name: "Bencana", color: "bg-red-900" },
];
