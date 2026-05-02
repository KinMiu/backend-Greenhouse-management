import crypto from "crypto";
import dotenv from "dotenv";
import {errorResponse} from "../utils/response.js";

dotenv.config();

const HEADER = (process.env.API_KEY_HEADER || "x-api-key").toLowerCase();
const KEYS = String(process.env.API_KEYS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const tEq = (a, b) => {
  const A = Buffer.from(String(a || ""), "utf8");
  const B = Buffer.from(String(b || ""), "utf8");

  if (A.length !== B.length) return false;

  return crypto.timingSafeEqual(A, B);
};

const takeKey = (req) => {
  let k = req.headers[HEADER];
  if (Array.isArray(k)) k = k[0];

  if (!k && req.headers.authorization) {
    const m = /^ApiKey\s+(.+)$/i.exec(req.headers.authorization);
    if (m) k = m[1];
  }
  return k;
};

export function requireApiKey() {
  const pool = KEYS;

  // console.log(pool);
  return (req, res, next) => {
    if (pool.length === 0) {
      return errorResponse(res, "API key is not configured", 400);
    }

    const key = takeKey(req);
    if (!key) {
      return errorResponse(res, "UNAUTHORIZED", 401);
    }

    if (!pool.some((k) => tEq(key, k))) {
      return errorResponse(res, "API KEY IS INVALID", 401);
    }

    next();
  };
}
