import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Resend API configuration (3000 emails/month free)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  console.log(`📧 Sending email via Resend to:`, to);

  try {
    const result = await resend.emails.send({
      from: `Eduzzle <${process.env.RESEND_FROM}>`,
      to,
      subject,
      html,
    });
    
    console.log("✅ Email sent successfully:", result.data?.id);
    return result;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err;
  }
}

// Test email - run with: node utils/email.js
sendEmail({
  to: "yabhi7392@gmail.com",
  subject: "Test Email from Eduzzle",
  html: "<h1>Hello from Eduzzle!</h1><p>This is a test email sent using Resend API.</p>"
}).then(() => {
  console.log("🎉 Test email completed");
  process.exit(0);
}).catch((err) => {
  console.error("💥 Test email failed:", err);
  process.exit(1);
});