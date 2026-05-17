import express from "express";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {createAreaSchema, updateUpdateSchema} from "./area.validator.js";
import {
  createAreaController,
  deleteAreaController,
  getAreaDetailController,
  getGreenhouseAreaController,
  updateAreaController,
} from "./area.controller.js";

const router = express.Router();

router.get(
  "/:id/my",
  verifyToken,
  authorizeRole(["OWNER"]),
  getGreenhouseAreaController,
);

router.post(
  "/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(createAreaSchema),
  createAreaController,
);

router.get(
  "/:areaId",
  verifyToken,
  authorizeRole(["OWNER"]),
  getAreaDetailController,
);

router.patch(
  "/:greenhouseId/:roleId",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(updateUpdateSchema),
  updateAreaController,
);

router.delete(
  "/:greenhouseId/:roleId",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteAreaController,
);

export default router;
