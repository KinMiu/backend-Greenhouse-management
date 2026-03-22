import {z} from "zod";
import {ALL_PERMISSIONS} from "../../config/permissions.js";

export const createStaffRoleSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .refine((perms) => perms.every((p) => ALL_PERMISSIONS.includes(p)), {
      message: "Invalid permissions detected",
    }),
});

export const updateStaffRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .refine((perms) => perms.every((p) => ALL_PERMISSIONS.includes(p)), {
      message: "Invalid permissions detected",
    })
    .optional(),
});
