import { MapPin, AlertCircle, Smartphone, Maximize2 } from "lucide-react";

export function GPSGuide() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-blue-900 flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        Tips GPS Akurat
      </h4>

      <div className="space-y-2 text-sm text-blue-800">
        <div className="flex gap-2">
          <Smartphone className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <span>Gunakan perangkat dengan GPS yang akurat (smartphone/tablet)</span>
        </div>

        <div className="flex gap-2">
          <Maximize2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <span>Buka di tempat terbuka untuk sinyal satelit yang lebih baik</span>
        </div>

        <div className="flex gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <span>Akurasi di bawah 50 meter dianggap sangat akurat</span>
        </div>

        <div className="flex gap-2">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
          <span>Klik "Perbarui GPS" untuk mendapatkan lokasi yang lebih presisi</span>
        </div>
      </div>
    </div>
  );
}
