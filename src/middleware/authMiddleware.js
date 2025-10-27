const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// VERIFY ADMIN JWT TOKEN
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // DEBUG: CHECK IF TOKEN IS PRESENT
      console.log("AUTH DEBUG: Token found in headers:", token ? "YES" : "NO");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = await Admin.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      // DEBUG: TOKEN INVALID OR JWT_SECRET MISMATCH
      console.error(
        "AUTH ERROR: Not authorized, token failed.",
        error.message
      );
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log("AUTH DEBUG: No token provided in headers.");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
