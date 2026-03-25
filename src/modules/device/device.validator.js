import {z} from "zod";
import {ALL_PERMISSIONS} from "../../config/permissions.js";

export const createDeviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  type: z.enum(["SENSOR", "ACTUATOR"], {
    required_error: "Device type is required",
    invalid_type_error: "Type must be either Sensor of Actuator",
  }),
  macAddress: z
    .string()
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "Invalid MAC Address format",
    ),
  status: z.enum(["ONLINE", "OFFLINE", "ERROR"]).optional(),
  areaId: z.string().optional().nullable(),
});

export const updateDeviceSchema = z.object({
  name: z.string().optional(),
  type: z.enum(["SENSOR", "ACTUATOR"]).optional(),
  macAddress: z
    .string()
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "Invalid MAC Address format",
    )
    .optional()
    .or(z.literal("")),
  status: z.enum(["ONLINE", "OFFLINE", "ERROR"]).optional(),
  areaId: z.string().optional().nullable(),
});
