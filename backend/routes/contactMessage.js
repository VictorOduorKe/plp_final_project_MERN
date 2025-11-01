// routes/contact.js
const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../utils/emailService");
const { hideConsoleLogInProduction } = require("../lib/helper").hideConsoleLogInProduction; 
// POST /contact-message
router.post("/contact-message", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await sendContactEmail({
      to: process.env.EMAIL_USER, // your app’s inbox
      subject: `Contact Form: ${subject} from ${name}`,
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #6b46c1;">📩 New Contact Form Submission</h2>
          <p><strong>Name:</strong> <span style="color: #4a5568;">${name}</span></p>
          <p><strong>Email:</strong> <span style="color: #4a5568;">${email}</span></p>
          <p><strong>Subject:</strong> <span style="color: #4a5568;">${subject}</span></p>
          <p><strong>Message:</strong></p>
          <p style="background: #edf2f7; padding: 10px; border-radius: 5px; color: #2d3748;">${message}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 0.9em; color: #718096;">This message was sent via your AI Study Planner Contact Form.</p>
        </div>
      `,
      email, // sender's email
    });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    hideConsoleLogInProduction("Contact email error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
