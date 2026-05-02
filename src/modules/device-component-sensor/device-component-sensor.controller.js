import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {getMyGreenhouseDeviceComponentSensor} from "./device-component-sensor.service.js";

export const getMyGreenhouseDeviceComponentSensorController = async (
  req,
  res,
) => {
  try {
    const {greenhouseId, componentId} = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    if (!req.params.greenhouseId) {
      return errorResponse(res, "Greenhouse ID is required", 400);
    }

    if (!componentId) {
      return errorResponse(res, "Component ID is required", 400);
    }

    const result = await getMyGreenhouseDeviceComponentSensor(
      greenhouseId,
      userId,
      componentId,
      page,
      limit,
    );

    return successResponse(
      res,
      result,
      "Component sensor datas retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
