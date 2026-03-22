import {errorResponse} from "../utils/response.js";

export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    // console.log(req.body);
    try {
      schema.parse(req[property]);
      next();
    } catch (error) {
      // console.log(error);
      const message = error.errors?.map((e) => e.message).join(", ");
      return errorResponse(res, message, 400);
    }
  };
