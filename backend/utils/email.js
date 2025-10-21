import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config(); 


const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, text, html }) {
  console.log("Sending email to:", to);
  await transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
    html,
  });

}

// sendEmail({
//   to: "visheshyadav68@gmail.com",
//   subject: "Test Email from Resend",
//   html: "<h1>It works!</h1><p>This is a test email from Resend API</p>",
// });
