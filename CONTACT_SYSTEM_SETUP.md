# نظام الاتصال والفروع المحدث

## نظرة عامة
تم تطوير نظام شامل لإدارة صفحة الاتصال والفروع يتضمن:
- نموذج اتصال محسن مع إرسال البريد الإلكتروني
- خرائط تفاعلية لعرض مواقع الفروع باستخدام روابط Google Maps
- إدارة الفروع من لوحة التحكم مع إدخال روابط الخرائط مباشرة
- نظام إدارة رسائل الاتصال

## الملفات المضافة/المحدثة

### مكونات جديدة:
- `app/components/contact/EnhancedContactForm.tsx` - نموذج اتصال محسن
- `app/components/contact/BranchMap.tsx` - خريطة تفاعلية للفروع
- `app/components/admin/DraggableMap.tsx` - خريطة قابلة للسحب للإدارة

### صفحات إدارة:
- `app/admin/branches/page.tsx` - إدارة الفروع (جديد)
- `app/admin/contact-messages/page.tsx` - إدارة رسائل الاتصال (محدث)
- `app/admin/contact/page.tsx` - إدارة صفحة الاتصال (محدث مع خرائط)

### API Routes:
- `app/api/contact/route.ts` - إرسال رسائل الاتصال والبريد الإلكتروني
- `app/api/branches/route.ts` - إدارة الفروع

## إعداد قاعدة البيانات

### 1. إنشاء الجداول
قم بتشغيل الكود التالي في Supabase SQL Editor:

```sql
-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  working_hours JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  branch_id UUID REFERENCES branches(id),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for branches (public read, admin write)
CREATE POLICY "Allow public read access to active branches" ON branches
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow admin full access to branches" ON branches
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_messages (public insert, admin read)
CREATE POLICY "Allow public insert to contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin read access to contact_messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update contact_messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');
```

### 2. إدراج بيانات تجريبية للفروع

```sql
INSERT INTO branches (name, address, phone, email, latitude, longitude, working_hours, display_order) VALUES
('الفرع الرئيسي - القاهرة', 'شارع التحرير، وسط البلد، القاهرة، مصر', '+20123456789', 'cairo@divemix.com', 30.0444, 31.2357, '{"saturday": "9:00-18:00", "sunday": "9:00-18:00", "monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "closed"}', 1),
('فرع الإسكندرية', 'كورنيش الإسكندرية، الإسكندرية، مصر', '+20123456790', 'alexandria@divemix.com', 31.2001, 29.9187, '{"saturday": "9:00-18:00", "sunday": "9:00-18:00", "monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "closed"}', 2),
('فرع الغردقة', 'شارع الشيراتون، الغردقة، البحر الأحمر، مصر', '+20123456791', 'hurghada@divemix.com', 27.2579, 33.8116, '{"saturday": "8:00-20:00", "sunday": "8:00-20:00", "monday": "8:00-20:00", "tuesday": "8:00-20:00", "wednesday": "8:00-20:00", "thursday": "8:00-20:00", "friday": "8:00-20:00"}', 3);
```

## إعداد متغيرات البيئة

أضف المتغيرات التالية إلى `.env.local`:

