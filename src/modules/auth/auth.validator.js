import {z} from "zod";

export const registerOwnerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  greenhouseName: z.string().min(3),
  location: z.string().optional(),
});

export const registerStaffSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  staffRoleId: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email("Email must be a valid email address").toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 character"),
});
