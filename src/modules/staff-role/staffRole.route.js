import express from "express";
import {
  createStaffRoleController,
  deleteStaffRoleController,
  getGreenhouseStaffRolesController,
  getStaffRoleDetailController,
  updateStaffRoleController,
} from "./staffRole.controller.js";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {
  createStaffRoleSchema,
  updateStaffRoleSchema,
} from "./staffRole.validator.js";

const router = express.Router();

router.get(
  "/:id/my",
  verifyToken,
  authorizeRole(["OWNER"]),
  getGreenhouseStaffRolesController,
);

router.post(
  "/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(createStaffRoleSchema),
  createStaffRoleController,
);

router.get(
  "/:greenhouseId/:roleId",
  verifyToken,
  authorizeRole(["OWNER"]),
  getStaffRoleDetailController,
);

router.patch(
  "/:greenhouseId/:roleId",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(updateStaffRoleSchema),
  updateStaffRoleController,
);

router.delete(
  "/:greenhouseId/:roleId",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteStaffRoleController,
);

export default router;
