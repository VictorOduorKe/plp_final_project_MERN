// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or "outlook", "yahoo" etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password (not your main password)
  },
});

async function sendWelcomeEmail(to, otp) {
  const mailOptions = {
    from: `"MyApp Team" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to AiStudyPlanner!",
    html: `
      <h2>Hello new User your otp is <span style='Background:green;padding:10px; border-radius:10px;color:white'> ${otp} </span>,</h2>
      <p>Thank you for registering with AiStudyPlanner! We're excited to have you onboard 🚀.</p>
      <p>Best,<br/>The AiStudyPlanner Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Welcome email sent to ${to} and otp is ${otp}`);
}

async function sendContactEmail({ to, subject, message,email }) {
  const mailOptions = {
    from: `${email}`,
    to:`${process.env.EMAIL_USER}`,                  // ✅ add recipient
    subject,
    html: `<p>${message}</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Contact email sent to ${to} | Subject: ${subject}`);
}

module.exports = { sendWelcomeEmail, sendContactEmail };
