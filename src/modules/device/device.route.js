import express from "express";
import {
  createDeviceController,
  deleteDeviceController,
  getAllDeviceController,
  getAllDeviceControllerByGreenhouse,
  getDeviceDetailController,
  updateDeviceController,
} from "./device.controller.js";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {createDeviceSchema, updateDeviceSchema} from "./device.validator.js";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  authorizeRole(["SUPER_ADMIN"]),
  getAllDeviceController,
);

router.get(
  "/:id/my",
  verifyToken,
  authorizeRole(["OWNER"]),
  getAllDeviceControllerByGreenhouse,
);

router.post(
  "/",
  verifyToken,
  authorizeRole(["SUPER_ADMIN"]),
  validate(createDeviceSchema),
  createDeviceController,
);

router.get(
  "/:deviceId",
  verifyToken,
  authorizeRole(["OWNER", "SUPER_ADMIN"]),
  getDeviceDetailController,
);

router.patch(
  "/:greenhouseId/:deviceId",
  verifyToken,
  authorizeRole(["OWNER", "SUPER_ADMIN"]),
  validate(updateDeviceSchema),
  updateDeviceController,
);

router.delete(
  "/:greenhouseId/:roleId",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteDeviceController,
);

export default router;
