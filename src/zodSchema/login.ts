import z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});


export const loginResponse = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  ci:z.string(),
  role: z.string(),
  accessToken: z.string(),
})

export type User = z.infer<typeof loginSchema>;
export type TLoginResponse = z.infer<typeof loginResponse>;  