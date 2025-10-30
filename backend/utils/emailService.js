// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Add timeout settings
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

async function sendWelcomeEmail(to, otp) {
  try {
    // Verify connection configuration
    await transporter.verify();
    
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

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Welcome email sent to ${to} and otp is ${otp}`);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
}

async function sendContactEmail({ to, subject, message, email }) {
  try {
    // Verify connection configuration
    await transporter.verify();
    
    const mailOptions = {
      from: `${email}`,
      to: `${process.env.EMAIL_USER}`,
      subject,
      html: `<p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Contact email sent to ${to} | Subject: ${subject}`);
    console.log('Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Contact email sending failed:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    throw error;
  }
}

module.exports = { sendWelcomeEmail, sendContactEmail };
