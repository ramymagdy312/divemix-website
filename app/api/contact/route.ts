import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, branchId } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database (optional - will continue if table doesn't exist)
    let contactMessage = { id: `temp_${Date.now()}` };
    try {
      const { data, error: dbError } = await supabase
        .from('contact_messages')
        .insert({
          name,
          email,
          phone: phone || null,
          subject,
          message,
          branch_id: branchId || null,
          status: 'new'
        })
        .select()
        .single();

      if (!dbError && data) {
        contactMessage = data;
      } else {
        console.log('Database save skipped (table may not exist):', dbError?.message);
      }
    } catch (dbSaveError) {
      console.log('Database save failed, continuing with email:', dbSaveError);
    }

    // Get email settings from settings table
    const { data: settingsData } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['contact_email', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_password', 'smtp_from']);

    // Convert settings array to object for easier access
    const siteSettings = settingsData?.reduce((acc: any, setting: any) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {}) || {};

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        host: siteSettings?.smtp_host || process.env.SMTP_HOST,
        port: parseInt(siteSettings?.smtp_port || process.env.SMTP_PORT || '587'),
        secure: parseInt(siteSettings?.smtp_port || process.env.SMTP_PORT || '587') === 465, // true for 465, false for other ports
        auth: {
          user: siteSettings?.smtp_user || process.env.SMTP_USER,
          pass: siteSettings?.smtp_password || process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false // Accept self-signed certificates
        }
      });

      const recipientEmail = siteSettings?.contact_email || process.env.CONTACT_EMAIL || 'info@divemix.com';

      await transporter.sendMail({
        from: siteSettings?.smtp_from || process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipientEmail,
        subject: `رسالة جديدة من الموقع - ${subject}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="margin: 0; text-align: center;">رسالة جديدة من موقع DiveMix</h2>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #1e40af; margin-top: 0;">تفاصيل الرسالة:</h3>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">الاسم:</strong>
                  <span style="margin-right: 10px;">${name}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">البريد الإلكتروني:</strong>
                  <span style="margin-right: 10px;">${email}</span>
                </div>
                
                ${phone ? `
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">رقم الهاتف:</strong>
                  <span style="margin-right: 10px;">${phone}</span>
                </div>
                ` : ''}
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">الموضوع:</strong>
                  <span style="margin-right: 10px;">${subject}</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                  <strong style="color: #374151;">الرسالة:</strong>
                  <div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-top: 10px; border-right: 4px solid #0891b2;">
                    ${message.replace(/\n/g, '<br>')}
                  </div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 14px;">
                  <p>تم إرسال هذه الرسالة من موقع DiveMix في ${new Date().toLocaleString('ar-EG')}</p>
                  <p>معرف الرسالة: ${contactMessage.id}</p>
                </div>
              </div>
            </div>
            
            <div style="background: #1e40af; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">© 2024 DiveMix - جميع الحقوق محفوظة</p>
            </div>
          </div>
        `,
      });

      // Send confirmation email to user
      await transporter.sendMail({
        from: siteSettings?.smtp_from || process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'تأكيد استلام رسالتك - DiveMix',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0891b2 0%, #1e40af 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
              <h2 style="margin: 0; text-align: center;">شكراً لتواصلك معنا</h2>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
              <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h3 style="color: #1e40af; margin-top: 0;">عزيزي/عزيزتي ${name}،</h3>
                
                <p>شكراً لك على تواصلك معنا. لقد تم استلام رسالتك بنجاح وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.</p>
                                
                <p>إذا كانت رسالتك عاجلة، يمكنك التواصل معنا مباشرة عبر:</p>
                <ul>
                  <li>الهاتف: +20123456789</li>
                  <li>البريد الإلكتروني: info@divemix.com</li>
                  <li>واتساب: +20123456789</li>
                </ul>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 14px;">
                  <p>معرف الرسالة: ${contactMessage.id}</p>
                </div>
              </div>
            </div>
            
            <div style="background: #1e40af; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px;">
              <p style="margin: 0; font-size: 14px;">© 2024 DiveMix - جميع الحقوق محفوظة</p>
            </div>
          </div>
        `,
      });

    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the request if email fails, message is already saved
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will contact you soon.',
      id: contactMessage.id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the message. Please try again.' },
      { status: 500 }
    );
  }
}