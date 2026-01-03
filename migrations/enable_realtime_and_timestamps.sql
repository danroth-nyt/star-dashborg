-- Migration: Enable Realtime and Add Timestamps for Conflict Resolution
-- Run this in Supabase SQL Editor

-- Step 1: Check which tables already have realtime enabled
-- Run this first to see what you need:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Step 2: Enable realtime for tables (skip if already member)
-- Uncomment and run only the lines for tables NOT already in publication:

-- ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE characters;
-- ALTER PUBLICATION supabase_realtime ADD TABLE rooms;

-- Step 3: Add updated_at columns for optimistic locking (safe to run)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE characters ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 4: Create trigger function to auto-update timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create triggers (idempotent with DROP IF EXISTS)
DROP TRIGGER IF EXISTS sessions_updated_at ON sessions;
CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS characters_updated_at ON characters;
CREATE TRIGGER characters_updated_at BEFORE UPDATE ON characters
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Verification queries:
-- Check realtime is enabled:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Check columns were added:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name IN ('sessions', 'characters') AND column_name = 'updated_at';

-- Check triggers exist:
-- SELECT trigger_name, event_manipulation, event_object_table 
-- FROM information_schema.triggers 
-- WHERE trigger_name LIKE '%updated_at%';
