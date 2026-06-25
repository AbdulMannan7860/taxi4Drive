const jwt = require("jsonwebtoken");

function createToken() {
  return jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "12h" });
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Session expired. Please sign in again." });
  }
}

module.exports = {
  createToken,
  requireAdmin
};
