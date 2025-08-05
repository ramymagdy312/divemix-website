(()=>{var e={};e.id=386,e.ids=[386],e.modules={20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{"use strict";e.exports=require("buffer")},61282:e=>{"use strict";e.exports=require("child_process")},84770:e=>{"use strict";e.exports=require("crypto")},80665:e=>{"use strict";e.exports=require("dns")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},35240:e=>{"use strict";e.exports=require("https")},98216:e=>{"use strict";e.exports=require("net")},19801:e=>{"use strict";e.exports=require("os")},55315:e=>{"use strict";e.exports=require("path")},68621:e=>{"use strict";e.exports=require("punycode")},76162:e=>{"use strict";e.exports=require("stream")},82452:e=>{"use strict";e.exports=require("tls")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},58359:()=>{},93739:()=>{},75417:(e,r,t)=>{"use strict";t.r(r),t.d(r,{originalPathname:()=>m,patchFetch:()=>v,requestAsyncStorage:()=>u,routeModule:()=>c,serverHooks:()=>g,staticGenerationAsyncStorage:()=>x});var s={};t.r(s),t.d(s,{POST:()=>l});var i=t(49303),o=t(88716),a=t(60670),n=t(87070),p=t(89145),d=t(55245);async function l(e){try{let{name:r,email:t,phone:s,subject:i,message:o,branchId:a}=await e.json();if(!r||!t||!i||!o)return n.NextResponse.json({error:"Missing required fields"},{status:400});let{data:l,error:c}=await p.O.from("contact_messages").insert({name:r,email:t,phone:s||null,subject:i,message:o,branch_id:a||null,status:"new"}).select().single();if(c)return console.error("Database error:",c),n.NextResponse.json({error:"Failed to save message"},{status:500});let{data:u}=await p.O.from("site_settings").select("contact_email, smtp_host, smtp_port, smtp_user, smtp_password, smtp_from").single(),x=null,g="الموقع الرئيسي";if(a){let{data:e}=await p.O.from("contact_page").select("branches").single();if(e?.branches){let r=e.branches.find((e,r)=>`branch-${r}`===a);r&&(x={name:r.name,email:r.email},g=r.name)}}try{let e=d.createTransport({host:u?.smtp_host||process.env.SMTP_HOST||"smtp.gmail.com",port:parseInt(u?.smtp_port||process.env.SMTP_PORT||"587"),secure:!1,auth:{user:u?.smtp_user||process.env.SMTP_USER,pass:u?.smtp_password||process.env.SMTP_PASS}}),a=u?.contact_email||x?.email||process.env.CONTACT_EMAIL||"info@divemix.com";await e.sendMail({from:u?.smtp_from||process.env.SMTP_FROM||process.env.SMTP_USER,to:a,subject:`رسالة جديدة من الموقع - ${i}`,html:`
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="margin: 0; text-align: center;">رسالة جديدة من موقع DiveMix</h2>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #1e40af; margin-top: 0;">تفاصيل الرسالة:</h3>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">الاسم:</strong>
                  <span style="margin-right: 10px;">${r}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">البريد الإلكتروني:</strong>
                  <span style="margin-right: 10px;">${t}</span>
                </div>
                
                ${s?`
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">رقم الهاتف:</strong>
                  <span style="margin-right: 10px;">${s}</span>
                </div>
                `:""}
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">الفرع:</strong>
                  <span style="margin-right: 10px;">${g}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">الموضوع:</strong>
                  <span style="margin-right: 10px;">${i}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">الرسالة:</strong>
                  <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 10px; border-right: 4px solid #0891b2;">
                    ${o.replace(/\n/g,"<br>")}
                  </div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 14px;">
                  <p>تم إرسال هذه الرسالة من موقع DiveMix في ${new Date().toLocaleString("ar-EG")}</p>
                  <p>معرف الرسالة: ${l.id}</p>
                </div>
              </div>
            </div>
            
            <div style="background: #1e40af; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">\xa9 2024 DiveMix - جميع الحقوق محفوظة</p>
            </div>
          </div>
        `}),await e.sendMail({from:u?.smtp_from||process.env.SMTP_FROM||process.env.SMTP_USER,to:t,subject:"تأكيد استلام رسالتك - DiveMix",html:`
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="margin: 0; text-align: center;">شكراً لتواصلك معنا</h2>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #1e40af; margin-top: 0;">عزيزي/عزيزتي ${r}،</h3>
                
                <p>شكراً لك على تواصلك معنا. لقد تم استلام رسالتك بنجاح وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.</p>
                
                <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0; border-right: 4px solid #0891b2;">
                  <h4 style="margin-top: 0; color: #374151;">ملخص رسالتك:</h4>
                  <p><strong>الموضوع:</strong> ${i}</p>
                  <p><strong>الفرع:</strong> ${g}</p>
                </div>
                
                <p>إذا كانت رسالتك عاجلة، يمكنك التواصل معنا مباشرة عبر:</p>
                <ul>
                  <li>الهاتف: +20123456789</li>
                  <li>البريد الإلكتروني: info@divemix.com</li>
                  <li>واتساب: +20123456789</li>
                </ul>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 14px;">
                  <p>معرف الرسالة: ${l.id}</p>
                </div>
              </div>
            </div>
            
            <div style="background: #1e40af; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">\xa9 2024 DiveMix - جميع الحقوق محفوظة</p>
            </div>
          </div>
        `})}catch(e){console.error("Email error:",e)}return n.NextResponse.json({success:!0,message:"تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.",id:l.id})}catch(e){return console.error("Contact form error:",e),n.NextResponse.json({error:"حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."},{status:500})}}let c=new i.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/contact/route",pathname:"/api/contact",filename:"route",bundlePath:"app/api/contact/route"},resolvedPagePath:"D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\api\\contact\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:u,staticGenerationAsyncStorage:x,serverHooks:g}=c,m="/api/contact/route";function v(){return(0,a.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:x})}},89145:(e,r,t)=>{"use strict";t.d(r,{O:()=>a});var s=t(72438);let i="https://ilxfqrxybtcftioizoan.supabase.co",o="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseGZxcnh5YnRjZnRpb2l6b2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTg5MjMsImV4cCI6MjA2OTQzNDkyM30.Jhjy7136xlqHcVjeCGPDvh4Ofpio3a09Y2fFu2Sqqh0";i||console.warn("Supabase URL not configured properly. Using fallback configuration."),o||console.warn("Supabase Anon Key not configured properly. Using fallback configuration.");let a=(0,s.eI)(i||"https://placeholder.supabase.co",o||"placeholder-key")}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[9276,5169,5245],()=>t(75417));module.exports=s})();