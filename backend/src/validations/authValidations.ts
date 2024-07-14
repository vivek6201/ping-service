import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3),
    confirmPassword: z.string().min(3),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password do not match",
  });