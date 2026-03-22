import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {
  createGreenhouse,
  deleteGreenhouse,
  getGreenhouseDetail,
  getMyGreenhouse,
  updateGreenhouse,
} from "./greenhouse.service.js";

export const getMyGreenhouseController = async (req, res) => {
  try {
    const result = await getMyGreenhouse(req.user.id);

    return successResponse(res, result, "Greenhouse retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getGreenhouseDetailController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await getGreenhouseDetail(req.params.id, req.user);

    return successResponse(res, result, "Greenhouse retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const createGreenhouseController = async (req, res) => {
  try {
    const result = await createGreenhouse(req.user.id, req.body);

    return successResponse(res, result, "Greenhouse created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateGreenhouseController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await updateGreenhouse(req.params.id, req.user, req.body);

    return successResponse(res, result, "Greenhouse updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 403);
  }
};

export const deleteGreenhouseController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    await deleteGreenhouse(req.params.id, req.user.id);

    return successResponse(res, null, "Greenhouse deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 403);
  }
};
