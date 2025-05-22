// middleware/auth.js
import jwt from "jsonwebtoken";

/**
 * Verify JWT token and add user to request
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - Token expired",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Unauthorized - Invalid token",
    });
  }
};

/**
 * Check if user has the required role
 * @param {string} role - Required role
 */
const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes(role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden - Requires ${role} role`,
      });
    }

    next();
  };
};

/**
 * Check if user has any of the required roles
 * @param {Array} roles - Array of allowed roles
 */
const hasAnyRole = (roles) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !req.user.roles ||
      !req.user.roles.some((role) => roles.includes(role))
    ) {
      return res.status(403).json({
        success: false,
        error: `Forbidden - Requires one of these roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

export default {
  verifyToken,
  hasRole,
  hasAnyRole,
};
