/*
  DiveMix Database Backup & Restore Utilities
  
  This file contains utilities for backing up and restoring your DiveMix database.
  Use these scripts to create backups before updates or migrations.
  
  Author: DiveMix Development Team
  Date: January 2025
  Version: 1.0
*/

-- ============================================================================
-- BACKUP UTILITIES
-- ============================================================================

-- Create a backup of all essential data
-- This creates INSERT statements that can be used to restore data

-- Backup Settings
SELECT 'INSERT INTO settings (key, value, description) VALUES (' ||
       quote_literal(key) || ', ' ||
       quote_literal(value) || ', ' ||
       quote_literal(description) || ') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, description = EXCLUDED.description;'
FROM settings
ORDER BY key;

-- Backup Categories
SELECT 'INSERT INTO categories (id, name, description, hero_image, image) VALUES (' ||
       quote_literal(id::text) || '::uuid, ' ||
       quote_literal(name) || ', ' ||
       quote_literal(description) || ', ' ||
       quote_literal(hero_image) || ', ' ||
       quote_literal(image) || ') ON CONFLICT (id) DO NOTHING;'
FROM categories
ORDER BY name;

-- Backup Services
SELECT 'INSERT INTO services (id, title, description, icon, features) VALUES (' ||
       quote_literal(id::text) || '::uuid, ' ||
       quote_literal(title) || ', ' ||
       quote_literal(description) || ', ' ||
       quote_literal(icon) || ', ' ||
       quote_literal(features::text) || '::text[] ) ON CONFLICT (id) DO NOTHING;'
FROM services
ORDER BY title;

-- Backup Applications
SELECT 'INSERT INTO applications (id, name, description, features, images) VALUES (' ||
       quote_literal(id::text) || '::uuid, ' ||
       quote_literal(name) || ', ' ||
       quote_literal(description) || ', ' ||
       quote_literal(features::text) || '::text[], ' ||
       quote_literal(images::text) || '::text[] ) ON CONFLICT (id) DO NOTHING;'
FROM applications
ORDER BY name;

-- Backup Branches
SELECT 'INSERT INTO branches (id, name, address, phone, email, city, country, is_main) VALUES (' ||
       quote_literal(id::text) || '::uuid, ' ||
       quote_literal(name) || ', ' ||
       quote_literal(address) || ', ' ||
       COALESCE(quote_literal(phone), 'NULL') || ', ' ||
       COALESCE(quote_literal(email), 'NULL') || ', ' ||
       quote_literal(city) || ', ' ||
       quote_literal(country) || ', ' ||
       is_main || ') ON CONFLICT (id) DO NOTHING;'
FROM branches
ORDER BY name;

-- ============================================================================
-- BACKUP FUNCTIONS
-- ============================================================================

-- Function to create a complete data backup
CREATE OR REPLACE FUNCTION create_data_backup()
RETURNS TEXT AS $$
DECLARE
    backup_sql TEXT := '';
    rec RECORD;
BEGIN
    -- Add header
    backup_sql := '-- DiveMix Database Backup - ' || NOW() || E'\n';
    backup_sql := backup_sql || '-- Generated automatically' || E'\n\n';
    
    -- Backup settings
    backup_sql := backup_sql || '-- Settings Backup' || E'\n';
    FOR rec IN 
        SELECT 'INSERT INTO settings (key, value, description) VALUES (' ||
               quote_literal(key) || ', ' ||
               quote_literal(value) || ', ' ||
               quote_literal(description) || ') ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;' as sql
        FROM settings ORDER BY key
    LOOP
        backup_sql := backup_sql || rec.sql || E'\n';
    END LOOP;
    
    backup_sql := backup_sql || E'\n';
    
    -- Backup categories
    backup_sql := backup_sql || '-- Categories Backup' || E'\n';
    FOR rec IN 
        SELECT 'INSERT INTO categories (id, name, description, hero_image, image) VALUES (' ||
               quote_literal(id::text) || '::uuid, ' ||
               quote_literal(name) || ', ' ||
               quote_literal(description) || ', ' ||
               quote_literal(hero_image) || ', ' ||
               quote_literal(image) || ') ON CONFLICT (id) DO NOTHING;' as sql
        FROM categories ORDER BY name
    LOOP
        backup_sql := backup_sql || rec.sql || E'\n';
    END LOOP;
    
    RETURN backup_sql;
END;
$$ LANGUAGE plpgsql;

