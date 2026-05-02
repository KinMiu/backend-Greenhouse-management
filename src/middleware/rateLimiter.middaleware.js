import rateLimit from "express-rate-limit";
import {success} from "zod";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too much request from this IP. Please wait 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "To much login attempt. Try again in 1 hour",
  },
});
