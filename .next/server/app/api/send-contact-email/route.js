(()=>{var e={};e.id=612,e.ids=[612],e.modules={20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78893:e=>{"use strict";e.exports=require("buffer")},61282:e=>{"use strict";e.exports=require("child_process")},84770:e=>{"use strict";e.exports=require("crypto")},80665:e=>{"use strict";e.exports=require("dns")},17702:e=>{"use strict";e.exports=require("events")},92048:e=>{"use strict";e.exports=require("fs")},32615:e=>{"use strict";e.exports=require("http")},35240:e=>{"use strict";e.exports=require("https")},98216:e=>{"use strict";e.exports=require("net")},19801:e=>{"use strict";e.exports=require("os")},55315:e=>{"use strict";e.exports=require("path")},68621:e=>{"use strict";e.exports=require("punycode")},76162:e=>{"use strict";e.exports=require("stream")},82452:e=>{"use strict";e.exports=require("tls")},17360:e=>{"use strict";e.exports=require("url")},21764:e=>{"use strict";e.exports=require("util")},71568:e=>{"use strict";e.exports=require("zlib")},58359:()=>{},93739:()=>{},56019:(e,t,r)=>{"use strict";r.r(t),r.d(t,{originalPathname:()=>x,patchFetch:()=>h,requestAsyncStorage:()=>d,routeModule:()=>l,serverHooks:()=>g,staticGenerationAsyncStorage:()=>m});var s={};r.r(s),r.d(s,{POST:()=>u});var o=r(49303),i=r(88716),a=r(60670),n=r(87070),p=r(55245),c=r(89145);async function u(e){try{let{name:t,email:r,subject:s,message:o,to:i}=await e.json();if(!t||!r||!s||!o)return n.NextResponse.json({error:"All fields are required"},{status:400});let{data:a}=await c.O.from("site_settings").select("contact_email, smtp_host, smtp_port, smtp_user, smtp_password, smtp_from").single(),u=i||a?.contact_email||process.env.CONTACT_EMAIL||"info@divemix.com",l=p.createTransport({host:a?.smtp_host||process.env.SMTP_HOST||"smtp.gmail.com",port:parseInt(a?.smtp_port||process.env.SMTP_PORT||"587"),secure:!1,auth:{user:a?.smtp_user||process.env.SMTP_USER,pass:a?.smtp_password||process.env.SMTP_PASS}}),d=`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0891b2; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Contact Details</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${t}</p>
            <p><strong>Email:</strong> ${r}</p>
            <p><strong>Subject:</strong> ${s}</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${o.replace(/\n/g,"<br>")}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e0f2fe; border-radius: 8px;">
            <p style="margin: 0; color: #0891b2; font-size: 14px;">
              <strong>Sent from:</strong> DiveMix Website Contact Form<br>
              <strong>Date:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="background-color: #374151; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">\xa9 2024 DiveMix - All Rights Reserved</p>
        </div>
      </div>
    `;return await l.sendMail({from:a?.smtp_from||process.env.SMTP_FROM||process.env.SMTP_USER,to:u,subject:`Contact Form: ${s}`,html:d,replyTo:r}),n.NextResponse.json({success:!0,message:"Email sent successfully!"})}catch(e){return console.error("Email sending error:",e),n.NextResponse.json({error:"Failed to send email. Please try again later."},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/send-contact-email/route",pathname:"/api/send-contact-email",filename:"route",bundlePath:"app/api/send-contact-email/route"},resolvedPagePath:"D:\\Ramy\\RTS\\ReactJS\\divemix-website\\app\\api\\send-contact-email\\route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:m,serverHooks:g}=l,x="/api/send-contact-email/route";function h(){return(0,a.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:m})}},89145:(e,t,r)=>{"use strict";r.d(t,{O:()=>a});var s=r(72438);let o="https://ilxfqrxybtcftioizoan.supabase.co",i="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseGZxcnh5YnRjZnRpb2l6b2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTg5MjMsImV4cCI6MjA2OTQzNDkyM30.Jhjy7136xlqHcVjeCGPDvh4Ofpio3a09Y2fFu2Sqqh0";o||console.warn("Supabase URL not configured properly. Using fallback configuration."),i||console.warn("Supabase Anon Key not configured properly. Using fallback configuration.");let a=(0,s.eI)(o||"https://placeholder.supabase.co",i||"placeholder-key")}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[9276,5169,5245],()=>r(56019));module.exports=s})();