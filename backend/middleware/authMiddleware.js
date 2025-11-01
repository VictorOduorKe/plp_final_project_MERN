const jwt = require("jsonwebtoken");
const User = require("../models/User");



const protect = async (req, res, next) => {
  let token;
  
  console.log('Cookies received:', req.cookies);
  console.log('Headers received:', req.headers);

  // ✅ Check cookies first
  if (req.cookies?.token) {
    token = req.cookies.token;
    console.log('Token found in cookies', token);
  }
  // ✅ Then check Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log('Token found in Authorization header',token);
  }

  if (!token) {
    console.log('No token found in request');
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      console.log('User not found with token payload');
      return res.status(401).json({ message: "User not found" });
    }
    
    console.log('Authentication successful for user:', req.user._id);
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
