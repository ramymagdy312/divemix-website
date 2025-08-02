(()=>{var e={};e.id=380,e.ids=[380],e.modules={72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},28787:(e,s,i)=>{"use strict";i.r(s),i.d(s,{GlobalError:()=>a.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>d,routeModule:()=>m,tree:()=>c}),i(66424),i(11506),i(35866);var r=i(23191),t=i(88716),l=i(37922),a=i.n(l),o=i(95231),n={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(n[e]=()=>o[e]);i.d(s,n);let c=["",{children:["fix-rls-policies",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,66424)),"D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\fix-rls-policies\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,11506)),"D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,35866,23)),"next/dist/client/components/not-found-error"]}],d=["D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\fix-rls-policies\\page.tsx"],p="/fix-rls-policies/page",u={require:i,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:t.x.APP_PAGE,page:"/fix-rls-policies/page",pathname:"/fix-rls-policies",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},24963:(e,s,i)=>{Promise.resolve().then(i.bind(i,86227))},48819:(e,s,i)=>{Promise.resolve().then(i.bind(i,40381))},29823:(e,s,i)=>{Promise.resolve().then(i.t.bind(i,12994,23)),Promise.resolve().then(i.t.bind(i,96114,23)),Promise.resolve().then(i.t.bind(i,9727,23)),Promise.resolve().then(i.t.bind(i,79671,23)),Promise.resolve().then(i.t.bind(i,41868,23)),Promise.resolve().then(i.t.bind(i,84759,23))},86227:(e,s,i)=>{"use strict";i.r(s),i.d(s,{default:()=>l});var r=i(10326),t=i(17577);function l(){let[e,s]=(0,t.useState)("");return(0,r.jsxs)("div",{className:"p-8",children:[r.jsx("h1",{className:"text-3xl font-bold mb-6",children:"\uD83D\uDD12 Fix RLS Policies for Forms"}),(0,r.jsxs)("div",{className:"mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4",children:[r.jsx("h2",{className:"text-lg font-semibold text-yellow-800 mb-2",children:"⚠️ Row Level Security (RLS) Issues"}),r.jsx("p",{className:"text-yellow-700 mb-2",children:"Form submission errors are often caused by Row Level Security policies blocking database operations."}),(0,r.jsxs)("div",{className:"text-sm text-yellow-600",children:[r.jsx("strong",{children:"Common symptoms:"}),(0,r.jsxs)("ul",{className:"mt-1 space-y-1",children:[r.jsx("li",{children:'• "new row violates row-level security policy" error'}),r.jsx("li",{children:"• Forms submit but data doesn't save"}),r.jsx("li",{children:'• "permission denied" errors in console'}),r.jsx("li",{children:"• Empty tables even after successful submissions"})]})]})]}),(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",children:[(0,r.jsxs)("button",{onClick:()=>{s(`
-- 🔧 SQL Commands to Fix RLS Policies for Forms
-- Run these commands in your Supabase SQL Editor

-- 1. Disable RLS temporarily for testing (OPTIONAL)
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;

-- 2. OR Create proper RLS policies for public access

-- Applications table policies
CREATE POLICY "Enable read access for all users" ON applications
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON applications
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON applications
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON applications
FOR DELETE USING (true);

-- Services table policies
CREATE POLICY "Enable read access for all users" ON services
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON services
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON services
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON services
FOR DELETE USING (true);

-- Product categories table policies
CREATE POLICY "Enable read access for all users" ON product_categories
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON product_categories
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON product_categories
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON product_categories
FOR DELETE USING (true);

-- 3. Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('applications', 'services', 'product_categories');

-- 4. Drop existing policies if needed (run only if you want to recreate them)
-- DROP POLICY IF EXISTS "Enable read access for all users" ON applications;
-- DROP POLICY IF EXISTS "Enable insert access for all users" ON applications;
-- DROP POLICY IF EXISTS "Enable update access for all users" ON applications;
-- DROP POLICY IF EXISTS "Enable delete access for all users" ON applications;

-- 5. Alternative: Create more restrictive policies (for production)
-- CREATE POLICY "Enable insert for authenticated users only" ON applications
-- FOR INSERT TO authenticated WITH CHECK (true);

-- CREATE POLICY "Enable update for authenticated users only" ON applications
-- FOR UPDATE TO authenticated USING (true);
`)},className:"bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 text-left",children:[r.jsx("div",{className:"font-semibold mb-1",children:"\uD83D\uDCDD Show SQL Commands"}),r.jsx("div",{className:"text-sm opacity-90",children:"Get SQL commands to fix RLS policies"})]}),(0,r.jsxs)("button",{onClick:()=>{s(`
🔍 TROUBLESHOOTING STEPS FOR FORM ERRORS

1. 📊 CHECK SUPABASE DASHBOARD
   • Go to your Supabase project dashboard
   • Navigate to Authentication > Policies
   • Check if RLS is enabled on applications/services tables
   • Look for any restrictive policies

2. 🔧 COMMON RLS ISSUES
   • RLS enabled but no policies = All operations blocked
   • Policies exist but don't match your use case
   • Authentication required but user not logged in
   • Wrong policy conditions

3. 🚀 QUICK FIXES
   Option A: Disable RLS (for development only)
   • Go to Database > Tables
   • Click on table name
   • Toggle "Enable RLS" to OFF

   Option B: Create permissive policies
   • Use the SQL commands provided above
   • Run them in SQL Editor

4. 🧪 TEST AFTER CHANGES
   • Try adding a new application/service
   • Check browser console for errors
   • Use /diagnose-forms to verify fixes

5. 📝 FORM-SPECIFIC CHECKS
   • Ensure all required fields are filled
   • Check that array fields (use_cases, benefits, features) are properly formatted
   • Verify image_url is a valid URL format
   • Make sure display_order is a positive number

6. 🔍 BROWSER CONSOLE ERRORS
   Common error messages and solutions:
   
   "new row violates row-level security policy"
   → RLS is blocking the insert, fix policies
   
   "null value in column violates not-null constraint"
   → Required field is missing, check form validation
   
   "invalid input syntax for type json"
   → Array field formatting issue, check data structure
   
   "permission denied for table"
   → Database permissions issue, check Supabase settings

7. 🛠️ DEVELOPMENT VS PRODUCTION
   Development: Disable RLS or use permissive policies
   Production: Use proper authentication-based policies
`)},className:"bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 text-left",children:[r.jsx("div",{className:"font-semibold mb-1",children:"\uD83D\uDD0D Troubleshooting Guide"}),r.jsx("div",{className:"text-sm opacity-90",children:"Step-by-step problem solving"})]})]}),e&&(0,r.jsxs)("div",{className:"bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm",children:[(0,r.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[r.jsx("h2",{className:"text-lg text-white",children:"\uD83D\uDCCB Instructions:"}),r.jsx("button",{onClick:()=>navigator.clipboard.writeText(e),className:"bg-gray-700 text-white px-3 py-1 rounded text-xs hover:bg-gray-600",children:"\uD83D\uDCCB Copy"})]}),r.jsx("pre",{className:"whitespace-pre-wrap max-h-96 overflow-y-auto",children:e})]}),(0,r.jsxs)("div",{className:"mt-8 grid grid-cols-1 md:grid-cols-3 gap-6",children:[(0,r.jsxs)("div",{className:"bg-red-50 border border-red-200 rounded-lg p-4",children:[r.jsx("h3",{className:"font-semibold text-red-800 mb-2",children:"\uD83D\uDEA8 Quick Fix (Development)"}),(0,r.jsxs)("div",{className:"text-sm text-red-700 space-y-2",children:[r.jsx("p",{children:r.jsx("strong",{children:"Fastest solution:"})}),(0,r.jsxs)("ol",{className:"space-y-1",children:[r.jsx("li",{children:"1. Go to Supabase Dashboard"}),r.jsx("li",{children:"2. Database → Tables"}),r.jsx("li",{children:"3. Click table name"}),r.jsx("li",{children:'4. Toggle "Enable RLS" OFF'}),r.jsx("li",{children:"5. Test forms again"})]}),r.jsx("p",{className:"text-xs mt-2 opacity-75",children:"⚠️ Only for development!"})]})]}),(0,r.jsxs)("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4",children:[r.jsx("h3",{className:"font-semibold text-blue-800 mb-2",children:"\uD83D\uDD27 Proper Fix (Recommended)"}),(0,r.jsxs)("div",{className:"text-sm text-blue-700 space-y-2",children:[r.jsx("p",{children:r.jsx("strong",{children:"Create proper policies:"})}),(0,r.jsxs)("ol",{className:"space-y-1",children:[r.jsx("li",{children:"1. Use SQL commands provided"}),r.jsx("li",{children:"2. Run in Supabase SQL Editor"}),r.jsx("li",{children:"3. Create permissive policies"}),r.jsx("li",{children:"4. Test form submissions"}),r.jsx("li",{children:"5. Adjust policies as needed"})]}),r.jsx("p",{className:"text-xs mt-2 opacity-75",children:"✅ Safe for production"})]})]}),(0,r.jsxs)("div",{className:"bg-green-50 border border-green-200 rounded-lg p-4",children:[r.jsx("h3",{className:"font-semibold text-green-800 mb-2",children:"\uD83E\uDDEA Testing Steps"}),(0,r.jsxs)("div",{className:"text-sm text-green-700 space-y-2",children:[r.jsx("p",{children:r.jsx("strong",{children:"After applying fixes:"})}),(0,r.jsxs)("ol",{className:"space-y-1",children:[r.jsx("li",{children:"1. Run /diagnose-forms"}),r.jsx("li",{children:"2. Test /admin/applications/new"}),r.jsx("li",{children:"3. Test /admin/services/new"}),r.jsx("li",{children:"4. Check browser console"}),r.jsx("li",{children:"5. Verify data in Supabase"})]}),r.jsx("p",{className:"text-xs mt-2 opacity-75",children:"\uD83C\uDFAF Confirm everything works"})]})]})]}),(0,r.jsxs)("div",{className:"mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4",children:[r.jsx("h3",{className:"font-semibold text-purple-800 mb-2",children:"\uD83C\uDFAF Expected Outcome"}),(0,r.jsxs)("div",{className:"text-sm text-purple-700",children:[r.jsx("p",{className:"mb-2",children:"After applying the fixes, you should be able to:"}),(0,r.jsxs)("ul",{className:"space-y-1",children:[r.jsx("li",{children:"• ✅ Add new applications without errors"}),r.jsx("li",{children:"• ✅ Edit existing applications successfully"}),r.jsx("li",{children:"• ✅ Add new services without errors"}),r.jsx("li",{children:"• ✅ Edit existing services successfully"}),r.jsx("li",{children:"• ✅ See data immediately in admin lists"}),r.jsx("li",{children:"• ✅ No console errors during form submission"})]})]})]})]})}},66424:(e,s,i)=>{"use strict";i.r(s),i.d(s,{default:()=>r});let r=(0,i(68570).createProxy)(String.raw`D:\Ramy\RTS\ReactJS\divemix-website\app\fix-rls-policies\page.tsx#default`)},11506:(e,s,i)=>{"use strict";i.r(s),i.d(s,{default:()=>a,metadata:()=>l});var r=i(19510),t=i(19125);i(67272);let l={title:"DiveMix - Gas & Compressor Technologies",description:"Leading the industry in compressed air and gas solutions since 1990",icons:{icon:"/img/faveicon.ico"}};function a({children:e}){return r.jsx("html",{lang:"en",children:(0,r.jsxs)("body",{children:[e,r.jsx(t.x7,{position:"top-right",toastOptions:{duration:4e3,style:{background:"#363636",color:"#fff"},success:{duration:3e3,style:{background:"#10b981"}},error:{duration:5e3,style:{background:"#ef4444"}}}})]})})}},67272:()=>{}};var s=require("../../webpack-runtime.js");s.C(e);var i=e=>s(s.s=e),r=s.X(0,[9276,4764],()=>i(28787));module.exports=r})();