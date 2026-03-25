import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {
  createDevice,
  deleteStaffRole,
  getMyGreenhouseDevice,
  getStaffRoleDetail,
  updateStaffRole,
} from "./device.service.js";

export const getGreenhouseStaffRolesController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await getMyGreenhouseDevice(req.params.id, req.user.id);

    return successResponse(
      res,
      result,
      "Greenhouse staff role retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const createDeviceController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await createDevice(req.params.id, req.user.id, req.body);

    return successResponse(res, result, "Staff role created successfully", 201);
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

    return successResponse(
      res,
      result,
      "Greenhouse staff role retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateStaffRoleController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {roleId, greenhouseId} = req.params;

    const result = await updateStaffRole(
      roleId,
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
    return errorResponse(res, error.message, 400);
  }
};

export const deleteStaffRoleController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {roleId, greenhouseId} = req.params;

    await deleteStaffRole(roleId, greenhouseId, req.user.id);

    return successResponse(
      res,
      "Greenhouse staff role retrieved successfully",
      204,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
