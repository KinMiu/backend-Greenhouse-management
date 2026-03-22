import jwt from "jsonwebtoken";
import {errorResponse} from "../utils/response.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // console.log(req.headers);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(decoded);

    req.user = decoded;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

export const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "Forbidden", 403);
    }
    next();
  };
};
