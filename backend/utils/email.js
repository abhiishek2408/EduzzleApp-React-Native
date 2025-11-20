// import dotenv from "dotenv";
// import nodemailer from "nodemailer";

// dotenv.config(); 


// const {
//   SMTP_HOST,
//   SMTP_PORT,
//   SMTP_USER,
//   SMTP_PASS,
//   SMTP_FROM,
// } = process.env;

// const transporter = nodemailer.createTransport({
//   host: SMTP_HOST,
//   port: Number(SMTP_PORT) || 587,
//   secure: false, 
//   auth: {
//     user: SMTP_USER,
//     pass: SMTP_PASS,
//   },
// });

// export async function sendEmail({ to, subject, text, html }) {
//   console.log("Sending email to:", to);
//   await transporter.sendMail({
//     from: SMTP_FROM,
//     to,
//     subject,
//     text,
//     html,
//   });

// }

// sendEmail({
//   to: "visheshyadav68@gmail.com",
//   subject: "Test Email from Resend",
//   html: "<h1>It works!</h1><p>This is a test email from Resend API</p>",
// });



// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Choose email service: 'gmail', 'brevo', or 'resend'
const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';

// Gmail SMTP Configuration
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

// Brevo (Sendinblue) SMTP Configuration
const brevoTransporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_API_KEY,
  },
});

// Resend fallback (using nodemailer)
const resendTransporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});

// Select transporter based on configuration
const getTransporter = () => {
  switch (EMAIL_SERVICE) {
    case 'brevo':
      return brevoTransporter;
    case 'resend':
      return resendTransporter;
    case 'gmail':
    default:
      return gmailTransporter;
  }
};

export async function sendEmail({ to, subject, text, html }) {
  console.log(`📧 Sending email via ${EMAIL_SERVICE} to:`, to);

  try {
    const transporter = getTransporter();
    const fromEmail = process.env.EMAIL_FROM || process.env.GMAIL_USER || 'noreply@eduzzle.com';
    
    const result = await transporter.sendMail({
      from: `"Eduzzle" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
    });
    
    console.log("✅ Email sent successfully:", result.messageId);
    return result;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw err;
  }
}
