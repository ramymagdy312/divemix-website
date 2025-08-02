(()=>{var e={};e.id=3606,e.ids=[3606],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},78893:e=>{"use strict";e.exports=require("buffer")},84770:e=>{"use strict";e.exports=require("crypto")},17702:e=>{"use strict";e.exports=require("events")},32615:e=>{"use strict";e.exports=require("http")},35240:e=>{"use strict";e.exports=require("https")},98216:e=>{"use strict";e.exports=require("net")},68621:e=>{"use strict";e.exports=require("punycode")},76162:e=>{"use strict";e.exports=require("stream")},82452:e=>{"use strict";e.exports=require("tls")},17360:e=>{"use strict";e.exports=require("url")},71568:e=>{"use strict";e.exports=require("zlib")},58359:()=>{},93739:()=>{},40281:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>o.a,__next_app__:()=>p,originalPathname:()=>u,pages:()=>l,routeModule:()=>m,tree:()=>n}),s(83228),s(11506),s(35866);var r=s(23191),a=s(88716),i=s(37922),o=s.n(i),c=s(95231),d={};for(let e in c)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>c[e]);s.d(t,d);let n=["",{children:["check-products-database",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,83228)),"D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\check-products-database\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,11506)),"D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,35866,23)),"next/dist/client/components/not-found-error"]}],l=["D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\check-products-database\\page.tsx"],u="/check-products-database/page",p={require:s,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/check-products-database/page",pathname:"/check-products-database",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:n}})},55903:(e,t,s)=>{Promise.resolve().then(s.bind(s,73330))},72593:()=>{},29823:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,12994,23)),Promise.resolve().then(s.t.bind(s,96114,23)),Promise.resolve().then(s.t.bind(s,9727,23)),Promise.resolve().then(s.t.bind(s,79671,23)),Promise.resolve().then(s.t.bind(s,41868,23)),Promise.resolve().then(s.t.bind(s,84759,23))},73330:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});var r=s(10326),a=s(17577),i=s(99060);function o(){let[e,t]=(0,a.useState)(""),[s,o]=(0,a.useState)(!1),[c,d]=(0,a.useState)([]),[n,l]=(0,a.useState)(!1),u=async()=>{o(!0),t("\uD83D\uDD0D Checking Products database tables...\n\n");try{t(e=>e+"1. Checking product_categories table...\n");try{let{data:e,error:s}=await i.O.from("product_categories").select("*").limit(1);s?t(e=>e+`   ❌ product_categories table error: ${s.message}
`):(t(e=>e+`   ✅ product_categories table exists
`),t(t=>t+`   📊 Sample data: ${e?.length||0} records found
`))}catch(e){t(t=>t+`   ❌ product_categories table not accessible: ${e.message}
`)}t(e=>e+"\n2. Checking products table...\n");try{let{data:e,error:s}=await i.O.from("products").select("*").limit(1);s?t(e=>e+`   ❌ products table error: ${s.message}
`):(t(e=>e+`   ✅ products table exists
`),t(t=>t+`   📊 Sample data: ${e?.length||0} records found
`))}catch(e){t(t=>t+`   ❌ products table not accessible: ${e.message}
`)}t(e=>e+"\n3. Checking products_page table...\n");try{let{data:e,error:s}=await i.O.from("products_page").select("*").limit(1);s?t(e=>e+`   ❌ products_page table error: ${s.message}
`):(t(e=>e+`   ✅ products_page table exists
`),t(t=>t+`   📊 Sample data: ${e?.length||0} records found
`))}catch(e){t(t=>t+`   ❌ products_page table not accessible: ${e.message}
`)}t(e=>e+"\n4. Checking all available tables...\n");try{let{data:e,error:s}=await i.O.from("information_schema.tables").select("table_name").eq("table_schema","public");if(s)t(e=>e+`   ⚠️  Could not list tables: ${s.message}
`);else{let s=e?.map(e=>e.table_name)||[];t(e=>e+`   📋 Available tables: ${s.join(", ")}
`);let r=s.filter(e=>e.toLowerCase().includes("product")||e.toLowerCase().includes("categor"));r.length>0?t(e=>e+`   🎯 Product-related tables: ${r.join(", ")}
`):t(e=>e+`   ⚠️  No product-related tables found
`)}}catch(e){t(t=>t+`   ❌ Could not check tables: ${e.message}
`)}t(e=>e+"\n5. Recommendations:\n"),t(e=>e+"   \uD83D\uDCA1 If tables are missing, you need to:\n"),t(e=>e+"   • Create product_categories table\n"),t(e=>e+"   • Create products table\n"),t(e=>e+"   • Create products_page table (optional)\n"),t(e=>e+"   • Add sample data to test\n"),t(e=>e+"\n\uD83C\uDF89 Database check complete!\n")}catch(e){t(t=>t+`
❌ Database check failed: ${e.message}
`)}finally{o(!1)}};return(0,r.jsxs)("div",{className:"p-8",children:[r.jsx("h1",{className:"text-3xl font-bold mb-6",children:"\uD83D\uDD0D Check Products Database"}),(0,r.jsxs)("div",{className:"mb-6 bg-red-50 border border-red-200 rounded-lg p-4",children:[r.jsx("h2",{className:"text-lg font-semibold text-red-800 mb-2",children:"\uD83D\uDEA8 Products Page Issue"}),r.jsx("p",{className:"text-red-700 mb-2",children:"The products page is not loading data from the database because the required tables are missing or not accessible."}),(0,r.jsxs)("div",{className:"text-sm text-red-600",children:[r.jsx("strong",{children:"Required tables:"}),(0,r.jsxs)("ul",{className:"mt-1 space-y-1",children:[r.jsx("li",{children:"• product_categories - for product categories"}),r.jsx("li",{children:"• products - for individual products"}),r.jsx("li",{children:"• products_page - for page content (optional)"})]})]})]}),(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",children:[(0,r.jsxs)("button",{onClick:u,disabled:s,className:"bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-left",children:[r.jsx("div",{className:"font-semibold mb-1",children:"\uD83D\uDD0D Check Database Tables"}),r.jsx("div",{className:"text-sm opacity-90",children:"Verify which tables exist and their status"})]}),(0,r.jsxs)("button",{onClick:()=>{t(`
-- 🏗️ Create Products Database Tables
-- Run these commands in your Supabase SQL Editor

-- 1. Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES product_categories(id),
  price DECIMAL(10,2),
  specifications JSONB,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create products_page table (for page content)
CREATE TABLE IF NOT EXISTS products_page (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Our Products',
  description TEXT DEFAULT 'Discover our comprehensive range of products',
  hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000',
  intro_title VARCHAR(255) DEFAULT 'Product Categories',
  intro_description TEXT DEFAULT 'Browse our product categories to find exactly what you need',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default products_page data
INSERT INTO products_page (title, description, hero_image, intro_title, intro_description)
VALUES (
  'Our Products',
  'Discover our comprehensive range of high-quality products designed to meet your needs',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000',
  'Product Categories',
  'Browse our product categories to find exactly what you need'
) ON CONFLICT DO NOTHING;

-- 5. Insert sample product categories
INSERT INTO product_categories (name, description, slug, image_url, display_order) VALUES
('Diving Equipment', 'Professional diving gear and equipment for all levels', 'diving-equipment', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800', 1),
('Safety Gear', 'Essential safety equipment for underwater activities', 'safety-gear', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', 2),
('Underwater Cameras', 'Capture your underwater adventures with professional cameras', 'underwater-cameras', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800', 3),
('Accessories', 'Essential accessories for diving and underwater activities', 'accessories', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800', 4)
ON CONFLICT (slug) DO NOTHING;

-- 6. Insert sample products
INSERT INTO products (name, description, short_description, category_id, price, features, display_order) VALUES
('Professional Diving Mask', 'High-quality diving mask with anti-fog technology', 'Crystal clear vision underwater', (SELECT id FROM product_categories WHERE slug = 'diving-equipment'), 89.99, ARRAY['Anti-fog coating', 'Comfortable silicone skirt', 'Tempered glass lens'], 1),
('Diving Fins', 'Lightweight and efficient diving fins for better propulsion', 'Enhanced underwater mobility', (SELECT id FROM product_categories WHERE slug = 'diving-equipment'), 65.99, ARRAY['Lightweight design', 'Efficient blade shape', 'Comfortable foot pocket'], 2),
('Underwater Safety Light', 'Bright LED safety light for underwater visibility', 'Stay visible and safe underwater', (SELECT id FROM product_categories WHERE slug = 'safety-gear'), 45.99, ARRAY['Waterproof to 100m', 'Long battery life', 'Multiple flash modes'], 1),
('Waterproof Action Camera', '4K underwater action camera with stabilization', 'Capture stunning underwater footage', (SELECT id FROM product_categories WHERE slug = 'underwater-cameras'), 299.99, ARRAY['4K video recording', 'Image stabilization', 'Waterproof to 30m'], 1)
ON CONFLICT DO NOTHING;

-- 7. Enable Row Level Security (optional)
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_page ENABLE ROW LEVEL SECURITY;

-- 8. Create policies for public read access
CREATE POLICY "Public can read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public can read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read products_page" ON products_page FOR SELECT USING (true);

-- 9. Verify the tables were created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
AND table_name IN ('product_categories', 'products', 'products_page')
ORDER BY table_name;
`)},className:"bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 text-left",children:[r.jsx("div",{className:"font-semibold mb-1",children:"\uD83C\uDFD7️ Show Create Tables SQL"}),r.jsx("div",{className:"text-sm opacity-90",children:"Get SQL commands to create missing tables"})]})]}),e&&(0,r.jsxs)("div",{className:"bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm mb-8",children:[(0,r.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[r.jsx("h2",{className:"text-lg text-white",children:"\uD83D\uDCCB Database Check Results:"}),r.jsx("button",{onClick:()=>navigator.clipboard.writeText(e),className:"bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600",children:"\uD83D\uDCCB Copy"})]}),r.jsx("pre",{className:"whitespace-pre-wrap max-h-96 overflow-y-auto",children:e})]}),(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,r.jsxs)("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-4",children:[r.jsx("h3",{className:"font-semibold text-yellow-800 mb-2",children:"⚠️ Current Issue"}),(0,r.jsxs)("div",{className:"text-sm text-yellow-700 space-y-2",children:[r.jsx("p",{children:"Products page shows:"}),(0,r.jsxs)("ul",{className:"space-y-1",children:[r.jsx("li",{children:"• Loading spinner"}),r.jsx("li",{children:"• Empty categories"}),r.jsx("li",{children:"• Database connection errors"}),r.jsx("li",{children:"• Missing table errors"})]})]})]}),(0,r.jsxs)("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4",children:[r.jsx("h3",{className:"font-semibold text-blue-800 mb-2",children:"\uD83D\uDD27 Solution Steps"}),r.jsx("div",{className:"text-sm text-blue-700 space-y-2",children:(0,r.jsxs)("ol",{className:"space-y-1",children:[r.jsx("li",{children:"1. Check database status"}),r.jsx("li",{children:"2. Create missing tables"}),r.jsx("li",{children:"3. Insert sample data"}),r.jsx("li",{children:"4. Test products page"}),r.jsx("li",{children:"5. Add real product data"})]})})]}),(0,r.jsxs)("div",{className:"bg-green-50 border border-green-200 rounded-lg p-4",children:[r.jsx("h3",{className:"font-semibold text-green-800 mb-2",children:"✅ Expected Result"}),(0,r.jsxs)("div",{className:"text-sm text-green-700 space-y-2",children:[r.jsx("p",{children:"After fixing:"}),(0,r.jsxs)("ul",{className:"space-y-1",children:[r.jsx("li",{children:"• Products page loads correctly"}),r.jsx("li",{children:"• Categories display properly"}),r.jsx("li",{children:"• Search functionality works"}),r.jsx("li",{children:"• Product details accessible"})]})]})]})]})]})}},99060:(e,t,s)=>{"use strict";s.d(t,{O:()=>o});var r=s(52997);let a="https://ilxfqrxybtcftioizoan.supabase.co",i="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseGZxcnh5YnRjZnRpb2l6b2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTg5MjMsImV4cCI6MjA2OTQzNDkyM30.Jhjy7136xlqHcVjeCGPDvh4Ofpio3a09Y2fFu2Sqqh0";a||console.warn("Supabase URL not configured properly. Using fallback configuration."),i||console.warn("Supabase Anon Key not configured properly. Using fallback configuration.");let o=(0,r.eI)(a||"https://placeholder.supabase.co",i||"placeholder-key")},83228:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});let r=(0,s(68570).createProxy)(String.raw`D:\Ramy\RTS\ReactJS\divemix-website\app\check-products-database\page.tsx#default`)},11506:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i,metadata:()=>a});var r=s(19510);s(67272);let a={title:"DiveMix - Gas & Compressor Technologies",description:"Leading the industry in compressed air and gas solutions since 1990",icons:{icon:"/img/faveicon.ico"}};function i({children:e}){return r.jsx("html",{lang:"en",children:r.jsx("body",{children:e})})}},67272:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[9276,4471,2997],()=>s(40281));module.exports=r})();