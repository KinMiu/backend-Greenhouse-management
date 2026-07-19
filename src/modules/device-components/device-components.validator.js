import {z} from "zod";

export const createComponentSchema = z.object({
  name: z
    .string({required_error: "Name is required"})
    .min(2, "Name must be at least 2 characters")
    .trim(),
  type: z.enum(["SENSOR", "ACTUATOR", "CAMERA"], {
    required_error: "Type is required",
    invalid_type_error:
      "Type must be exactly 'SENSOR' or 'ACTUATOR' OR 'CAMERA'",
  }),
  category: z.string().optional(),
  unit: z.string().optional(),
  pin: z.string().optional(),
});

export const updateDeviceSchema = z.object({
  name: z.string().optional(),
  macAddress: z
    .string()
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "Invalid MAC Address format",
    )
    .optional()
    .or(z.literal("")),
  areaId: z.string().optional().nullable(),
});

export const toggleActuatorSchema = z.object({
  command: z.boolean({
    required_error: "Command is required",
    invalid_type_error: "Command must be a boolean (true or false)",
  }),
});
