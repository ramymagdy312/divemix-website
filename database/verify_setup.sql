/*
  DiveMix Database Verification Script
  
  Run this script after database setup to verify everything is working correctly.
  This will check tables, data, policies, and provide a comprehensive report.
  
  Author: DiveMix Development Team
  Date: January 2025
  Version: 1.0
*/

-- ============================================================================
-- DATABASE VERIFICATION SCRIPT
-- ============================================================================

DO $$
DECLARE
    table_count INTEGER;
    settings_count INTEGER;
    categories_count INTEGER;
    products_count INTEGER;
    services_count INTEGER;
    applications_count INTEGER;
    branches_count INTEGER;
    rls_enabled_count INTEGER;
    policies_count INTEGER;
    indexes_count INTEGER;
    triggers_count INTEGER;
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'DiveMix Database Verification Report';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '';

    -- Check table existence
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
        AND table_name IN (
            'settings', 'vendors', 'contact_submissions', 'categories', 
            'products', 'services', 'applications', 'gallery_images', 
            'gallery_categories', 'branches'
        );
    
    RAISE NOTICE '📊 TABLE VERIFICATION:';
    RAISE NOTICE '  Core tables found: % / 10', table_count;
    
    IF table_count >= 7 THEN
        RAISE NOTICE '  ✅ Essential tables present';
    ELSE
        RAISE NOTICE '  ❌ Missing essential tables';
    END IF;
    RAISE NOTICE '';

    -- Check data counts
    SELECT COUNT(*) INTO settings_count FROM settings;
    SELECT COUNT(*) INTO categories_count FROM categories;
    SELECT COUNT(*) INTO services_count FROM services;
    SELECT COUNT(*) INTO branches_count FROM branches;
    
    RAISE NOTICE '📈 DATA VERIFICATION:';
    RAISE NOTICE '  Settings entries: %', settings_count;
    RAISE NOTICE '  Categories: %', categories_count;
    RAISE NOTICE '  Services: %', services_count;
    RAISE NOTICE '  Branches: %', branches_count;
    
    -- Check if products table exists and count
    BEGIN
        SELECT COUNT(*) INTO products_count FROM products;
        RAISE NOTICE '  Products: %', products_count;
    EXCEPTION
        WHEN undefined_table THEN
            products_count := 0;
            RAISE NOTICE '  Products: Table not found';
    END;
    
    -- Check if applications table exists and count
    BEGIN
        SELECT COUNT(*) INTO applications_count FROM applications;
        RAISE NOTICE '  Applications: %', applications_count;
    EXCEPTION
        WHEN undefined_table THEN
            applications_count := 0;
            RAISE NOTICE '  Applications: Table not found';
    END;
    
    RAISE NOTICE '';

    -- Check RLS status
    SELECT COUNT(*) INTO rls_enabled_count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
        AND c.relname IN ('settings', 'categories', 'products', 'services', 'applications', 'branches')
        AND c.relrowsecurity = true;
    
    RAISE NOTICE '🔐 SECURITY VERIFICATION:';
    RAISE NOTICE '  Tables with RLS enabled: %', rls_enabled_count;
    
    -- Check policies
    SELECT COUNT(*) INTO policies_count
    FROM pg_policies
    WHERE schemaname = 'public';
    
    RAISE NOTICE '  Security policies: %', policies_count;
    
    IF rls_enabled_count >= 5 AND policies_count >= 10 THEN
        RAISE NOTICE '  ✅ Security properly configured';
    ELSE
        RAISE NOTICE '  ⚠️  Security may need attention';
    END IF;
    RAISE NOTICE '';

    -- Check indexes
    SELECT COUNT(*) INTO indexes_count
    FROM pg_indexes
    WHERE schemaname = 'public'
        AND indexname LIKE 'idx_%';
    
    RAISE NOTICE '⚡ PERFORMANCE VERIFICATION:';
    RAISE NOTICE '  Custom indexes: %', indexes_count;
    
    -- Check triggers
    SELECT COUNT(*) INTO triggers_count
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
        AND trigger_name LIKE '%updated_at%';
    
    RAISE NOTICE '  Update triggers: %', triggers_count;
    
    IF indexes_count >= 3 AND triggers_count >= 5 THEN
        RAISE NOTICE '  ✅ Performance optimizations in place';
    ELSE
        RAISE NOTICE '  ⚠️  Consider adding performance optimizations';
    END IF;
    RAISE NOTICE '';

    -- Overall assessment
    RAISE NOTICE '🎯 OVERALL ASSESSMENT:';
    
    IF table_count >= 7 AND settings_count >= 3 AND rls_enabled_count >= 5 THEN
        RAISE NOTICE '  ✅ Database setup is EXCELLENT';
        RAISE NOTICE '  🚀 Ready for production deployment';
    ELSIF table_count >= 5 AND settings_count >= 1 THEN
        RAISE NOTICE '  ✅ Database setup is GOOD';
        RAISE NOTICE '  🔧 Consider running complete setup for full features';
    ELSE
        RAISE NOTICE '  ❌ Database setup is INCOMPLETE';
        RAISE NOTICE '  🛠️  Please run the setup scripts';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================================================';
END $$;

-- ============================================================================
-- DETAILED VERIFICATION QUERIES
-- ============================================================================

-- Show all tables with row counts
SELECT 
    schemaname,
    tablename,
    n_tup_ins as "Rows Inserted",
    n_tup_upd as "Rows Updated",
    n_tup_del as "Rows Deleted"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Show RLS status for all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS Enabled",
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public' AND tablename = pg_stat_user_tables.tablename) as "Policies Count"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Show essential settings
SELECT 
    key,
    CASE 
        WHEN key LIKE '%password%' OR key LIKE '%secret%' OR key LIKE '%key%' THEN '[HIDDEN]'
        ELSE value 
    END as value,
    description
FROM settings 
WHERE key IN ('contact_email', 'whatsapp_number', 'company_name', 'company_tagline')
ORDER BY key;

-- Show category and product distribution
SELECT 
    c.name as "Category",
    COUNT(p.id) as "Products Count",
    CASE 
        WHEN COUNT(p.id) > 0 THEN '✅'
        ELSE '⚠️'
    END as "Status"
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY COUNT(p.id) DESC;

-- Show services summary
SELECT 
    title,
    CASE 
        WHEN array_length(features, 1) > 0 THEN '✅ Has Features'
        ELSE '⚠️ No Features'
    END as "Features Status",
    icon
FROM services
ORDER BY title;

-- Show recent activity (if any)
SELECT 
    'Settings' as "Table",
    COUNT(*) as "Records",
    MAX(created_at) as "Latest Entry"
FROM settings
UNION ALL
SELECT 
    'Categories' as "Table",
    COUNT(*) as "Records",
    MAX(created_at) as "Latest Entry"
FROM categories
UNION ALL
SELECT 
    'Services' as "Table",
    COUNT(*) as "Records",
    MAX(created_at) as "Latest Entry"
FROM services
ORDER BY "Latest Entry" DESC NULLS LAST;

-- Final status message
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🔍 VERIFICATION COMPLETE!';
    RAISE NOTICE '';
    RAISE NOTICE 'Review the results above to ensure your database is properly configured.';
    RAISE NOTICE 'If you see any issues, please run the appropriate setup script.';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Update your .env.local file with database credentials';
    RAISE NOTICE '2. Test your application: npm run dev';
    RAISE NOTICE '3. Access admin panel to manage content';
    RAISE NOTICE '';
    RAISE NOTICE 'Happy coding! 🚀';
END $$;