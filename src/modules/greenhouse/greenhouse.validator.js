import {z} from "zod";

export const createGreenhouseSchema = z.object({
  name: z.string().min(3, "Greenhouse name must be at least 3 characters"),
  location: z.string().optional(),
});

export const updateGreenhouseSchema = z.object({
  name: z.string().min(3).optional(),
  location: z.string().optional(),
});