```env
# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
SMTP_FROM=your-email@domain.com
CONTACT_EMAIL=contact@yourdomain.com

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## الحصول على Google Maps API Key

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعل Google Maps JavaScript API و Maps Embed API
4. أنشئ API Key جديد
5. قيد الـ API Key للنطاقات المسموحة

## الميزات

### 1. نموذج الاتصال المحسن
- حقول متعددة (الاسم، البريد، الهاتف، الموضوع، الرسالة)
- اختيار الفرع المطلوب
- إرسال تلقائي للبريد الإلكتروني
- حفظ الرسائل في قاعدة البيانات
- تصميم متجاوب وجذاب

### 2. الخرائط التفاعلية
- عرض جميع الفروع على الخريطة
- إمكانية التنقل بين الفروع
- عرض تفاصيل كل فرع (العنوان، الهاتف، البريد، ساعات العمل)
- روابط للحصول على الاتجاهات
- تصميم متجاوب

### 3. إدارة الفروع
- إضافة/تعديل/حذف الفروع من `/admin/contact/`
- إدخال روابط Google Maps مباشرة
- استخراج الإحداثيات تلقائياً من الروابط
- معاينة الخرائط مباشرة في لوحة التحكم
- إدارة ساعات العمل وتفاصيل الاتصال

### 4. إدارة رسائل الاتصال
- عرض جميع الرسائل الواردة
- تصنيف الرسائل (جديدة، مقروءة، تم الرد، مؤرشفة)
- إحصائيات شاملة
- إمكانية الرد المباشر عبر البريد الإلكتروني
- حذف الرسائل

## الاستخدام

### للمستخدمين:
1. اذهب إلى صفحة الاتصال
2. املأ نموذج الاتصال
3. اختر الفرع المناسب
4. استعرض مواقع الفروع على الخريطة
5. احصل على الاتجاهات للفرع المطلوب

### للإداريين:

#### إعداد البريد الإلكتروني:
1. اذهب إلى `/admin/settings/`
2. في قسم "Email Settings":
   - **Contact Email**: أدخل الإيميل الذي ستصل إليه رسائل الاتصال
   - **SMTP Host**: مثل `smtp.gmail.com`
   - **SMTP Port**: مثل `587`
   - **SMTP Username**: إيميل المرسل
   - **SMTP Password**: كلمة مرور التطبيق (App Password)
   - **SMTP From**: الإيميل الذي سيظهر كمرسل

#### إدارة الفروع والرسائل:
1. اذهب إلى لوحة التحكم `/admin`
2. لإدارة الفروع: `/admin/contact`
3. لإدارة الرسائل: `/admin/contact-messages`
4. أدخل روابط Google Maps مباشرة لكل فرع
5. الإحداثيات ستُستخرج تلقائياً من الروابط

## ملاحظات مهمة

1. **النظام الموحد**: النظام يعتمد على جدول `contact_page.branches` (JSON) فقط

2. **روابط Google Maps**: 
   - أدخل الرابط الكامل من Google Maps
   - سيتم استخراج الإحداثيات تلقائياً
   - مثال: `https://www.google.com/maps/place/DiveMix+%E2%80%93+Ltd.+Gas+%26+Compressors+Technologies/@27.2226321,33.7767091,17z/data=!3m1!4b1!4m6!3m5!1s0x14527d9c15b84c95:0xe51d5025d8a07230!8m2!3d27.2226274!4d33.779284!16s%2Fg%2F11ffm24hx_?entry=ttu&g_ep=EgoyMDI1MDczMC4wIKXMDSoASAFQAw%3D%3D`

3. **البريد الإلكتروني**: 
   - يتم إرسال الرسائل إلى الإيميل المحدد في `/admin/settings/` تحت "Email Settings"
   - يتم استخدام إعدادات SMTP من نفس الصفحة
   - إذا لم تكن الإعدادات محددة، سيتم استخدام متغيرات البيئة كبديل

4. **عرض الخرائط**: لا يتطلب Google Maps API Key للعرض العام

## استكشاف الأخطاء

### مشاكل شائعة:
1. **الخرائط لا تعمل**: تحقق من Google Maps API Key
2. **البريد لا يُرسل**: تحقق من إعدادات SMTP
3. **الفروع لا تظهر**: تحقق من وجود بيانات في الجداول
4. **أخطاء الأذونات**: تحقق من RLS policies

### سجلات الأخطاء:
- تحقق من console المتصفح للأخطاء الأمامية
- تحقق من سجلات Supabase للأخطاء الخلفية
- تحقق من سجلات Vercel/النشر للأخطاء العامة