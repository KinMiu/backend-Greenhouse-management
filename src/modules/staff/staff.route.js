import express from "express";
import {
  deleteGreenhouseStaffsController,
  getMyGreenhouseStaffsController,
} from "./staff.controller.js";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/:id/my-staff",
  verifyToken,
  authorizeRole(["OWNER"]),
  getMyGreenhouseStaffsController,
);

router.delete(
  "/",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteGreenhouseStaffsController,
);

export default router;
