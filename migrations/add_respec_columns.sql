-- Migration: Add respec support columns to characters table
-- Description: Adds base_stats and base_hp_max columns to track original character values for respec functionality
-- Date: 2024-12-31

-- Add base_stats column (stores original rolled stats)
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS base_stats jsonb;

-- Add base_hp_max column (stores original HP max)
ALTER TABLE characters 
ADD COLUMN IF NOT EXISTS base_hp_max integer;

-- Update existing characters to use their current values as base values
-- This ensures legacy characters can still use the respec feature
UPDATE characters 
SET base_stats = stats 
WHERE base_stats IS NULL;

UPDATE characters 
SET base_hp_max = hp_max 
WHERE base_hp_max IS NULL;

-- Add helpful comment
COMMENT ON COLUMN characters.base_stats IS 'Original rolled stats at character creation, used for respec functionality';
COMMENT ON COLUMN characters.base_hp_max IS 'Original HP max at character creation, used for respec functionality';
