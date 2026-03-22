import express from "express";
import {
  createGreenhouseController,
  deleteGreenhouseController,
  getGreenhouseDetailController,
  getMyGreenhouseController,
  updateGreenhouseController,
} from "./greenhouse.controller.js";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {
  createGreenhouseSchema,
  updateGreenhouseSchema,
} from "./greenhouse.validator.js";

const router = express.Router();

router.get(
  "/my",
  verifyToken,
  authorizeRole(["OWNER"]),
  getMyGreenhouseController,
);

router.get(
  "/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  getGreenhouseDetailController,
);

router.post(
  "/",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(createGreenhouseSchema),
  createGreenhouseController,
);

router.patch(
  "/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(updateGreenhouseSchema),
  updateGreenhouseController,
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteGreenhouseController,
);

export default router;
