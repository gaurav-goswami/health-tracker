import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const formSchema = z.object({
    name: z.string().min(1, { message: "Patient name is required" }),
    age: z
        .string({message: "Enter age"})
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val) && val > 0, {
            message: "Enter a valid age",
        }),

    status: z.enum(["HEALTHY", "SICK", "CRITICAL"], {
        errorMap: () => ({ message: "Select a valid status" }),
    }),
});