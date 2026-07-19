import express from "express";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {
  createComponentSchema,
  toggleActuatorSchema,
  updateDeviceSchema,
} from "./device-components.validator.js";
import {
  createDeviceComponentController,
  deleteDeviceComponentController,
  getAllDeviceController,
  getDeviceDetailController,
  toggleActuatorController,
  updateDeviceComponentController,
} from "./device-components.controller.js";

const router = express.Router();

router.get(
  "/:id/my",
  verifyToken,
  authorizeRole(["OWNER"]),
  getAllDeviceController,
);

router.post(
  "/:id",
  verifyToken,
  authorizeRole(["OWNER", "SUPER_ADMIN"]),
  validate(createComponentSchema),
  createDeviceComponentController,
);

router.get(
  "/:deviceId",
  verifyToken,
  authorizeRole(["OWNER"]),
  getDeviceDetailController,
);

router.patch(
  "/:greenhouseId/:deviceId/:componentId",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(updateDeviceSchema),
  updateDeviceComponentController,
);

router.delete(
  "/:greenhouseId/:deviceId/:componentId",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteDeviceComponentController,
);

router.post(
  "/:deviceId/:componentId/toggle",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(toggleActuatorSchema),
  toggleActuatorController,
);

export default router;
