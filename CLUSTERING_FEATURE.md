# Fitur Clustering Laporan Gempa

## Overview
Fitur Clustering adalah sistem canggih yang menganalisis laporan getaran gempa dari pengguna dan mengelompokkannya secara geografis untuk mengidentifikasi area-area dengan aktivitas seismic yang terkonsentrasi.

## Cara Kerja

### 1. Pengumpulan Data
- Pengguna melaporkan getaran gempa melalui form "Laporkan Getaran Gempa"
- Setiap laporan mencakup:
  - Lokasi GPS (latitude, longitude)
  - Tingkat intensitas (1-9)
  - Deskripsi getaran
  - Nama lokasi
  - Waktu laporan (timestamp)

### 2. Algoritma Clustering
- **Radius Cluster**: 50 kilometer
- **Minimum Reports**: 3 laporan untuk membentuk cluster
- **Haversine Formula**: Digunakan untuk menghitung jarak akurat antar titik geografis

```
Distance = R * arccos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon2 - lon1))
Dimana R = 6371 km (radius bumi)
```

### 3. Kategori Cluster

| Kategori | Minimum Reports | Severity | Badge |
|----------|-----------------|----------|-------|
| Low | 3-9 | Biru | `LOW (3+ Reports)` |
| Medium | 10-14 | Kuning | `MEDIUM (10+ Reports)` |
| High | 15-19 | Oranye | `HIGH PRIORITY (15+ Reports)` |
| Critical/Verified | 20+ | Merah | `CRITICAL (20+ Reports)` ✓ |

### 4. Perhitungan Statistik per Cluster
- **Latitude/Longitude Rata-rata**: Pusat geometric dari semua laporan
- **Average Intensity**: Rata-rata tingkat intensitas dari semua laporan
- **Intensity Range**: Nilai minimum dan maksimum intensitas
- **Report Count**: Jumlah laporan dalam cluster

## Verifikasi Cluster

Sebuah cluster dianggap **TERVERIFIKASI** ketika:
1. **Minimal 20 pengguna independen** melaporkan getaran
2. **Dalam jarak 50 km** dari titik pusat cluster
3. Cluster muncul dengan badge **✓ Verified** di Peta Gempa

### Keuntungan Verifikasi
- Menunjukkan bahwa getaran gempa adalah fenomena nyata yang dirasakan banyak orang
- Membantu pengguna lain memahami intensitas dan jangkauan gempa
- Mendukung riset dan analisis aktivitas seismic lokal

## Disclaimer Penting

**⚠️ Informasi Terukur:**
```
Laporan Getaran Gempa ini merupakan hasil informasi/interaksi pengguna, 
bukan mencerminkan getaran gempa sesungguhnya. 

Getaran Gempa menggunakan Skala Richter tetap mengacu kepada informasi 
yang disampaikan oleh BMKG Indonesia.
```

### Perbedaan dengan Data BMKG
- **BMKG Data**: Data instrumental dari seismometer profesional, akurat, terukur dengan Skala Richter
- **User Reports**: Pengalaman subjektif dari pengguna, berguna untuk analisis dampak sosial

## Fitur pada Peta Gempa

### Visualisasi
- **Color-coded Cards**: Setiap cluster ditampilkan dengan warna berdasarkan severity
- **Statistics Grid**: Menampilkan jumlah laporan, rata-rata intensitas, dan range
- **Interactive Selection**: Klik cluster untuk melihat detail laporan individual

### Detail per Cluster
- Koordinat geografis dengan presisi 3 desimal
- Daftar 10 laporan terbaru (scrollable)
- Timestamp relatif setiap laporan
- Deskripsi dari setiap pengguna
- Badge verifikasi jika 20+ reports

### Legend
- Menampilkan penjelasan warna untuk setiap kategori severity
- Memudahkan pengguna memahami tingkat konsentrasi laporan

## Penggunaan pada Dashboard

### Tab "Peta Gempa"
1. Navigasi ke tab "Peta Gempa" di halaman utama
2. Lihat cluster yang tersedia dalam area Anda
3. Klik cluster untuk melihat detail laporan dari pengguna lain
4. Verifikasi cluster dengan badge ✓ menunjukkan 20+ users telah melaporkan

### Auto-Refresh
- Data cluster diperbarui setiap 30 detik
- Laporan dari 24 jam terakhir disertakan dalam analisis
- Clustering dilakukan real-time di backend

## Technical Details

### API Endpoints

#### GET /api/reports
Mengambil laporan dan cluster dengan parameter:
- `radius=50` (dalam kilometer)
- `hours=24` (laporan dari berapa jam terakhir)

Response:
```json
{
  "success": true,
  "data": {
    "reports": [...],
    "clusters": [...],
    "total": 150,
    "verifiedClusters": 5
  }
}
```

#### POST /api/reports
Menyimpan laporan baru dari pengguna

### Database Schema

**earthquake_reports**
```sql
- id: UUID (primary key)
- latitude: FLOAT
- longitude: FLOAT
- intensity_level: INTEGER (1-9)
- description: TEXT (nullable)
- location_name: VARCHAR
- created_at: TIMESTAMP
```

### Frontend Implementation

**Hook: useReports**
- Fetches reports dan clustering data
- Auto-refreshes setiap 30 detik
- Menyediakan loading, error states

**Component: EarthquakeClusterMap**
- Menampilkan clusters dalam grid responsive
- Interactive cluster selection
- Menampilkan detail laporan individual

## Best Practices untuk Pengguna

1. **Akurasi Lokasi**: Aktifkan GPS High Accuracy untuk lokasi yang lebih presisi
2. **Intensitas Jujur**: Laporkan apa yang benar-benar Anda rasakan
3. **Deskripsi Detail**: Berikan konteks (benda jatuh, orang terjatuh, dll)
4. **Lapor Segera**: Laporkan saat gempa masih fresh di ingatan Anda

## Future Enhancements

- [ ] Real-time map visualization (Leaflet/Mapbox)
- [ ] Historical analysis dengan chart trend
- [ ] Integration dengan BMKG official data untuk cross-validation
- [ ] Notification alerts ketika cluster baru terdeteksi
- [ ] Export cluster data untuk research/analysis

---

**Last Updated**: 2024-02-03
**Version**: 1.0
