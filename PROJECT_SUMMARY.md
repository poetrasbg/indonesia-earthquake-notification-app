# IndonesiaEarth - Project Summary

## Project Overview

**IndonesiaEarth** adalah website komprehensif untuk informasi gempa bumi Indonesia yang menyediakan:
- Dashboard gempa real-time dengan data BMKG
- Sistem pelaporan getaran gempa dari pengguna
- Notifikasi berbasis geolocation dengan popup dan suara alarm
- Interface modern dan responsif untuk desktop & mobile

Aplikasi dibangun dengan teknologi modern (Next.js, React, TypeScript) dan terintegrasi dengan Supabase untuk penyimpanan data.

## Key Features Implemented

### 1. Dashboard Gempa Real-Time
- Menampilkan gempa terbaru dari API BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
- Auto-refresh setiap 30 detik
- Informasi lengkap: magnitude, kedalaman, lokasi, waktu
- Estimasi intensitas berdasarkan magnitude dan kedalaman (1-9 MMI scale)
- Jarak automatic dari lokasi user ke epicenter gempa
- Statistik gempa: rata-rata magnitude, kedalaman rata-rata, gempa terdekat

### 2. Sistem Pelaporan Gempa
- Form untuk melaporkan getaran gempa yang dirasakan
- Picker untuk intensitas gempa (1-9 MMI scale) dengan visualisasi warna
- Input lokasi pengguna (otomatis dari GPS)
- Deskripsi getaran gempa (opsional)
- Validasi input lengkap di server
- Response success/error yang user-friendly

### 3. Notifikasi Berbasis Lokasi GPS
- Setup multiple notification zones dengan radius 5-500 km
- Filter berdasarkan intensitas minimum (1-9)
- Toggle untuk popup notification dan/atau sound alarm
- Real-time checking ketika gempa terbaru tersedia
- List dan management semua active notification settings
- Delete notification settings yang tidak lagi diperlukan

### 4. Sound Alarm Notification
- Web Audio API untuk generate alarm elektronik
- Frekuensi modulasi (880Hz dan 440Hz) untuk audio yang attention-grabbing
- LFO (Low Frequency Oscillator) untuk vibrato effect
- Duration 5 detik dengan exponential fade-out
- Cukup keras dan dapat didengar dengan jelas

### 5. Browser Notification
- Popup notification dengan icon dan deskripsi
- Requires interaction flag untuk persistent notification
- Automatic permission request handling
- Graceful fallback jika tidak tersupport

### 6. Geolocation Integration
- Automatic geolocation detection on page load
- High accuracy positioning
- Error handling dengan user-friendly messages
- Location caching untuk privacy dan performa
- Works on both desktop dan mobile

## Architecture & Components

### Frontend Components

```
components/
├── earthquake-card.tsx          # Single earthquake card display
├── earthquake-list.tsx          # List with auto-refresh
├── earthquake-monitor.tsx       # Real-time monitoring engine
├── earthquake-stats.tsx         # Statistics visualization
├── intensity-scale.tsx          # MMI scale picker & visualizer
├── report-earthquake-form.tsx   # User report form
├── notification-settings.tsx    # Notification management UI
├── header.tsx                   # Responsive header
├── footer.tsx                   # Footer with links
└── safety-tips.tsx             # Earthquake safety guidelines
```

### Custom Hooks

```
hooks/
├── use-geolocation.ts          # Geolocation detection
└── use-earthquake-monitor.ts   # Real-time earthquake checking
```

### Utility Functions

```
lib/
├── bmkg-api.ts                 # BMKG API integration
└── notification-service.ts     # Sound & notification logic
```

### API Routes

```
app/api/
├── reports/
│   └── route.ts               # POST: Create report, GET: List reports
└── notification-settings/
    ├── route.ts              # POST: Create, GET: List settings
    └── [id]/route.ts         # DELETE: Remove, PUT: Update setting
```

## Database Schema

