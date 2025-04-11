// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next(); // pass control
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken; // ✅ Export the function directly
