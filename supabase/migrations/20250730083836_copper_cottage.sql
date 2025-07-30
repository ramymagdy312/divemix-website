/*
  # Remove News Section

  1. Drop news table and related policies
  2. Clean up any references to news

  This migration removes the news functionality completely from the database.
*/

-- Drop the news table and all related policies
DROP TABLE IF EXISTS news CASCADE;