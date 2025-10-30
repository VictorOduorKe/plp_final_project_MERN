const jwt=require("jsonwebtoken");

// Function to generate JWT
exports.generateToken = (res,payload, expiresIn = "1h") => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
   // Set the cookie with appropriate options for cross-origin
   res.cookie("token", token, {
    httpOnly: true,
    secure: true,  // Required for cross-origin
    sameSite: 'None',  // Capital N is important for some browsers
    maxAge: expiresIn === "1h" ? 3600000 : expiresIn === "12h" ? 43200000 : 86400000,
    domain: '.onrender.com',  // Allow subdomains
    path: '/'
});

    return token;
};

// Middleware to verify JWT
// Middleware to verify JWT from cookies
exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token; // ✅ Get token from cookie

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
