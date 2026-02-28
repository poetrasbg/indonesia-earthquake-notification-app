# 🌍 IndonesiaEarth — Indonesia Earthquake Notification App

**IndonesiaEarth** adalah aplikasi web real-time untuk memantau dan mendapatkan notifikasi gempa bumi di Indonesia. Data bersumber langsung dari API resmi **BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)** dengan fitur notifikasi berbasis lokasi GPS, laporan komunitas, dan visualisasi peta interaktif.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

---

## ✨ Fitur Utama

### 📡 Dashboard Gempa Real-Time
- Data terbaru dari 3 endpoint BMKG: `autogempa`, `gempaterkini`, dan `gempadirasakan`
- Auto-refresh otomatis setiap **30 detik**
- Informasi lengkap: magnitude, kedalaman, lokasi, waktu kejadian
- Estimasi intensitas MMI (skala 1–9) berdasarkan magnitude dan kedalaman
- Kalkulasi jarak otomatis dari lokasi pengguna ke episenter gempa
- Statistik ringkasan: rata-rata magnitude, kedalaman rata-rata, gempa terdekat

### 📋 Sistem Pelaporan Gempa Komunitas
- Form pelaporan getaran yang dirasakan oleh pengguna
- Picker intensitas MMI (1–9) dengan visualisasi warna
- Deteksi lokasi otomatis via GPS atau input manual
- Validasi input di sisi server (Next.js API Routes + Supabase)
- Respons sukses/error yang informatif

### 🔔 Notifikasi Berbasis Lokasi GPS
- Setup zona notifikasi dengan radius **5–500 km** dari titik manapun
- Filter berdasarkan level intensitas minimum
- Toggle terpisah untuk **popup notification** dan **sound alarm**
- Real-time checking saat ada gempa baru masuk
- Manajemen daftar semua zona notifikasi aktif

### 🔊 Sound Alarm
- Menggunakan **Web Audio API** — tanpa dependency eksternal
- Frekuensi modulasi (880Hz & 440Hz) dengan efek vibrato (LFO)
- Durasi 5 detik dengan exponential fade-out
- Kompatibel dengan semua browser modern

### 🗺️ Visualisasi Peta
- Peta episenter gempa dengan **OpenStreetMap** (atau Google Maps)
- Display koordinat dengan zoom interaktif
- Visualisasi cluster laporan komunitas di peta

### 🧠 Clustering Laporan
- Algoritma pengelompokan laporan dalam radius **50 km**
- Cluster dengan **20+ laporan** otomatis mendapat status *Verified*
- Tingkat keparahan cluster: `Low → Medium → High → Critical`
- Warna cluster: Biru → Kuning → Oranye → Merah
- Notifikasi cluster terverifikasi yang muncul di halaman utama

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| Data Source | BMKG Official API |
| Deployment | Vercel (recommended) |

**Browser APIs yang digunakan:**
- Geolocation API
- Web Notifications API
- Web Audio API

---

## 📁 Struktur Proyek

