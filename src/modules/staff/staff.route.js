import express from "express";
import {
  deleteGreenhouseStaffsController,
  getMyGreenhouseStaffsController,
  updateStaffController,
} from "./staff.controller.js";
import {authorizeRole, verifyToken} from "../../middleware/auth.middleware.js";
import {validate} from "../../middleware/validate.middleware.js";
import {updateStaffSchema} from "./staff.validator.js";

const router = express.Router();

router.get(
  "/:id/my-staff",
  verifyToken,
  authorizeRole(["OWNER"]),
  getMyGreenhouseStaffsController,
);

router.patch(
  "/:greenhouseId/:staffId",
  verifyToken,
  authorizeRole(["OWNER"]),
  // validate(updateStaffSchema),
  updateStaffController,
);

router.delete(
  "/:greenhouseId/:staffId",
  verifyToken,
  authorizeRole(["OWNER"]),
  deleteGreenhouseStaffsController,
);

export default router;
