import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const CONTACT_EMAIL = 'support@raystaffing.co.uk'

function createTransporter() {
  // If SMTP env vars are set, use them (production)
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  // Development fallback — log to console, return null transporter
  return null
}

function buildHtml(data: { name: string; email: string; phone: string; subject: string; message: string }) {
  const subjectLabels: Record<string, string> = {
    housing: 'Housing Services Enquiry',
    hr: 'HR & Compliance Enquiry',
    recruitment: 'Recruitment Enquiry',
    healthcare: 'Healthcare Staffing Enquiry',
    general: 'General Enquiry',
    complaint: 'Complaint',
    other: 'Other',
  }
  const subjectLabel = subjectLabels[data.subject] || data.subject

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
        <!-- Header -->
        <tr><td style="background:#0B1D33;padding:24px 32px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">New Contact Enquiry</h1>
          <p style="margin:4px 0 0;color:#C4942A;font-size:14px;">RAY Staffing Consulting Ltd</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;"><strong style="color:#5A6B7F;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Name</strong><br/><span style="color:#0B1D33;font-size:15px;">${data.name}</span></td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;"><strong style="color:#5A6B7F;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Email</strong><br/><a href="mailto:${data.email}" style="color:#1A3A5C;font-size:15px;">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;"><strong style="color:#5A6B7F;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Phone</strong><br/><span style="color:#0B1D33;font-size:15px;">${data.phone}</span></td></tr>` : ''}
            <tr><td style="padding:8px 0;border-bottom:1px solid #f0f0f0;"><strong style="color:#5A6B7F;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Subject</strong><br/><span style="color:#0B1D33;font-size:15px;">${subjectLabel}</span></td></tr>
            <tr><td style="padding:12px 0;"><strong style="color:#5A6B7F;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Message</strong><br/><p style="margin:8px 0 0;color:#0B1D33;font-size:15px;line-height:1.6;white-space:pre-wrap;">${data.message}</p></td></tr>
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#F7F9FC;padding:16px 32px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#5A6B7F;font-size:12px;">This message was sent from the RAY Staffing website contact form.</p>
          <p style="margin:4px 0 0;color:#5A6B7F;font-size:12px;">Received: ${new Date().toLocaleString('en-GB', { timeZone: 'GMT', dateStyle: 'full', timeStyle: 'short' })}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Name, email, subject and message are required' }, { status: 400 })
    }

    const html = buildHtml({ name, email, phone: phone || '', subject, message })
    const subjectLabels: Record<string, string> = {
      housing: 'Housing Services Enquiry',
      hr: 'HR & Compliance Enquiry',
      recruitment: 'Recruitment Enquiry',
      healthcare: 'Healthcare Staffing Enquiry',
      general: 'General Enquiry',
      complaint: 'Complaint',
      other: 'Other',
    }
    const subjectLabel = subjectLabels[subject] || subject
    const mailSubject = `[RAY Website] ${subjectLabel} from ${name}`

    const transporter = createTransporter()

    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"RAY Website" <${process.env.SMTP_USER}>`,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: mailSubject,
        html,
      })
    } else {
      // No SMTP configured — log the email (dev mode)
      console.log('📧 Contact form submission (no SMTP configured):')
      console.log(`  To: ${CONTACT_EMAIL}`)
      console.log(`  From: ${name} <${email}>`)
      console.log(`  Subject: ${mailSubject}`)
      console.log(`  Phone: ${phone || 'N/A'}`)
      console.log(`  Message: ${message}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
