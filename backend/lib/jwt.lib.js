const jwt = require("jsonwebtoken");

exports.generateToken = (res, payload, expiresIn = "1h") => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: expiresIn === "1h" ? 3600000 : 
            expiresIn === "12h" ? 43200000 : 
            86400000,
    path: "/",
  });

  return token;
};

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access denied. No token." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(400).json({ message: "Invalid token." });
  }
};
