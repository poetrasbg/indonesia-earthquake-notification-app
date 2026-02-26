"use client";

import { AlertTriangle, Home, Smartphone, Navigation } from "lucide-react";

export function SafetyTips() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-semibold text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Keselamatan Saat Gempa Bumi
        </h3>
      </div>

      {/* Before Earthquake */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-amber-900">Sebelum Gempa</h4>
        <ul className="space-y-2 text-sm text-amber-900">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Identifikasi tempat aman di setiap ruangan (bawah meja yang kokoh)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Buat rencana evakuasi dan tentukan titik kumpul keluarga</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Siapkan tas darurat dengan air bersih, obat-obatan, dan dokumen penting</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Perkuat barang-barang berat agar tidak mudah jatuh</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Pelajari cara mematikan gas dan listrik jika diperlukan</span>
          </li>
        </ul>
      </div>

      {/* During Earthquake */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-orange-900 flex items-center gap-2">
          <Home className="w-4 h-4" />
          Saat Gempa Terjadi
        </h4>
        <ul className="space-y-2 text-sm text-orange-900">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>
              <strong>Drop, Cover, Hold On!</strong> - Segera lindungi kepala dan leher
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>Berlindung di bawah meja yang kokoh atau di sudut ruangan</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">3.</span>
            <span>Jauh dari jendela, cermin, lampu gantung, dan rak buku</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">4.</span>
            <span>Jika di luar ruangan, jauh dari bangunan, pohon besar, dan kabel listrik</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">5.</span>
            <span>Jangan berlari keluar - menahan diri hingga getaran berhenti</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">6.</span>
            <span>Jika di dalam kendaraan, tetap di dalam dan jauh dari bangunan</span>
          </li>
        </ul>
      </div>

      {/* After Earthquake */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-red-900 flex items-center gap-2">
          <Smartphone className="w-4 h-4" />
          Setelah Gempa
        </h4>
        <ul className="space-y-2 text-sm text-red-900">
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Cek keselamatan diri sendiri dan orang lain di sekitar</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Bergerak hati-hati - berhati-hatilah dengan pecahan kaca dan puing-puing</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Periksa rumah untuk kerusakan gas, listrik, dan air</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Dengarkan siaran radio untuk informasi resmi dan instruksi evakuasi</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Hindari menggunakan telepon kecuali untuk keadaan darurat</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">•</span>
            <span>Bersiaplah untuk gempa susulan yang mungkin terjadi</span>
          </li>
        </ul>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-blue-900 flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          Nomor Darurat
        </h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-blue-900">
          <div>
            <p className="font-semibold">Polisi</p>
            <p className="text-lg">110</p>
          </div>
          <div>
            <p className="font-semibold">Ambulans</p>
            <p className="text-lg">119</p>
          </div>
          <div>
            <p className="font-semibold">Pemadam Kebakaran</p>
            <p className="text-lg">113</p>
          </div>
          <div>
            <p className="font-semibold">BMKG</p>
            <p className="text-lg">1500124</p>
          </div>
        </div>
      </div>
    </div>
  );
}
