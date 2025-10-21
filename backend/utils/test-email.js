import { sendEmail } from "./email.js";

(async () => {
  try {
    await sendEmail({
      to: "visheshyadav68@gmail.com", // your real email
      subject: "Test Email from Resend",
      html: "<h1>It works!</h1><p>This is a test email from Resend API</p>",
    });
    console.log("✅ Test email sent successfully");
  } catch (err) {
    console.error("❌ Test email failed:", err);
  }
})();
