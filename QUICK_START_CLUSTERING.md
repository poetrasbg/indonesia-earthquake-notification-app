# Quick Start Guide - Fitur Clustering Gempa

## 30 Detik Overview

Sistem clustering mendeteksi area dengan banyak laporan getaran gempa dari pengguna. Ketika **20+ pengguna dalam radius 50km** melaporkan getaran yang sama, cluster tersebut ditandai **TERVERIFIKASI** dengan notifikasi otomatis.

---

## Cara Menggunakan (User)

### Step 1: Lapor Getaran
1. Klik tab **"Laporan Gempa"**
2. Izinkan akses GPS (tekan "Perbarui GPS" untuk akurasi tinggi)
3. Pilih tingkat intensitas (1-9)
4. Isi nama lokasi dan deskripsi (opsional)
5. Klik **"Kirim Laporan"**

### Step 2: Lihat Clustering
1. Klik tab **"Peta Gempa"**
2. Lihat cluster laporan yang terbentuk
3. **Warna merah** = Cluster terverifikasi (20+)
4. Klik cluster untuk lihat detail laporan lain

### Step 3: Notifikasi Otomatis
- Sistem otomatis memberi tahu saat cluster baru terverifikasi
- Alert muncul di **bottom-right** layar
- Berisi info lokasi dan jumlah reports

---

## Color Legend

```
🔵 Biru  = Rendah (3-9 reports)      → Local seismic activity
🟡 Kuning = Sedang (10-14 reports)   → Concentrated reports
🟠 Oranye = Tinggi (15-19 reports)   → Significant activity
🔴 Merah  = CRITICAL (20+ reports)   → VERIFIED ✓
```

---

## Important Disclaimer

> ⚠️ **Penting!**
> 
> Laporan Getaran Gempa ini merupakan hasil informasi/interaksi pengguna, 
> BUKAN mencerminkan getaran gempa sesungguhnya.
> 
> Getaran Gempa menggunakan Skala Richter tetap mengacu kepada 
> informasi yang disampaikan oleh **BMKG Indonesia**.

---

## Technical Setup (Developer)

### 1. Ensure Supabase Connected
```bash
# Check .env variables:
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### 2. Database Table
```sql
-- Supabase SQL Editor:
CREATE TABLE earthquake_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  intensity_level INTEGER NOT NULL CHECK (intensity_level >= 1 AND intensity_level <= 9),
  description TEXT,
  location_name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Optional: Add geospatial index
CREATE INDEX idx_location ON earthquake_reports(latitude, longitude);
```

### 3. RLS Policies (Optional)
```sql
-- Allow anyone to INSERT (public reporting)
ALTER TABLE earthquake_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON earthquake_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public select" ON earthquake_reports
  FOR SELECT USING (true);
```

### 4. Test API
```bash
# Get clusters
curl "http://localhost:3000/api/reports?radius=50&hours=24"

# Submit report
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -6.1751,
    "longitude": 106.8650,
    "intensity_level": 5,
    "location_name": "Jakarta Pusat",
    "description": "Getaran terasa cukup kuat"
  }'
```

---

## API Reference

### GET /api/reports
**Query Parameters:**
```
radius=50    (int, kilometers)
hours=24     (int, hours back)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "uuid",
        "latitude": -6.1751,
        "longitude": 106.8650,
        "intensity_level": 5,
        "location_name": "Jakarta",
        "created_at": "2024-02-03T10:00:00Z"
      }
    ],
    "clusters": [
      {
        "id": "cluster-xxx",
        "latitude": -6.17,
        "longitude": 106.87,
        "reportCount": 25,
        "averageIntensity": 5.2,
        "isVerified": true
      }
    ],
    "total": 150,
    "verifiedClusters": 3
  }
}
```

### POST /api/reports
**Request Body:**
```json
{
  "latitude": -6.1751,
  "longitude": 106.8650,
  "intensity_level": 5,
  "location_name": "Jakarta Pusat",
  "description": "Getaran terasa kuat, benda jatuh" (optional)
}
```

---

## Customization

### Change Verification Threshold
Edit `/lib/clustering-service.ts`:
```typescript
// Line: Ubah angka 20 menjadi threshold yang diinginkan
isVerified: cluster.length >= 20  // Change to 15, 30, etc.
```

### Change Clustering Radius
Edit `/hooks/use-reports.ts`:
```typescript
// Default: 50 km
const { data: reportsData } = useReports(50, 30000);
// Change first parameter: useReports(75, 30000) for 75km
```

### Change Auto-Refresh Interval
Edit `/hooks/use-reports.ts`:
```typescript
// Default: 30000 ms (30 seconds)
const { data: reportsData } = useReports(50, 30000);
// Change second parameter: useReports(50, 60000) for 60s refresh
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No clusters showing | Check if reports exist in last 24 hours |
| GPS not accurate | Click "Perbarui GPS" button on form |
| Supabase error | Check SUPABASE_URL and SERVICE_ROLE_KEY |
| Alert not showing | Ensure cluster has 20+ reports |
| Data not refreshing | Check browser console for fetch errors |

---

## Files Reference

```
Core Logic:
├── lib/clustering-service.ts           → Clustering algorithm
├── lib/bmkg-api.ts                    → BMKG data fetching
├── hooks/use-reports.ts               → Reports hook

API:
├── app/api/reports/route.ts           → Backend endpoints

Components:
├── components/earthquake-clusters-map.tsx     → Main UI
├── components/verified-cluster-alert.tsx      → Toast alerts
├── components/report-earthquake-form.tsx      → Form

Pages:
└── app/page.tsx                       → Main page with tab

Documentation:
├── CLUSTERING_FEATURE.md              → Detailed feature doc
└── CLUSTERING_IMPLEMENTATION_SUMMARY.md → Technical summary
```

---

## Example Scenarios

### Scenario 1: Single User Reports
```
User A lapor gempa level 5 di Jakarta
→ 1 report dalam system
→ No cluster (need min 3)
```

### Scenario 2: Small Group
```
3 users report di Jakarta area dalam 50km
→ Cluster terbentuk (3 reports)
→ Level: LOW (blue)
→ No alert
```

### Scenario 3: Significant Activity
```
15 users report di Jakarta area
→ Cluster exists (15 reports)
→ Level: HIGH (orange)
→ No alert (need 20+)
```

### Scenario 4: Verified Earthquake
```
25 users report di Jakarta area
→ Cluster exists (25 reports)
→ Level: CRITICAL (red) ✓ VERIFIED
→ Alert notification triggered!
```

---

## Performance Notes

**Current Design:**
- O(n²) clustering algorithm
- Works well for 1000s of reports
- 30-second refresh rate

**Optimization (if needed):**
- Add spatial indexing (PostGIS)
- Implement K-means for large datasets
- Client-side caching
- WebWorker processing

---

## Support & Feedback

- Check console logs: `[v0] ...` messages
- Review error messages di UI
- Check `/CLUSTERING_FEATURE.md` untuk detail lebih
- Contact admin untuk database issues

---

**Last Updated**: February 3, 2026
**Version**: 1.0 - Production Ready
