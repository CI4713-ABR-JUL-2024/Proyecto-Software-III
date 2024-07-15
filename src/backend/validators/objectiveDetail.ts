import { z } from 'zod';

const objetiveDetailCreateObjectBody = z.object({
  objective_id: z.number(),
  keyResult_id: z.number().optional(),
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
  keyResult_id: z.number().optional(),
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
