import {successResponse, errorResponse} from "../../utils/response.js";
import {
  createArea,
  deleteArea,
  getMyGreenhouseArea,
  updateArea,
} from "./area.service.js";

export const getGreenhouseAreaController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await getMyGreenhouseArea(req.params.id, req.user.id);

    return successResponse(
      res,
      result,
      "Greenhouse Areas retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const createAreaController = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await createArea(req.params.id, req.user.id, req.body);

    return successResponse(res, result, "Area created successfully", 201);
  } catch (error) {
    console.log(error);
    return errorResponse(res, error.message, 400);
  }
};

export const getStaffRoleDetailController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {roleId, greenhouseId} = req.params;

    const result = await getStaffRoleDetail(roleId, greenhouseId, req.user.id);

    return successResponse(res, result, "Area retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateAreaController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {roleId, greenhouseId} = req.params;

    const result = await updateArea(
      roleId,
      greenhouseId,
      req.user.id,
      req.body,
    );

    return successResponse(res, result, "Area retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteAreaController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {roleId, greenhouseId} = req.params;

    await deleteArea(roleId, greenhouseId, req.user.id);

    return successResponse(res, "Area retrieved successfully", 204);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
