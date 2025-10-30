const express = require("express");
const { dbConnection } = require("./db");
const cors = require("cors");
const authRoute = require("./routes/authRoute");
const authLogin = require("./routes/authLogin");
const otp = require("./routes/requestOtp");
const subjectRoutes = require("./routes/subjectRoutes");
const logoutRoute=require("./routes/authLogout")
const adminRoutes=require('./routes/adminRoutes')
const contactMessage=require("./routes/contactMessage")
const paymentRoute=require('./routes/paymentRoute')
const planRoute = require('./routes/planRoute')
const answerRoutes = require("./routes/answerRoute");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cookieParser());

// ✅ CORS configuration
app.use(cors({
  origin: 'https://ai-study-planner-buddy.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));


// Handle OPTIONS preflight requests
app.options('*', cors());

app.use(express.json());
dbConnection();

// Add security headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://ai-study-planner-buddy.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  next();
});

app.get("/", (req, res) => {
  res.send("Hello Express.js 🚀");
});
// Routes
app.use("/auth", otp);
app.use("/auth", authRoute);
app.use("/auth", authLogin);
app.use("/auth",logoutRoute)
app.use("/api", subjectRoutes);
app.use("/api", adminRoutes);
app.use("/api", contactMessage);
app.use('/payment',paymentRoute)
app.use('/plan',planRoute)
app.use("/answers", answerRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
