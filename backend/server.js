const express = require("express");
const { dbConnection } = require("./db");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const authLogin = require("./routes/authLogin");
const otp = require("./routes/requestOtp");
const subjectRoutes = require("./routes/subjectRoutes");
const logoutRoute = require("./routes/authLogout");
const adminRoutes = require('./routes/adminRoutes');
const contactMessage = require("./routes/contactMessage");
const paymentRoute = require('./routes/paymentRoute');
const planRoute = require('./routes/planRoute');
const answerRoutes = require("./routes/answerRoute");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = 3000;

// Trust the first proxy
app.set('trust proxy', 1);

app.use(cookieParser());

// ✅ CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://ai-study-planner-buddy.netlify.app'
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};

// Apply CORS configuration
app.use(cors(corsOptions));

app.use(express.json());
dbConnection();

// Health check route
app.get("/", (req, res) => {
  res.send("Hello Express.js 🚀");
});

// Routes
app.use("/auth", otp);
app.use("/auth", authRoute);
app.use("/auth", authLogin);
app.use("/auth", logoutRoute);
app.use("/api", subjectRoutes);
app.use("/api", adminRoutes);
app.use("/api", contactMessage);
app.use('/payment', paymentRoute);
app.use('/plan', planRoute);
app.use("/answers", answerRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
