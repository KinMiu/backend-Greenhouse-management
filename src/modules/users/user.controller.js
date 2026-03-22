import {errorResponse, successResponse} from "../../utils/response.js";
import {activateUser, getAllUsers} from "./user.service.js";

export const activateUserController = async (req, res) => {
  try {
    console.log(req.params.id, req.query);
    const result = await activateUser(req.params.id, req.query);

    return successResponse(res, result, "User activated successfully");
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const result = await getAllUsers(req.query);

    return successResponse(res, result, "Users retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};
