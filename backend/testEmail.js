import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Brevo SMTP configuration (use on Render, works reliably)
import axios from "axios";

dotenv.config();

// Brevo HTTP API implementation
// Docs: https://developers.brevo.com/docs/send-a-transactional-email

async function sendEmail({ to, subject, text, html }) {
  console.log(`📧 Sending email via Brevo HTTP API to:`, to);
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Eduzzle",
          email: process.env.BREVO_FROM_EMAIL,
        },
        to: Array.isArray(to)
          ? to.map((email) => ({ email }))
          : [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Email sent successfully to:", to);
    return response.data;
  } catch (err) {
    console.error("❌ Email sending failed:", err.response?.data || err.message || err);
    throw err;
  }
}

sendEmail(
  { to: "abhishekydv2408@gmail.com", subject: "Test Email", text: "This is a test email.", html: "<h1>This is a test email.</h1>" });