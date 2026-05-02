import {z} from "zod";

export const createAutomationSchema = z.object({
  deviceId: z.string().uuid("Invalid device ID format"),
  componentId: z.string().uuid("Invalid component ID format"),
  action: z.string().min(1, "Action is required").trim(),
  time: z.string().min(1, "Time is required").trim(),
  duration: z.number().int().nonnegative("Duration must be a positive number"),
});

export const updateAutomationSchema = z.object({
  deviceId: z.string().uuid("Invalid device ID format"),
  componentId: z.string().uuid("Invalid component ID format"),
  action: z.string().min(1, "Action is required").trim(),
  time: z.string().min(1, "Time is required").trim(),
  duration: z.number().int().nonnegative("Duration must be a positive number"),
});
