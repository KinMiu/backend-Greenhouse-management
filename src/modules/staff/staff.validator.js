import {z} from "zod";

export const registerStaffSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  staffRoleId: z.string().optional,
});

export const updateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.email().optional(),
  password: z.string().min(8).optional(),
  staffRoleId: z.string().optional(),
});
