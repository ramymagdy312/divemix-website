-- Restructure categories and products for hierarchical structure: Category > Subcategory > Product

-- Add subcategory_id column to products table
ALTER TABLE products ADD COLUMN subcategory_id UUID REFERENCES product_categories(id);

-- Create default subcategories for each main category
INSERT INTO product_categories (name, description, slug, parent_id, is_active, display_order)
SELECT
  c.name || ' Products' as name,
  'Products under ' || c.name as description,
  LOWER(REPLACE(REPLACE(REPLACE(c.slug || '-products', ' ', '-'), '&', 'and'), '.', '')) as slug,
  c.id as parent_id,
  true as is_active,
  1 as display_order
FROM product_categories c
WHERE c.parent_id IS NULL;

-- Update products to link to their new subcategories
UPDATE products
SET subcategory_id = sub.id
FROM product_categories sub
JOIN product_categories c ON c.id = sub.parent_id
WHERE products.category_id = c.id
  AND sub.name = c.name || ' Products';

-- Remove the old category_id column from products
ALTER TABLE products DROP COLUMN category_id;