// import dotenv from "dotenv";
// import nodemailer from "nodemailer";

// dotenv.config(); // load .env

// // // Print env variables to debug
// // console.log("SMTP_HOST:", process.env.SMTP_HOST);
// // console.log("SMTP_PORT:", process.env.SMTP_PORT);
// // console.log("SMTP_USER:", process.env.SMTP_USER);
// // console.log("SMTP_PASS:", process.env.SMTP_PASS ? "****" : undefined); // hide password
// // console.log("SMTP_FROM:", process.env.SMTP_FROM);

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
//   secure: false, // true for 465, false for 587
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

// --- Transporter setup ---
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 465,
  secure: Number(SMTP_PORT) === 465, // SSL for 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// --- Verify SMTP connection on startup ---
(async () => {
  try {
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully");
  } catch (err) {
    console.error("❌ SMTP connection failed:", err.message);
  }
})();

export async function sendEmail({ to, subject, text, html }) {
  try {
    console.log("📤 Sending email to:", to);
    const info = await transporter.sendMail({
      from: SMTP_FROM || SMTP_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
    console.error(err);
    throw err;
  }
}