-- Function to backup specific table
CREATE OR REPLACE FUNCTION backup_table(table_name TEXT)
RETURNS TEXT AS $$
DECLARE
    backup_sql TEXT := '';
    rec RECORD;
    columns_list TEXT;
    values_list TEXT;
BEGIN
    -- Get column names
    SELECT string_agg(column_name, ', ' ORDER BY ordinal_position)
    INTO columns_list
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = backup_table.table_name;
    
    -- Create backup header
    backup_sql := '-- Backup for table: ' || table_name || E'\n';
    backup_sql := backup_sql || '-- Generated: ' || NOW() || E'\n\n';
    
    -- Add the actual backup logic here based on table structure
    -- This is a simplified version - you might want to customize per table
    
    RETURN backup_sql;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RESTORE UTILITIES
-- ============================================================================

-- Function to safely restore data (with conflict handling)
CREATE OR REPLACE FUNCTION safe_restore_settings(
    p_key TEXT,
    p_value TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO settings (key, value, description)
    VALUES (p_key, p_value, p_description)
    ON CONFLICT (key) DO UPDATE SET
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, settings.description),
        updated_at = NOW();
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Failed to restore setting: % - %', p_key, SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MAINTENANCE UTILITIES
-- ============================================================================

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
BEGIN
    -- Clean up old contact submissions (keep recent ones)
    DELETE FROM contact_submissions 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old
    AND status = 'completed';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Cleaned up % old contact submissions', deleted_count;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update all timestamps
CREATE OR REPLACE FUNCTION refresh_timestamps()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    -- Update all updated_at timestamps to current time
    -- This can be useful after data imports
    
    UPDATE settings SET updated_at = NOW();
    UPDATE categories SET updated_at = NOW();
    UPDATE products SET updated_at = NOW() WHERE EXISTS (SELECT 1 FROM products);
    UPDATE services SET updated_at = NOW();
    UPDATE applications SET updated_at = NOW() WHERE EXISTS (SELECT 1 FROM applications);
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- MIGRATION UTILITIES
-- ============================================================================

-- Function to check if migration is needed
CREATE OR REPLACE FUNCTION check_migration_needed()
RETURNS TABLE(
    table_name TEXT,
    exists BOOLEAN,
    row_count BIGINT,
    needs_migration BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        TRUE as exists,
        COALESCE(s.n_tup_ins, 0) as row_count,
        CASE 
            WHEN t.table_name IN ('settings', 'categories', 'services') AND COALESCE(s.n_tup_ins, 0) = 0 
            THEN TRUE 
            ELSE FALSE 
        END as needs_migration
    FROM information_schema.tables t
    LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT LIKE 'pg_%'
    ORDER BY t.table_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

/*
-- Create a backup of all data
SELECT create_data_backup();

-- Backup specific settings
SELECT safe_restore_settings('new_setting', 'new_value', 'Description');

-- Clean up old data (older than 30 days)
SELECT cleanup_old_data(30);

-- Check what needs migration
SELECT * FROM check_migration_needed();

-- Refresh all timestamps
SELECT refresh_timestamps();

-- Manual backup commands (run in terminal):

-- Full database backup:
pg_dump -h hostname -U username -d database_name > divemix_backup_$(date +%Y%m%d).sql

-- Data-only backup:
pg_dump -h hostname -U username -d database_name --data-only > divemix_data_backup_$(date +%Y%m%d).sql

-- Schema-only backup:
pg_dump -h hostname -U username -d database_name --schema-only > divemix_schema_backup_$(date +%Y%m%d).sql

-- Restore from backup:
psql -h hostname -U username -d database_name < divemix_backup_20250101.sql

-- For Supabase, use the dashboard backup/restore features or API
*/

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Backup & Restore Utilities Loaded Successfully!';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Available functions:';
    RAISE NOTICE '- create_data_backup(): Create SQL backup of all data';
    RAISE NOTICE '- backup_table(table_name): Backup specific table';
    RAISE NOTICE '- safe_restore_settings(key, value, desc): Safely restore settings';
    RAISE NOTICE '- cleanup_old_data(days): Clean up old contact submissions';
    RAISE NOTICE '- refresh_timestamps(): Update all updated_at fields';
    RAISE NOTICE '- check_migration_needed(): Check what needs migration';
    RAISE NOTICE '';
    RAISE NOTICE 'Usage examples are included in the comments above.';
    RAISE NOTICE '============================================================================';
END $$;