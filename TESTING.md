# IndonesiaEarth - Testing Guide

## Manual Testing Checklist

### 1. Geolocation Features
- [ ] Aplikasi meminta permission geolocation saat dibuka
- [ ] Lokasi user ditampilkan di banner hijau "Lokasi GPS Terdeteksi"
- [ ] Jika diizinkan, koordinat latitude/longitude terlihat
- [ ] Jika ditolak, tampil pesan error yang jelas

### 2. Dashboard Gempa
- [ ] Halaman dashboard menampilkan gempa terbaru dari BMKG
- [ ] Data gempa memuat dengan benar (magnitude, kedalaman, lokasi)
- [ ] Ada tombol refresh untuk update data manual
- [ ] Auto-refresh setiap 30 detik
- [ ] Estimasi intensitas gempa ditampilkan dengan warna yang sesuai
- [ ] Jarak dari lokasi user ke epicenter gempa terlihat
- [ ] Statistik gempa (rata-rata magnitude, kedalaman, dll) ditampilkan

### 3. Laporan Gempa
- [ ] Tab "Laporan Gempa" dapat diklik
- [ ] Halaman form terbuka dengan benar
- [ ] Form menampilkan lokasi GPS yang terdeteksi
- [ ] Intensity Scale component menampilkan 9 level dengan warna berbeda
- [ ] Memilih level intensitas menampilkan deskripsi yang sesuai
- [ ] Input nama lokasi wajib diisi
- [ ] Input deskripsi bersifat opsional
- [ ] Tombol "Kirim Laporan" mengirim data ke server
- [ ] Pesan sukses muncul setelah laporan dikirim
- [ ] Form direset setelah pengiriman

### 4. Notifikasi Settings
- [ ] Tab "Notifikasi" dapat diklik
- [ ] Menampilkan form untuk tambah notifikasi baru
- [ ] Input radius (KM) berfungsi dengan range 5-500 km
- [ ] Dropdown intensity level menampilkan semua 9 level
- [ ] Toggle untuk "Popup Notification" dan "Sound Alarm" bekerja
- [ ] Tombol "Tambah Pengaturan" menambah setting baru
- [ ] Pengaturan yang ditambah tampil di daftar "Pengaturan Aktif"
- [ ] Tombol hapus (trash icon) menghapus pengaturan dengan benar

### 5. Real-time Earthquake Monitoring
- [ ] Ketika gempa terdeteksi dalam radius dan intensitas yang sesuai:
  - [ ] Popup notification muncul (jika diaktifkan)
  - [ ] Suara alarm berbunyi (jika diaktifkan)
- [ ] Notification permission banner muncul saat pertama kali
- [ ] Tombol "Aktifkan" di notification banner membuka permission dialog
- [ ] Setelah diizinkan, banner notification hilang

### 6. Sound Alarm Testing
- [ ] Aktivkan sound di notification settings
- [ ] Tambah setting notifikasi dengan radius 100+ km
- [ ] Refresh data gempa
- [ ] Dengarkan suara alarm elektronik (frekuensi tinggi-rendah bergantian)
- [ ] Alarm berlangsung ~5 detik
- [ ] Volume cukup keras dan dapat didengar

### 7. UI/UX Testing

#### Responsiveness
- [ ] Desktop (1920px+): Layout 2 kolom
- [ ] Tablet (768-1920px): Grid responsif
- [ ] Mobile (< 768px): Single column, stacked vertically
- [ ] Header responsive di semua ukuran
- [ ] Footer readable dan proper spacing

#### Color & Contrast
- [ ] Warna red/orange untuk alert dan primary elements
- [ ] Intensity level colors sesuai dengan MMI scale
- [ ] Text contrast sufficient (AAA standard)
- [ ] Dark mode toggle berfungsi (jika ada)

#### Navigation
- [ ] Tab navigation berfungsi smooth
- [ ] Active tab indicator jelas
- [ ] Scroll behavior smooth
- [ ] Links ke BMKG terbuka di tab baru

### 8. Error Handling
- [ ] Jika API BMKG tidak tersedia, error message ditampilkan
- [ ] Form validation menampilkan error yang jelas
- [ ] Network errors ditangani dengan graceful
- [ ] Timeout requests ditangani dengan baik

### 9. Performance
- [ ] Halaman load time < 3 detik
- [ ] Images dan assets load dengan cepat
- [ ] No console errors atau warnings
- [ ] Auto-refresh tidak menyebabkan memory leak
- [ ] Sound alarm tidak mengganggu performa

### 10. Accessibility
- [ ] Keyboard navigation berfungsi
- [ ] Tab order logical
- [ ] ARIA labels present untuk form elements
- [ ] Alt text ada di images
- [ ] Screen reader compatible

## Automated Testing (Future)

### Unit Tests
- `calculateDistance()` function
- `estimateIntensity()` function
- Input validation functions
- Data transformation functions

### Integration Tests
- API route `/api/reports` POST
- API route `/api/notification-settings` POST/DELETE
- Geolocation hook
- Earthquake monitor hook

### E2E Tests
- Complete flow: Open app → Enable geolocation → View gempa → Report gempa → Add notification → Receive notification
- Error scenarios
- Edge cases

## Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Android
- [ ] Samsung Internet

## Load Testing
- Test dengan 1000+ earthquake reports
- Test dengan 100+ active notification settings
- Test concurrent users
- Monitor server response time

## Data Testing

### Test Cases
1. **Magnitude boundary**: Test dengan magnitude 0.1 dan 9.5
2. **Depth boundary**: Test dengan depth 0 km dan 600 km
3. **Latitude/Longitude**: Test dengan extreme coordinates
4. **Intensity Level**: Test semua 1-9 levels
5. **Radius**: Test dengan 5 km, 50 km, 500 km
6. **Time**: Test dengan various timestamps

## Safety Critical Testing
- Verify sound alarm volume is adequate
- Verify notification latency
- Verify all user locations are private (RLS working)
- Verify data integrity in database

## Known Issues & Limitations

### Phase 1
- Database integration placeholder (needs Supabase setup)
- No authentication system yet
- Historical reports not persisted
- Map visualization not implemented
- No social/community features

### Future Improvements
- Implement full Supabase integration
- Add user authentication (email/Google)
- Add interactive map with Google Maps API
- Add community chat per region
- Add earthquake prediction ML model
- Add push notifications
- Add multi-language support

## Test Environment Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000

# Run tests (when available)
npm run test
npm run test:e2e
```

## Debugging Tips

### Check Console
```javascript
// Monitor earthquake data
console.log("[v0] Earthquakes loaded:", earthquakes)

// Monitor notification triggers
console.log("[v0] Notification triggered:", settings)

// Monitor distance calculation
console.log("[v0] Distance calculated:", distance)
```

### DevTools
- Check Network tab untuk API calls
- Check Application → Cookies untuk notification permission
- Check Application → Local Storage untuk cached data
- Check Performance untuk bottlenecks

## Regression Testing Checklist
- [ ] All previous tests still pass
- [ ] No new console errors
- [ ] Performance metrics stable
- [ ] API response times acceptable
- [ ] UI visually consistent
