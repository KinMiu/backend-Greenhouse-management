import {z} from "zod";

export const createAreaSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  description: z.string().optional(),
});

export const updateUpdateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
