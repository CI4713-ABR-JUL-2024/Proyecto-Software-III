import { z } from 'zod';
import { roleEnum } from '../interfaces/role';

const user_create_object_body = z.object({
  name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
  telephone: z.string(),
  password: z.string().min(8),
  role_name: z.enum(roleEnum).optional(),
});

export type TUser_create_object_body = z.infer<typeof user_create_object_body>;

export const validator_user_create = (body: unknown) => {
  const its_validated = user_create_object_body.parse(body);
  return its_validated;
};

const user_update_object_body = z.object({
  name: z.string(),
  role: z.string(),
});

export const validator_user_update = (body: unknown) => {
  const its_validated = user_update_object_body.parse(body);
  return its_validated;
};

const user_update_password_body = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  compareNewPassword: z.string().min(8),
});

type TUser_update_password_body = z.infer<typeof user_update_password_body>;

export const validator_user_update_password_body = (
  body: TUser_update_password_body
) => {
  const its_validated = user_update_password_body.parse(body);
  return its_validated;
};

const user_data = z.object({
  id: z.number(),
  role: z.string(),
});

export const validator_user_data = (body: any) => {
  const its_validated = user_data.parse(body);
  return its_validated;
};

const updateUserRole = z.object({
  role: z.enum(roleEnum),
});

export type TUpdateUserRole = z.infer<typeof updateUserRole>;

const validatorUpdateUserRole = (body: TUpdateUserRole) =>
  updateUserRole.parse(body);

export const userValidator = {
  validator_user_create,
  validator_user_update,
  validator_user_update_password_body,
  validator_user_data,
  validatorUpdateUserRole,
};
