import z from "zod";


export const changeSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    compareNewPassword: z.string().min(8),
  }).refine((data) => data.newPassword === data.compareNewPassword, { path: ['compareNewPassword'], message: 'Passwords do not match' } );

export type ChangePassword = z.infer<typeof changeSchema>;