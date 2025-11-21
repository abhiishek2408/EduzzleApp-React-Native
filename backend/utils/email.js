import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Hostinger SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.HOSTINGER_SMTP_HOST,
  port: process.env.HOSTINGER_SMTP_PORT || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.HOSTINGER_EMAIL,
    pass: process.env.HOSTINGER_PASSWORD,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  console.log(`📧 Sending email via Hostinger to:`, to);

  try {
    const result = await transporter.sendMail({
      from: `"Eduzzle" <${process.env.HOSTINGER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });
    
    console.log("✅ Email sent successfully to:", to);
    console.log("📬 Message ID:", result.messageId);
    return result;
  } catch (err) {
    console.error("❌ Email sending failed:", err.message || err);
    throw err;
  }
}

// Test email - run with: node utils/email.js
sendEmail({
  to: "abhishekydv2408@gmail.com", // Resend free tier only sends to your verified email
  subject: "Test Email from Eduzzle",
  html: "<h1>Hello from Eduzzle!</h1><p>This is a test email sent using Resend API.</p>"
}).then(() => {
  console.log("🎉 Test email completed");
  process.exit(0);
}).catch((err) => {
  console.error("💥 Test email failed:", err);
  process.exit(1);
});