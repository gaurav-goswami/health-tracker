import { z } from "zod";

const healthStatus = ["HEALTHY", "SICK", "CRITICAL"] as const;

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const healthSchema = z.object({
  name: z
    .string({ message: "Patient name is required" })
    .min(1, { message: "Name should have at least 1 character" }),
  age: z.number().positive({ message: "Age should be a positive number" }),
  status: z.enum(healthStatus).transform((val) => val.trim()),
});
