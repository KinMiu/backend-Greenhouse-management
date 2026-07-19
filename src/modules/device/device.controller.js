import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {
  createDevice,
  deleteDevice,
  getDeviceDetail,
  getMyGreenhouseDevice,
  getMyGreenhouseDeviceByGreenhouse,
  updateDevice,
} from "./device.service.js";

export const getAllDeviceController = async (req, res) => {
  try {
    const result = await getMyGreenhouseDevice(req.user.id);

    return successResponse(
      res,
      result,
      "Greenhouse devices retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllDeviceControllerByGreenhouse = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await getMyGreenhouseDeviceByGreenhouse(
      req.params.id,
      req.user.id,
    );

    return successResponse(
      res,
      result,
      "Greenhouse devices retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const createDeviceController = async (req, res) => {
  try {
    const result = await createDevice(req.user.id, req.body);

    return successResponse(res, result, "Device created successfully", 201);
  } catch (error) {
    logger.error(error);
    return errorResponse(res, error.message, 400);
  }
};

export const getDeviceDetailController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {deviceId} = req.params;

    const result = await getDeviceDetail(deviceId, req.user);

    return successResponse(
      res,
      result,
      "Greenhouse devices retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateDeviceController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and deviceId is required", 400);
    }

    const {deviceId, greenhouseId} = req.params;

    const result = await updateDevice(
      deviceId,
      greenhouseId,
      req.user.id,
      req.body,
    );

    return successResponse(
      res,
      result,
      "Greenhouse devices retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const deleteDeviceController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {roleId, greenhouseId} = req.params;

    await deleteDevice(roleId, greenhouseId, req.user.id);

    return successResponse(
      res,
      null,
      "Greenhouse devices retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
