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
/*const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://ai-study-planner-buddy.netlify.app'
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
};*/
const allowedOrigins = [
  process.env.ORIGIN_URI,
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);

    callback(new Error("❌ CORS blocked: " + origin));
  },
  credentials: true,
};

app.set("trust proxy", 1); // ✅ only here

app.use(cors(corsOptions)); // ✅ MUST be here before routes
app.options(/^\/.*/, cors(corsOptions)); // ✅ preflight
app.use(cookieParser());
app.use(express.json());

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
  if(process.env.NODE_ENV==='production'){
    app.set('trust proxy', 1); // trust first proxy
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
