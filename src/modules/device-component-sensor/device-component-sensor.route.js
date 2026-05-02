import express from "express";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {getMyGreenhouseDeviceComponentSensorController} from "./device-component-sensor.controller.js";

const router = express.Router();

router.get(
  "/:greenhouseId/:componentId",
  verifyToken,
  authorizeRole(["OWNER"]),
  getMyGreenhouseDeviceComponentSensorController,
);

export default router;
