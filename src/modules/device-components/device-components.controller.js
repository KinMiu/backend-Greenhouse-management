import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {
  createDeviceComponent,
  deleteDeviceComponent,
  getDeviceDetail,
  getMyGreenhouseDevice,
  toggleActuatorService,
  updateDeviceComponent,
} from "./device-components.service.js";

export const getAllDeviceController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await getMyGreenhouseDevice(req.params.id, req.user.id);

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

export const createDeviceComponentController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and device is required", 400);
    }

    const {id, greenhouseId} = req.params;
    const result = await createDeviceComponent(
      id,
      greenhouseId,
      req.user.id,
      req.body,
    );

    return successResponse(res, result, "Device created successfully", 201);
  } catch (error) {
    logger.error(error);
    return errorResponse(res, error.message, 400);
  }
};

export const getDeviceDetailController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and device is required", 400);
    }

    const {deviceId} = req.params;

    const result = await getDeviceDetail(deviceId, req.user.id);

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

export const updateDeviceComponentController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and device is required", 400);
    }

    const {componentId, deviceId, greenhouseId} = req.params;

    const result = await updateDeviceComponent(
      componentId,
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

export const deleteDeviceComponentController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and device is required", 400);
    }

    const {componentId, deviceId, greenhouseId} = req.params;

    await deleteDeviceComponent(
      componentId,
      deviceId,
      greenhouseId,
      req.user.id,
    );

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

export const toggleActuatorController = async (req, res) => {
  try {
    const {deviceId, componentId} = req.params;
    const {command} = req.body;
    const userId = req.user.id;

    if (typeof command !== "boolean") {
      return errorResponse(res, "Command must be a boolean (true/false)", 400);
    }

    const result = await toggleActuatorService(
      deviceId,
      componentId,
      userId,
      command,
    );

    return successResponse(
      res,
      result,
      `Actuator ${result.component} turned ${result.action} successfully`,
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
