const jwt = require("jsonwebtoken");
const User = require("../models/User");



const protect = async (req, res, next) => {
  let token;

  // ✅ Check cookies first
  if (req.cookies?.token) {
    token = req.cookies.token;
  }
  // ✅ Then check Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};



const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
