# Database Setup Guide - Earthquake Reports Table

Aplikasi ini memiliki fitur clustering laporan gempa yang memerlukan tabel `earthquake_reports` di Supabase. Ikuti langkah-langkah berikut untuk setup database:

## Option 1: Menggunakan SQL Editor (Rekomendasi)

### Step 1: Buka Supabase Dashboard
1. Kunjungi [https://supabase.com](https://supabase.com)
2. Login ke project Anda
3. Pilih project: "Earthquake notification app"

### Step 2: Buka SQL Editor
1. Di sidebar kiri, klik **SQL Editor**
2. Klik tombol **+ New Query**

### Step 3: Copy dan Jalankan SQL Script
Copy script berikut dan paste ke SQL editor:

```sql
-- Create earthquake_reports table without user_id requirement for public reporting
CREATE TABLE IF NOT EXISTS earthquake_reports (
  id BIGSERIAL PRIMARY KEY,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  intensity_level INTEGER NOT NULL CHECK (intensity_level >= 1 AND intensity_level <= 9),
  description TEXT,
  location_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index untuk better query performance
CREATE INDEX IF NOT EXISTS idx_earthquake_reports_created_at ON earthquake_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_earthquake_reports_location ON earthquake_reports(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE earthquake_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy - Allow public to view all reports
CREATE POLICY "Anyone can view reports" ON earthquake_reports
  FOR SELECT USING (TRUE);

-- Create RLS Policy - Allow public to insert reports
CREATE POLICY "Anyone can submit reports" ON earthquake_reports
  FOR INSERT WITH CHECK (TRUE);

-- Grant permissions
GRANT SELECT, INSERT ON earthquake_reports TO anon, authenticated;
```

### Step 4: Jalankan Query
1. Klik tombol **Run** (atau Ctrl+Enter)
2. Tunggu hingga selesai
3. Anda akan melihat pesan sukses jika berhasil

## Option 2: Menggunakan Supabase CLI

Jika Anda sudah install Supabase CLI:

```bash
# Buat migration file baru
supabase migration new create_earthquake_reports

# Edit file di supabase/migrations/[timestamp]_create_earthquake_reports.sql
# Paste script di atas

# Apply migration
supabase db push
```

## Verifikasi Setup

Setelah menjalankan script, verifikasi table sudah dibuat:

1. Di Supabase Dashboard, klik **Table Editor**
2. Anda seharusnya bisa melihat tabel `earthquake_reports` di daftar table
3. Klik tabel untuk melihat strukturnya

## Troubleshooting

### Error: "PGError: permission denied for schema public"
- Pastikan Anda menggunakan service role key atau authenticated user dengan proper permissions
- Coba jalankan script di authenticated session

### Error: "Could not find the table"
- Table belum dibuat atau migration belum dijalankan
- Ikuti langkah setup di atas
- Refresh halaman aplikasi setelah membuat table

### Query tidak berjalan
- Pastikan syntax SQL benar
- Cek error message di Supabase dashboard
- Verify Supabase project credentials di `.env.local`

## Setelah Setup

Setelah table dibuat:

1. Refresh halaman aplikasi
2. Coba submit laporan gempa di tab "Laporan Gempa"
3. Laporan akan disimpan ke database Supabase
4. Clustering akan otomatis bekerja untuk mendeteksi 20+ reports dalam radius 50km

## Bantuan Lebih Lanjut

Jika mengalami masalah:
- Cek dokumentasi Supabase: https://supabase.com/docs
- Buka Supabase Dashboard dan lihat Logs untuk error details
- Pastikan environment variables sudah benar (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dll)
