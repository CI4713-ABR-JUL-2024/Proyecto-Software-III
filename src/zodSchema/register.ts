import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPass: z.string().min(8),
  name: z.string(),
  last_Name: z.string(),
  telephone: z.string(),
  role: z.string().min(1, 'Select a role'),
});

export type User = z.infer<typeof registerSchema>;