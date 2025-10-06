-- Add parent_id to categories for hierarchical structure
ALTER TABLE product_categories ADD COLUMN parent_id uuid REFERENCES product_categories(id) ON DELETE CASCADE;


-- Add index for parent_id
CREATE INDEX idx_product_categories_parent_id ON product_categories(parent_id);

-- Add columns for hierarchical structure
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS features text[] DEFAULT '{}';
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Update policies for the renamed table
DROP POLICY IF EXISTS "Allow authenticated users to manage categories" ON product_categories;
DROP POLICY IF EXISTS "Allow public read access to categories" ON product_categories;

CREATE POLICY "Allow public read access to product_categories"
  ON product_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage product_categories"
  ON product_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update trigger
DROP TRIGGER IF EXISTS update_categories_updated_at ON product_categories;
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();