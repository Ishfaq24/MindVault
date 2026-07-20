import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2).max(50),

  lastName: z.string().max(50).optional(),

  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/),

  email: z.string().email(),

  password: z
    .string()
    .min(8)
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),
});
