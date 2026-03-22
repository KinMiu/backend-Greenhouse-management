import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {
  deleteGreenhouseStaffs,
  getMyGreenhouseStaffs,
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

export const deleteGreenhouseStaffsController = async (req, res) => {
  try {
    // console.log(req.query, req.user.id);
    const result = await deleteGreenhouseStaffs(req.query, req.user.id);

    return successResponse(res, null, "Greenhouse deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 403);
  }
};
