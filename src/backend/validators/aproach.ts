import { z } from 'zod';
import { roleEnum } from '../interfaces/role';

const approachCreateObjectBody = z.object({
  name: z.string(),
});

export type TApproachCreateObjectBody = z.infer<
  typeof approachCreateObjectBody
>;

export const validatorApproachCreate = (body: unknown) => {
  const its_validated = approachCreateObjectBody.parse(body);
  return its_validated;
};

const approachUpdateObjectBody = z.object({
  name: z.string(),
});

export type TApproachUpdateObjectBody = z.infer<
  typeof approachUpdateObjectBody
>;

export const validatorApproachUpdate = (body: unknown) => {
  const its_validated = approachUpdateObjectBody.parse(body);
  return its_validated;
};

export const approachValidator = {
  validatorApproachCreate,
  validatorApproachUpdate,
};
