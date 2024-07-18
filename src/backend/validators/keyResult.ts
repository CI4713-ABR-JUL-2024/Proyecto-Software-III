import { z } from 'zod';
import { roleEnum } from '../interfaces/role';

const keyResultCreateObjectBody = z.object({
    keyResult: z.string(),
    keyIndicator: z.string(),
    initiative: z.string(),
    initiativeType_id: z.number(),
    objectiveDetail: z.array(z.number()),
});

const keyResultUpdateObjectBody = z.object({
  keyResult: z.string().optional(),
  keyIndicator: z.string().optional(),
  initiative: z.string().optional(),
  initiativeType_id: z.number().optional(),
  // objectiveDetail: z.array(z.number()),
});


export type TKeyOrganizationCreateObjectBody = z.infer<
  typeof keyResultCreateObjectBody
>;

export const validatorketResultCreate = (body: unknown) => {
  const its_validated = keyResultCreateObjectBody.parse(body);
  return its_validated;
};

export type TKeyOrganizationUpdateObjectBody = z.infer<
  typeof keyResultUpdateObjectBody
>;
export const validatorketResultUpdate = (body: unknown) => {
  const its_validated = keyResultUpdateObjectBody.parse(body);
  return its_validated;
};

export const keyResultValidator = {
    validatorketResultCreate,
    validatorketResultUpdate,
};

export const matrixKeyResultsUpdateBody = z.object({
    initiative: z.string(),
    values: z.array(z.number()).optional(),
    priority: z.number().optional(),
    types: z.array(z.string()).optional(),
});

export const validatormatrixUpdate = (body: unknown) => {
  const its_validated = matrixKeyResultsUpdateBody.parse(body);
  return its_validated;
};

export type TMatrixKeyResultsUpdateBody = z.infer<
  typeof matrixKeyResultsUpdateBody
>;