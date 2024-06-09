import z from "zod";

export const roleSchema = z.object({
    role: z.string().min(1, 'Select a role'),
});

export type Role = z.infer<typeof roleSchema>;