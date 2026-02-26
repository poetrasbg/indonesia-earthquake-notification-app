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

-- Create index for better query performance
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

GRANT SELECT, INSERT ON earthquake_reports TO anon, authenticated;
