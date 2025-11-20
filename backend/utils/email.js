import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Resend API configuration (3000 emails/month free)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }) {
  console.log(`📧 Sending email via Resend to:`, to);

  try {
    const result = await resend.emails.send({
      from: `Eduzzle <${process.env.RESEND_FROM_EMAIL}>`,
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
