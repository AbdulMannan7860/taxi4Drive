const jwt = require("jsonwebtoken");
const { sendError } = require("./responses");

function createToken() {
  return jwt.sign({ role: "admin" }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "12h" });
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return sendError(res, 401, "AUTH_REQUIRED", "Authentication required.");
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    return next();
  } catch (error) {
    return sendError(res, 401, "SESSION_EXPIRED", "Session expired. Please sign in again.");
  }
}

module.exports = {
  createToken,
  requireAdmin
};
