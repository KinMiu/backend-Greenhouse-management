import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {
  deleteGreenhouseStaffs,
  getMyGreenhouseStaffs,
  updateStaff,
} from "./staff.service.js";

export const getMyGreenhouseStaffsController = async (req, res) => {
  try {
    const result = await getMyGreenhouseStaffs(req.params.id, req.user.id);

    return successResponse(
      res,
      result,
      "Greenhouse Staff retrieved successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateStaffController = async (req, res) => {
  try {
    console.log("ini masuk");
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {staffId, greenhouseId} = req.params;

    const result = await updateStaff(
      staffId,
      greenhouseId,
      req.user.id,
      req.body,
    );

    return successResponse(
      res,
      result,
      "Greenhouse staff role retrieved successfully",
      200,
    );
  } catch (error) {
    console.log(error);
    return errorResponse(res, error.message, 400);
  }
};

export const deleteGreenhouseStaffsController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {staffId, greenhouseId} = req.params;

    await deleteGreenhouseStaffs(staffId, greenhouseId, req.user.id);

    return successResponse(res, null, "Greenhouse deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 403);
  }
};
