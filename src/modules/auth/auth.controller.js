import logger from "../../utils/logger.js";
import {successResponse, errorResponse} from "../../utils/response.js";
import {getMe, login, registerOwner, registerStaff} from "./auth.service.js";

export const registerOwnerController = async (req, res) => {
  try {
    const result = await registerOwner(req.body);

    return successResponse(
      res,
      result,
      "Registration successful. Awaiting admin approval.",
      201,
    );
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const registerStaffController = async (req, res) => {
  try {
    console.log("tes aja");
    const result = await registerStaff(req.params.id, req.user.id, req.body);

    return successResponse(res, result, "Registration successful", 201);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const loginController = async (req, res) => {
  try {
    console.log("tes");
    const result = await login(req.body);

    return successResponse(res, result, "Login Successful");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

export const getMeController = async (req, res) => {
  try {
    const result = await getMe(req.user.id);

    return successResponse(res, result, "Profile retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
