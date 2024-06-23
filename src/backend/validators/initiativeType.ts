import { z } from 'zod';
import { roleEnum } from '../interfaces/role';

const initiative_create_object_body = z.object({
  name: z.string()
});

export type TInitiative_create_object_body = z.infer<typeof initiative_create_object_body>;

export const validator_initiative_create = (body: unknown) => {
  const its_validated = initiative_create_object_body.parse(body);
  return its_validated;
};

const initiative_update_object_body = z.object({
  name: z.string(),
});

type TUser_update_password_body = z.infer<typeof initiative_update_object_body>;

export const validator_initiative_update = (body: unknown) => {
  const its_validated = initiative_update_object_body.parse(body);
  return its_validated;
};

export const initiativeValidator = {
    validator_initiative_create,
    validator_initiative_update
    
  };
  