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
require("dotenv").config();

const app = express();
const PORT = 3000;

// ✅ CORS (important fix)
app.use(cors({
  origin: process.env.ORIGIN_URI, // e.g. http://localhost:5173
  credentials: true
}));

app.use(express.json());
dbConnection();

app.get("/", (req, res) => {
  res.send("Hello Express.js 🚀");
});

app.use("/auth", otp);
app.use("/auth", authRoute);
app.use("/auth", authLogin);
app.use("/auth",logoutRoute)
app.use("/api", subjectRoutes);
app.use("/api", adminRoutes);
app.use("/api", contactMessage);
app.use('/payment',paymentRoute)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
