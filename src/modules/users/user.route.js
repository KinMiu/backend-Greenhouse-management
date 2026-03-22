import express from "express";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {
  activateUserController,
  getAllUsersController,
} from "./user.controller.js";

const router = express.Router();

router.patch(
  "/:id/activate",
  verifyToken,
  authorizeRole(["SUPER_ADMIN"]),
  activateUserController,
);

router.get(
  "/",
  verifyToken,
  authorizeRole(["SUPER_ADMIN"]),
  getAllUsersController,
);

export default router;
