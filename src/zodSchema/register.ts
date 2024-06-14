import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPass: z.string().min(8),
  name: z.string().min(1),
  last_Name: z.string().min(1),
  telephone: z.string().min(10),
});

export type User = z.infer<typeof registerSchema>;