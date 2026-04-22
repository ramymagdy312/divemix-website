/*
  # Optional cleanup: retire legacy categories table

  Drops legacy `categories` only when safe:
  - `product_categories` exists
  - `categories` has no rows
*/
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'product_categories'
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'categories'
    ) THEN
      IF (SELECT COUNT(*) FROM public.categories) = 0 THEN
        DROP TABLE public.categories;
      END IF;
    END IF;
  END IF;
END $$;