### Users Table
- id (UUID, PK)
- username (TEXT, UNIQUE)
- email (TEXT, UNIQUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Earthquake Reports Table
- id (UUID, PK)
- user_id (UUID, FK)
- latitude (DECIMAL)
- longitude (DECIMAL)
- intensity_level (INTEGER, 1-9)
- description (TEXT)
- location_name (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Notification Settings Table
- id (UUID, PK)
- user_id (UUID, FK)
- latitude (DECIMAL)
- longitude (DECIMAL)
- radius_km (INTEGER)
- min_intensity_level (INTEGER)
- notification_enabled (BOOLEAN)
- sound_enabled (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Activity Logs Table
- id (UUID, PK)
- user_id (UUID, FK)
- action (TEXT)
- details (JSONB)
- created_at (TIMESTAMP)

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

### Backend
- **Server**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (prepared for future)
- **API Integration**: BMKG GitHub API

### Browser APIs
- **Geolocation API**: For user location detection
- **Web Notifications API**: For popup alerts
- **Web Audio API**: For sound alarm generation
- **LocalStorage**: For optional client-side caching

## Color Scheme

### Primary Colors
- **Primary**: Red/Orange (#ef4444) - For alerts and main actions
- **Accent**: Orange (#ea580c) - For highlights
- **Destructive**: Red (#dc2626) - For warnings

### Neutral Colors
- **Background**: Off-white (#fafafa)
- **Card**: White (#ffffff)
- **Foreground**: Dark gray (#1f2937)
- **Muted**: Light gray (#d1d5db)

### Intensity Level Colors
- Level 1-2: Green (bg-green-500, bg-green-400)
- Level 3-4: Yellow (bg-yellow-300, bg-yellow-500)
- Level 5-6: Orange (bg-orange-400, bg-orange-500)
- Level 7-8: Red (bg-red-500, bg-red-700)
- Level 9: Dark Red (bg-red-900)

## Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - 2 column layout
- **Desktop**: > 1024px - 3 column layout (main + sidebar)

### Key Responsive Features
- Flexible grid system
- Mobile-first approach
- Touch-friendly button sizes
- Readable font sizes on all devices
- Proper spacing and padding

## Performance Optimizations

### Implemented
- Image optimization with next/image
- CSS-in-JS optimization
- Component-level code splitting
- Efficient state management with React hooks
- Debounced notification checking
- 30-second auto-refresh interval

### Recommended
- Service Worker for offline support
- Lazy loading for below-the-fold content
- Image compression
- CDN for static assets
- Database query optimization

## Security Features

### Implemented
- Row Level Security (RLS) policies in Supabase
- Server-side input validation
- CORS configuration
- Parameterized queries (via Supabase)
- Secure geolocation handling (user permission required)

### Recommended for Production
- Rate limiting on API endpoints
- CSRF protection
- Content Security Policy (CSP)
- HTTPS enforcement
- Regular dependency updates
- Security headers

## Known Limitations & Future Work

### Phase 1 (Current)
- Basic CRUD for reports and settings
- No user authentication (next phase)
- No historical data persistence (on roadmap)
- No interactive map visualization
- No community features

### Phase 2 (Planned)
- Supabase authentication integration
- User profile management
- Historical earthquake data queries
- Google Maps integration
- Community chat per region

### Phase 3 (Future)
- Machine learning intensity prediction
- IoT sensor integration
- Live streaming capabilities
- Push notifications with FCM
- Mobile app (React Native)
- Multi-language support

## File Structure

```
earthquakes-app/
├── /app                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main dashboard page
│   ├── globals.css              # Global styles & theme
│   └── /api                     # API routes
├── /components                  # React components
├── /hooks                       # Custom React hooks
├── /lib                         # Utility functions
├── /types                       # TypeScript types
├── /scripts                     # Database scripts
├── /public                      # Static assets
├── README.md                    # Main documentation
├── INSTALLATION.md              # Installation guide
├── TESTING.md                   # Testing guide
├── PROJECT_SUMMARY.md           # This file
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
├── next.config.mjs             # Next.js config
└── tailwind.config.js          # Tailwind config
```

## Getting Started

### Prerequisites
- Node.js 18+ with npm
- Supabase account
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Quick Setup
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### With Supabase
1. Create Supabase project
2. Run database setup script
3. Add environment variables to `.env.local`
4. Restart dev server

See INSTALLATION.md for detailed instructions.

## Testing & Quality Assurance

### Test Coverage
- Manual testing checklist (see TESTING.md)
- Unit tests (ready to implement)
- Integration tests (ready to implement)
- E2E tests (ready to implement)

### Browser Support
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android Chrome)

### Performance Targets
- Page load: < 3 seconds
- API response: < 500ms
- Sound latency: < 200ms
- Notification delay: < 1 second

## Deployment

### Recommended
- **Hosting**: Vercel (auto-scaling, built for Next.js)
- **Database**: Supabase (serverless PostgreSQL)
- **CDN**: Vercel Edge Network or Cloudflare

### Quick Deploy
```bash
npm run build
npm run start
# Or deploy to Vercel
vercel
```

## Maintenance

### Regular Tasks
- Monitor API response times
- Check error logs
- Update dependencies monthly
- Review user feedback
- Optimize database queries

### Monitoring
- Use Vercel Analytics
- Setup error tracking (Sentry)
- Monitor database performance
- Track real user metrics (RUM)

## Support & Contact

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@indonesiaearth.id
- **Documentation**: README.md, INSTALLATION.md, TESTING.md

## License

MIT License - Free for personal and commercial use with attribution.

## Acknowledgments

- BMKG for earthquake data API
- Vercel for Next.js and deployment platform
- shadcn/ui for beautiful components
- Supabase for serverless database
- React and TypeScript communities

---

**Last Updated**: 2024
**Project Status**: Fully functional for Phase 1
**Next Review**: After Phase 2 implementation