```
indonesia-earthquake-notification-app/
├── app/
│   ├── layout.tsx                        # Root layout
│   ├── page.tsx                          # Halaman utama dashboard
│   ├── globals.css                       # Global styles & tema warna
│   └── api/
│       ├── reports/route.ts              # GET & POST laporan gempa
│       ├── earthquake-map/route.ts       # Data peta gempa
│       └── notification-settings/
│           ├── route.ts                  # GET & POST zona notifikasi
│           └── [id]/route.ts             # PUT & DELETE zona notifikasi
├── components/
│   ├── earthquake-card.tsx               # Card info satu gempa
│   ├── earthquake-list.tsx               # Daftar gempa dengan auto-refresh
│   ├── earthquake-monitor.tsx            # Engine monitoring real-time
│   ├── earthquake-stats.tsx              # Statistik ringkasan
│   ├── earthquake-history.tsx            # Riwayat gempa
│   ├── earthquake-clusters-map.tsx       # Peta cluster laporan
│   ├── felt-earthquakes.tsx              # Daftar gempa dirasakan
│   ├── intensity-scale.tsx               # Visualisasi skala MMI
│   ├── notification-settings.tsx         # Manajemen zona notifikasi
│   ├── report-earthquake-form.tsx        # Form laporan gempa
│   ├── safety-tips.tsx                   # Tips keselamatan gempa
│   ├── verified-cluster-alert.tsx        # Alert cluster terverifikasi
│   ├── coordinate-map-display.tsx        # Display koordinat di peta
│   ├── google-map-display.tsx            # Integrasi Google Maps
│   ├── gps-guide.tsx                     # Panduan penggunaan GPS
│   ├── header.tsx                        # Header navigasi
│   ├── footer.tsx                        # Footer
│   └── ui/                               # Komponen shadcn/ui
├── hooks/
│   ├── use-earthquake-monitor.ts         # Hook monitoring gempa real-time
│   ├── use-geolocation.ts                # Hook deteksi lokasi GPS
│   ├── use-push.ts                       # Hook push notification
│   └── use-reports.ts                    # Hook manajemen laporan
├── lib/
│   ├── bmkg-api.ts                       # Integrasi BMKG API
│   ├── clustering-service.ts             # Algoritma clustering laporan
│   ├── intensity-utils.ts                # Kalkulasi intensitas MMI
│   ├── notification-service.tsx          # Logika notifikasi & suara
│   └── push-utils.ts                     # Utilitas push notification
├── types/
│   └── earthquake.ts                     # TypeScript type definitions
├── scripts/
│   ├── init-db.sql                       # Inisialisasi skema database
│   └── create-earthquake-reports.sql     # Tabel laporan gempa
└── public/
    └── icon.svg                          # Ikon aplikasi
```

---

## 🚀 Cara Menjalankan

### Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** / **yarn** / **bun**
- Akun **Supabase** (untuk database)
- Browser modern (Chrome, Firefox, Safari, Edge)

### 1. Clone Repository

```bash
git clone https://github.com/poetrasbg/indonesia-earthquake-notification-app.git
cd indonesia-earthquake-notification-app
```

### 2. Install Dependencies

```bash
npm install
# atau
bun install
```

### 3. Setup Supabase

