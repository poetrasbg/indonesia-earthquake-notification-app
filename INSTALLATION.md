# IndonesiaEarth - Installation Guide

## Quick Start

### Option 1: Using shadcn CLI (Recommended)

```bash
# Install shadcn CLI
npx shadcn-cli@latest init

# Select options:
# Project name: earthquakes-app
# TypeScript: Yes
# Tailwind CSS: Yes
# Next.js: Yes
# Base color: Red
# CSS variables: Yes

# Clone or download the project
git clone <repository>
cd earthquakes-app

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### Option 2: Manual Installation

```bash
# Create new Next.js project
npx create-next-app@latest earthquakes-app --typescript --tailwind

# Navigate to project
cd earthquakes-app

# Install additional dependencies
npm install lucide-react

# Copy project files
# (Copy all files from this repo into the project)

# Run development server
npm run dev
```

## Environment Setup

### 1. Supabase Setup (Required)

#### Create Supabase Project
1. Go to https://app.supabase.com
2. Sign up or login
3. Click "New Project"
4. Fill in project details
5. Wait for project initialization

#### Get API Keys
1. Go to Project Settings → API
2. Copy your `Project URL` and `anon public key`
3. Create `.env.local` file in project root

#### Setup Database

1. Go to SQL Editor in Supabase
2. Create new query
3. Copy & paste contents of `scripts/init-db.sql`
4. Click "Run" to execute

#### Create `.env.local`

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Replace:
- `your-project` with your actual Supabase project ID
- `eyJhbGc...` with actual keys from Supabase dashboard

### 2. Browser Permissions

Application requires:
- **Geolocation**: To detect user location
- **Notifications**: For earthquake alerts
- **Web Audio API**: For sound alarms

Users will be prompted to allow these permissions.

## Project Structure

```
earthquakes-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── api/
│       ├── reports/            # Earthquake reports API
│       │   └── route.ts
│       └── notification-settings/
│           ├── route.ts
│           └── [id]/
│               └── route.ts
├── components/
│   ├── earthquake-card.tsx     # Earthquake display card
│   ├── earthquake-list.tsx     # List of earthquakes
│   ├── earthquake-monitor.tsx  # Real-time monitoring
│   ├── earthquake-stats.tsx    # Statistics display
│   ├── intensity-scale.tsx     # MMI scale visualizer
│   ├── report-earthquake-form.tsx
│   ├── notification-settings.tsx
│   ├── header.tsx
│   ├── footer.tsx
│   └── safety-tips.tsx
├── hooks/
│   ├── use-geolocation.ts
│   └── use-earthquake-monitor.ts
├── lib/
│   ├── bmkg-api.ts            # BMKG API integration
│   └── notification-service.ts # Sound & notification logic
├── types/
│   └── earthquake.ts          # TypeScript types
├── scripts/
│   └── init-db.sql           # Database setup script
├── public/
│   └── earthquake-icon.jpg   # App icon
├── globals.css               # Global styles & theme
├── tailwind.config.js        # Tailwind configuration
└── package.json              # Dependencies
```

## Development Workflow

### Running the App

```bash
# Development server
npm run dev

# Production build
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

### Making Changes

1. **Add new earthquake endpoint**: Edit `/app/api/reports/route.ts`
2. **Update UI components**: Edit files in `/components/`
3. **Add new features**: Create new components and hooks
4. **Update styles**: Modify `/app/globals.css` or use Tailwind classes
5. **Change colors**: Update CSS variables in `globals.css`

### Testing Locally

```bash
# Test earthquake data loading
# Go to Dashboard tab and wait for auto-refresh

# Test geolocation
# Open DevTools → Application → Sensors → Geolocation
# Set custom coordinates and refresh

# Test notifications
# Add notification setting with current location
# Simulate earthquake by loading earthquake data
# Should trigger popup and sound

# Test form submission
# Go to "Laporan Gempa" tab
# Fill form and click "Kirim Laporan"
# Check network tab in DevTools to see POST request
```

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
# Go to Vercel dashboard → Settings → Environment Variables
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD npm run start
```

## Troubleshooting

### Issue: "Geolocation not available"
- Ensure app is served over HTTPS in production
- Check browser geolocation permission settings
- Try incognito/private browsing mode

### Issue: "BMKG API not responding"
- Check internet connection
- Verify BMKG API is online: https://github.com/bmkg-nusantara
- Check browser console for CORS errors

### Issue: "Database connection error"
- Verify Supabase URL and keys in `.env.local`
- Ensure Supabase project is active
- Check database schema matches init script

### Issue: "Notification not triggering"
- Verify notification permission is granted
- Check browser notification settings
- Ensure notification settings have been added
- Check browser console for errors

### Issue: "Sound not playing"
- Check browser audio permissions
- Increase system volume
- Try different browser (Chrome recommended)
- Clear browser cache

### Issue: "Page takes long to load"
- Clear browser cache
- Disable browser extensions
- Check network tab in DevTools
- Verify API responses are fast

## Security Considerations

### Before Production

1. **Enable HTTPS**: Always use HTTPS in production
2. **Rate Limiting**: Add rate limiting to API routes
3. **Input Validation**: Validate all user inputs on server
4. **CORS**: Configure CORS properly for your domain
5. **Database**: Use Supabase RLS policies (already configured)
6. **Secrets**: Never commit `.env.local` to version control
7. **Updates**: Keep dependencies updated (`npm audit`)

### Environment Variables

Never commit `.env.local` to Git:

```bash
# Add to .gitignore
.env.local
.env.*.local
```

## Performance Optimization

### Recommended
1. Enable Next.js Image Optimization
2. Use CDN for static assets
3. Enable database query caching
4. Implement pagination for reports list
5. Add service worker for offline support

### Monitoring
```bash
# Build analysis
npm run build --analyze

# Performance metrics
# Use Vercel Analytics or similar service
```

## Support & Documentation

- **BMKG API**: https://github.com/bmkg-nusantara
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## Next Steps

1. ✅ Clone repository
2. ✅ Setup Supabase
3. ✅ Configure environment variables
4. ✅ Run `npm install`
5. ✅ Run `npm run dev`
6. ✅ Test all features
7. ✅ Deploy to production

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE.md for details
