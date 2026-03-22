import express from "express";
import {
  getMeController,
  loginController,
  registerOwnerController,
  registerStaffController,
} from "./auth.controller.js";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {loginSchema, registerOwnerSchema} from "./auth.validator.js";

const router = express.Router();

router.post(
  "/register-owner",
  validate(registerOwnerSchema),
  registerOwnerController,
);

router.post(
  "/:id/register-staff",
  verifyToken,
  authorizeRole(["OWNER"]),
  registerStaffController,
);

router.post("/", validate(loginSchema), loginController);

router.get("/me", verifyToken, getMeController);

export default router;