1. Buat project baru di [https://app.supabase.com](https://app.supabase.com)
2. Buka **SQL Editor** → **New Query**
3. Copy dan jalankan script berikut:

```sql
-- Buat tabel laporan gempa
CREATE TABLE IF NOT EXISTS earthquake_reports (
  id BIGSERIAL PRIMARY KEY,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  intensity_level INTEGER NOT NULL CHECK (intensity_level >= 1 AND intensity_level <= 9),
  description TEXT,
  location_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_earthquake_reports_created_at ON earthquake_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_earthquake_reports_location ON earthquake_reports(latitude, longitude);

-- Row Level Security
ALTER TABLE earthquake_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reports" ON earthquake_reports FOR SELECT USING (TRUE);
CREATE POLICY "Anyone can submit reports" ON earthquake_reports FOR INSERT WITH CHECK (TRUE);
GRANT SELECT, INSERT ON earthquake_reports TO anon, authenticated;
```

4. Pergi ke **Project Settings → API** dan salin `Project URL` dan `anon public key`

### 4. Konfigurasi Environment

Buat file `.env.local` di root proyek:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📦 Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server |
| `npm run lint` | Cek linting dengan ESLint |

---

## 🌐 Sumber Data BMKG

Aplikasi ini menggunakan 3 endpoint API resmi BMKG:

| Endpoint | Deskripsi |
|---|---|
| `autogempa.json` | Gempa terbaru (auto-update) |
| `gempaterkini.json` | 15 gempa terbaru ≥ M5.0 |
| `gempadirasakan.json` | 15 gempa yang dirasakan penduduk |

---

## 🗄️ Skema Database

### `earthquake_reports`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | BIGSERIAL | Primary Key |
| `latitude` | DOUBLE PRECISION | Koordinat latitude laporan |
| `longitude` | DOUBLE PRECISION | Koordinat longitude laporan |
| `intensity_level` | INTEGER (1–9) | Skala intensitas MMI |
| `description` | TEXT | Deskripsi getaran (opsional) |
| `location_name` | TEXT | Nama lokasi pelapor |
| `created_at` | TIMESTAMPTZ | Waktu laporan dibuat |

---

## 🎨 Warna Intensitas MMI

| Level | Warna | Deskripsi |
|---|---|---|
| I – II | 🟢 Hijau | Tidak terasa / hampir tidak terasa |
| III – IV | 🟡 Kuning | Terasa lemah |
| V – VI | 🟠 Oranye | Terasa kuat, kerusakan ringan |
| VII – VIII | 🔴 Merah | Kerusakan sedang hingga berat |
| IX | ⚫ Merah Tua | Kerusakan sangat parah |

---

## 🚀 Deployment

### Vercel (Rekomendasi)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables di Vercel Dashboard:
# Settings → Environment Variables
# Tambahkan: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm run start
```

---

## 🔐 Keamanan

- **Row Level Security (RLS)** aktif di semua tabel Supabase
- Validasi input dilakukan di sisi server (API Routes)
- Variabel lingkungan sensitif tidak pernah di-commit ke Git
- Geolocation hanya aktif setelah izin pengguna diberikan

**Yang disarankan untuk production:**
- Aktifkan HTTPS
- Tambahkan rate limiting di API routes
- Konfigurasi CORS sesuai domain
- Setup Content Security Policy (CSP)

---

## 🔧 Troubleshooting

**Geolocation tidak tersedia**
→ Pastikan aplikasi diakses via HTTPS di production. Cek izin browser untuk geolocation.

**BMKG API tidak merespons**
→ Cek koneksi internet. Verifikasi status API BMKG. Cek DevTools Console untuk error CORS.

**Database connection error**
→ Pastikan URL dan API Key Supabase di `.env.local` sudah benar. Verifikasi project Supabase aktif.

**Notifikasi tidak muncul**
→ Pastikan izin notifikasi sudah diberikan di browser. Cek pengaturan notifikasi sistem operasi.

**Suara tidak berbunyi**
→ Cek izin audio browser. Gunakan Chrome untuk kompatibilitas terbaik. Pastikan volume sistem tidak di-mute.

---

## 🗺️ Roadmap

**Phase 1 (Sekarang) ✅**
- Dashboard gempa real-time
- Sistem pelaporan komunitas
- Notifikasi berbasis GPS
- Clustering laporan

**Phase 2 (Direncanakan)**
- Autentikasi pengguna via Supabase Auth
- Manajemen profil pengguna
- Integrasi Google Maps interaktif
- Kueri data historis gempa

**Phase 3 (Masa Depan)**
- Push notification via FCM
- Prediksi intensitas dengan machine learning
- Integrasi sensor IoT
- Aplikasi mobile (React Native)
- Dukungan multi-bahasa

---

## 🤝 Kontribusi

Kontribusi sangat disambut! Ikuti langkah berikut:

1. Fork repository ini
2. Buat branch fitur baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buka Pull Request

---

## 🙏 Kredit

- **[BMKG](https://www.bmkg.go.id)** — Data gempa resmi Indonesia
- **[Supabase](https://supabase.com)** — Database serverless PostgreSQL
- **[shadcn/ui](https://ui.shadcn.com)** — Komponen UI modern
- **[Vercel](https://vercel.com)** — Platform deployment Next.js
- **[Lucide React](https://lucide.dev)** — Ikon SVG

---

## 📄 Lisensi

MIT License — Bebas digunakan untuk keperluan pribadi maupun komersial dengan atribusi.

---

<p align="center">
  Dibuat dengan ❤️ untuk keselamatan masyarakat Indonesia
</p>
