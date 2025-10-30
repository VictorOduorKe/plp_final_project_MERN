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
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://ai-study-planner-buddy.netlify.app',
      'http://localhost:5173'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
};

app.use(cors(corsOptions));


// Enable pre-flight requests for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://ai-study-planner-buddy.netlify.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
dbConnection();

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
