import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, to } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message || !to) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter (you'll need to configure this with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
          
          <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Reply to:</strong> ${email}
            </p>
          </div>
        </div>
        
        <div style="background-color: #374151; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">This email was sent from your website contact form.</p>
        </div>
      </div>
    `;

    const textContent = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Reply to: ${email}
    `;

    // Send email
    await transporter.sendMail({
      from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
      to: to,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}