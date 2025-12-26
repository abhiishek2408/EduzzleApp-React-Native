import { sendEmail } from "./email.js";

(async () => {
  try {
    await sendEmail({
      to: "yabhi7392@gmail.com",
      subject: "Test Email - Eduzzle App",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
          <h1 style="color: #a21caf;">🎉 Email is Working!</h1>
          <p>Your Eduzzle email service is configured correctly.</p>
          <p>You can now send OTP emails to any user.</p>
        </div>
      `,
    });
    console.log("✅ Test email sent successfully");
  } catch (err) {
    console.error("❌ Test email failed:", err);
  }
})();
