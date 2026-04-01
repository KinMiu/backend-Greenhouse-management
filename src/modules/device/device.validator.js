import {z} from "zod";

export const createDeviceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  macAddress: z
    .string()
    .regex(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "Invalid MAC Address format",
    ),
  areaId: z.string().optional().nullable(),
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
