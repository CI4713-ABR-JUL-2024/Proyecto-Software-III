import { z } from 'zod';
import { roleEnum } from '../interfaces/role';

const organizationCreateObjectBody = z.object({
  name: z.string(),
  country: z.string(),
  estate: z.string(),
  email: z.string().email(),
  cellphone: z.string(),
  personResponsible: z.string(),
});

export type TOrganizationCreateObjectBody = z.infer<
  typeof organizationCreateObjectBody
>;

export const validatorOrganizationCreate = (body: unknown) => {
  const its_validated = organizationCreateObjectBody.parse(body);
  return its_validated;
};

const organizationUpdateObjectBody = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  estate: z.string().optional(),
  email: z.string().email().optional(),
  cellphone: z.string().optional(),
  personResponsible: z.string().optional(),
});

export type TOrganizationUpdateObjectBody = z.infer<
  typeof organizationUpdateObjectBody
>;

export const validatorOrganizationUpdate = (body: unknown) => {
  const its_validated = organizationUpdateObjectBody.parse(body);
  return its_validated;
};
const organizationListObject = z.object({
  search: z.string().optional(),
});

export type TOrganizationListObject = z.infer<typeof organizationListObject>;

const validatorOrganizationList = (body: unknown) => {
  const its_validated = organizationListObject.parse(body);
  return its_validated;
};

export const organizationValidator = {
  validatorOrganizationCreate,
  validatorOrganizationUpdate,
  validatorOrganizationList,
};
