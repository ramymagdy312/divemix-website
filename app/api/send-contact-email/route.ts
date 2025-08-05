import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '../../lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, to } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Get email settings from site settings
    const { data: siteSettings } = await supabase
      .from('site_settings')
      .select('contact_email, smtp_host, smtp_port, smtp_user, smtp_password, smtp_from')
      .single();

    // Use contact email from settings if 'to' is not provided
    const recipientEmail = to || siteSettings?.contact_email || process.env.CONTACT_EMAIL || 'info@divemix.com';

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: siteSettings?.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(siteSettings?.smtp_port || process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: siteSettings?.smtp_user || process.env.SMTP_USER,
        pass: siteSettings?.smtp_password || process.env.SMTP_PASS,
      },
    });

    // Email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0891b2; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Contact Form Submission</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9fafb;">
          <h2 style="color: #374151; margin-bottom: 20px;">Contact Details</h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e0f2fe; border-radius: 8px;">
            <p style="margin: 0; color: #0891b2; font-size: 14px;">
              <strong>Sent from:</strong> DiveMix Website Contact Form<br>
              <strong>Date:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
        
        <div style="background-color: #374151; color: white; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">© 2024 DiveMix - All Rights Reserved</p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: siteSettings?.smtp_from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipientEmail,
      subject: `Contact Form: ${subject}`,
      html: htmlContent,
      replyTo: email, // Allow direct reply to the sender
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}