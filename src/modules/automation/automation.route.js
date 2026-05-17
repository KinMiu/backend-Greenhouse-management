import express from "express";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {
  createAutomationController,
  deleteAutomationController,
  getAllAutomationByAreaController,
  getAllAutomationController,
  getAutomationDetailController,
  updateAutomationController,
} from "./automation.controller.js";
import {
  createAutomationSchema,
  updateAutomationSchema,
} from "./automation.validator.js";

const router = express.Router();

router.get(
  "/:idgreenhouse/:iddevice/:idcomponent/my",
  verifyToken,
  authorizeRole(["OWNER"]),
  getAllAutomationController,
);

router.get(
  "/:idgreenhouse/:idArea",
  verifyToken,
  authorizeRole(["OWNER"]),
  getAllAutomationByAreaController,
);

router.post(
  "/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(createAutomationSchema),
  createAutomationController,
);

router.get(
  "/:deviceId",
  verifyToken,
  authorizeRole(["OWNER"]),
  getAutomationDetailController,
);

router.patch(
  "/:greenhouseId/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  validate(updateAutomationSchema),
  updateAutomationController,
);

router.delete(
  "/:greenhouseId/:id",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteAutomationController,
);

export default router;
