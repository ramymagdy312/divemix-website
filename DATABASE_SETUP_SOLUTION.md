# 🔧 حل مشكلة الفئات - إعداد قاعدة البيانات

## 🚨 **المشكلة:**
الفئات تظهر من البيانات التجريبية وليس من قاعدة البيانات لأن جدول `product_categories` غير موجود.

## ✅ **الحل السريع:**

### **الخطوة 1: إنشاء الجداول في Supabase**

1. **اذهب إلى Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **افتح SQL Editor:**
   - اختر مشروعك
   - اذهب إلى SQL Editor
   - أنشئ Query جديد

3. **انسخ والصق هذا الكود:**

```sql
-- 🚀 إنشاء جداول المنتجات والفئات
-- انسخ هذا الكود كاملاً وشغله في Supabase SQL Editor

-- 1. إنشاء جدول الفئات
CREATE TABLE IF NOT EXISTS product_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. إنشاء جدول المنتجات (بدون أسعار)
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. إدراج فئات تجريبية
INSERT INTO product_categories (name, description, slug, image_url, is_active, display_order)
VALUES 
    ('Diving Equipment', 'Professional diving gear and equipment for all levels of divers', 'diving-equipment', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800', true, 1),
    ('Safety Gear', 'Essential safety equipment for underwater activities and diving', 'safety-gear', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', true, 2),
    ('Underwater Cameras', 'Capture your underwater adventures with professional cameras', 'underwater-cameras', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800', true, 3),
    ('Accessories', 'Essential accessories for diving and underwater activities', 'accessories', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', true, 4),
    ('Wetsuits & Gear', 'High-quality wetsuits and thermal protection gear', 'wetsuits-gear', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800', true, 5),
    ('Maintenance Tools', 'Tools and equipment for maintaining your diving gear', 'maintenance-tools', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800', true, 6)
ON CONFLICT (slug) DO NOTHING;

-- 4. إدراج منتجات تجريبية (بدون أسعار)
INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Professional Diving Mask',
    'High-quality diving mask with anti-fog technology and comfortable silicone skirt for crystal clear underwater vision',
    'Crystal clear vision underwater',
    pc.id,
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600'
    ],
    ARRAY['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens', 'Adjustable strap'],
    true,
    1
FROM product_categories pc WHERE pc.slug = 'diving-equipment'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, short_description, category_id, image_url, images, features, is_active, display_order)
SELECT 
    'Professional Diving Fins',
    'Lightweight and efficient diving fins designed for better propulsion and enhanced underwater mobility',
    'Enhanced underwater mobility',
    pc.id,
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
    ARRAY[
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800',
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=600'
    ],
    ARRAY['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket', 'Durable materials'],
    true,
    2
FROM product_categories pc WHERE pc.slug = 'diving-equipment'
ON CONFLICT DO NOTHING;

-- 5. تفعيل الأمان وإعداد الصلاحيات
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (is_active = true);

GRANT SELECT ON product_categories TO anon;
GRANT SELECT ON products TO anon;

-- 🎉 تم الإعداد بنجاح!
SELECT 'Database setup completed successfully!' as result;
```

### **الخطوة 2: تشغيل الكود**
1. **الصق الكود** في SQL Editor
2. **اضغط Run** أو Ctrl+Enter
3. **انتظر** حتى يكتمل التنفيذ
4. **تأكد من ظهور رسالة النجاح**

### **الخطوة 3: إعادة تشغيل التطبيق**
```bash
# أوقف التطبيق (Ctrl+C)
# ثم شغله مرة أخرى
npm run dev
```

### **الخطوة 4: اختبار النتيجة**
```
✅ http://localhost:3000/products/           # يجب أن تظهر الفئات من قاعدة البيانات
✅ http://localhost:3000/admin/categories    # يجب أن تظهر الفئات الحقيقية
✅ http://localhost:3000/admin/products/     # يجب أن تظهر المنتجات الحقيقية
```

## 🎯 **النتيجة المتوقعة:**

### **قبل الإصلاح:**
- ❌ الفئات من البيانات التجريبية
- ❌ رسالة "Demo Mode"
- ❌ لا يمكن إضافة أو تعديل الفئات

### **بعد الإصلاح:**
- ✅ الفئات من قاعدة البيانات الحقيقية
- ✅ لا توجد رسالة "Demo Mode"
- ✅ يمكن إضافة وتعديل الفئات
- ✅ يمكن إضافة وتعديل المنتجات
- ✅ رفع الصور يعمل بشكل مثالي

## 🔍 **للتحقق من نجاح الإعداد:**

### **1. تحقق من الجداول:**
```sql
-- شغل هذا في SQL Editor للتحقق
SELECT table_name, 
       (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('product_categories', 'products')
ORDER BY table_name;
```

### **2. تحقق من البيانات:**
```sql
-- تحقق من الفئات
SELECT id, name, slug, is_active FROM product_categories ORDER BY display_order;

-- تحقق من المنتجات
SELECT id, name, category_id FROM products ORDER BY display_order;
```

## 🚨 **إذا واجهت مشاكل:**

### **خطأ في الصلاحيات:**
```sql
-- شغل هذا لإصلاح الصلاحيات
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
```

### **خطأ في الجداول:**
```sql
-- احذف الجداول وأعد إنشاؤها
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
-- ثم شغل كود الإنشاء مرة أخرى
```

---

**🎉 بعد تطبيق هذه الخطوات، ستعمل جميع صفحات المنتجات والفئات من قاعدة البيانات الحقيقية!**