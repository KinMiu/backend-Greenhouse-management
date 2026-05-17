import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {
  createAutomation,
  deleteAutomation,
  getAutomationDetail,
  getMyGreenhouseAutomation,
  getMyGreenhouseAutomationByArea,
  updateAutomation,
} from "./automation.service.js";

export const getAllAutomationController = async (req, res) => {
  try {
    if (
      !req.params.idgreenhouse ||
      !req.params.iddevice ||
      !req.params.idcomponent
    ) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await getMyGreenhouseAutomation(
      req.params.idgreenhouse,
      req.params.iddevice,
      req.params.idcomponent,
      req.user.id,
    );

    return successResponse(
      res,
      result,
      "Schedule devices retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getAllAutomationByAreaController = async (req, res) => {
  try {
    if (!req.params.idgreenhouse || !req.params.idArea) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await getMyGreenhouseAutomationByArea(
      req.params.idgreenhouse,
      req.params.idArea,
      req.user.id,
    );

    return successResponse(
      res,
      result,
      "Schedule devices retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const createAutomationController = async (req, res) => {
  try {
    if (!req.params.id) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }
    const result = await createAutomation(req.params.id, req.user.id, req.body);

    return successResponse(res, result, "Schedule created successfully", 201);
  } catch (error) {
    logger.error(error);
    return errorResponse(res, error.message, 400);
  }
};

export const getAutomationDetailController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {deviceId} = req.params;

    const result = await getAutomationDetail(deviceId, req.user.id);

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

export const updateAutomationController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {id, greenhouseId} = req.params;

    const result = await updateAutomation(
      id,
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

export const deleteAutomationController = async (req, res) => {
  try {
    if (!req.params) {
      return errorResponse(res, "Greenhouse and role is required", 400);
    }

    const {id, greenhouseId} = req.params;

    await deleteAutomation(id, greenhouseId, req.user.id);

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
