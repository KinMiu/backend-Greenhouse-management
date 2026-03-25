import express from "express";
import {
  createDeviceController,
  deleteStaffRoleController,
  getGreenhouseStaffRolesController,
  getStaffRoleDetailController,
  updateStaffRoleController,
} from "./device.controller.js";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {createDeviceSchema, updateDeviceSchema} from "./device.validator.js";

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
  validate(createDeviceSchema),
  createDeviceController,
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
  validate(updateDeviceSchema),
  updateStaffRoleController,
);

router.delete(
  "/:greenhouseId/:roleId",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteStaffRoleController,
);

export default router;
