// utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This will be your Gmail App Password
  },
  // Increase timeout settings
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 60000,
  // Add pool configuration
  pool: true,
  maxConnections: 1,
  maxMessages: 50,
  rateDelta: 2000,
  rateLimit: 2,
});

async function retry(fn, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Retry attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function sendWelcomeEmail(to, otp) {
  try {
    // Verify connection configuration
    await retry(() => transporter.verify());
    
    const mailOptions = {
      from: `"MyApp Team" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🎉 Welcome to AiStudyPlanner!",
      html: `
        <h2>Hello new User your otp is <span style='background-color:green;padding:10px;border-radius:10px;color:white'> ${otp} </span>,</h2>
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
