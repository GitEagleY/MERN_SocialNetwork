const jwt = require("jsonwebtoken");

// Middleware to authenticate the user via JWT
const authMiddleware = (req, res, next) => {
  // Log the incoming request method and URL
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);

  // Extract token from Bearer header
  const token = req.headers.authorization?.split(" ")[1];
  console.log("Extracted token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(403).json({ message: "Invalid token" });
    }

    // Log the decoded user information
    console.log("Decoded user info:", decoded);
    req.user = decoded; // Attach decoded user info to request

    // Proceed to next middleware
    console.log("Authentication successful, proceeding to next middleware");
    next();
  });
};

module.exports = authMiddleware;
