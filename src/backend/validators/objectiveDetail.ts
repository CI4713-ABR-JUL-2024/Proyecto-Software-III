import { z } from 'zod';

const objetiveDetailCreateObjectBody = z.object({
  objective_id: z.number(),
  keyResult: z.string(),
  keyIndicator: z.string(),
  initiative: z.string(),
  initiativeType_id: z.number(),
});

export type TobjetiveDetailCreateObjectBody = z.infer<
  typeof objetiveDetailCreateObjectBody
>;

export const validatorObjectiveDetailCreate = (body: unknown) => {
  const its_validated = objetiveDetailCreateObjectBody.parse(body);
  return its_validated;
};

const objetiveDetailUpdateObjectBody = z.object({
  objective_id: z.number().optional(),
  keyResult: z.string().optional(),
  keyIndicator: z.string().optional(),
  initiative: z.string().optional(),
  initiativeType_id: z.number().optional(),
});

export type TobjetiveDetailUpdateObjectBody = z.infer<
  typeof objetiveDetailUpdateObjectBody
>;

export const validatorObjectiveDetailUpdate = (body: unknown) => {
  const its_validated = objetiveDetailUpdateObjectBody.parse(body);
  return its_validated;
};

export const objectiveDetailValidator = {
  validatorObjectiveDetailCreate,
  validatorObjectiveDetailUpdate
};
