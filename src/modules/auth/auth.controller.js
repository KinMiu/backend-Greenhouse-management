import ms from "ms";
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
    const duration = ms(process.env.JWT_EXPIRES_IN || "1d");
    const result = await login(req.body);

    res.cookie("user_role", result.user.role, {
      httpOnly: false,
      secure: false,
      maxAge: duration,
      path: "/",
      sameSite: "lax",
    });

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: duration,
      path: "/",
      sameSite: "lax",
    });

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

export const logoutController = async (req, res) => {
  try {
    const result = await getMe(req.user.id);

    return successResponse(res, result, "Profile retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
