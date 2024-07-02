import { z } from 'zod';

const objectiveCreateObjectBody = z.object({
  name: z.string(),
  okrDesignId: z.number()
});

export type TObjectiveCreateObjectBody = z.infer<
  typeof objectiveCreateObjectBody
>;

export const validatorObjectiveCreate = (body: unknown) => {
  const its_validated = objectiveCreateObjectBody.parse(body);
  return its_validated;
};

const objectiveUpdateObjectBody = z.object({
  name: z.string(),
  okrDesignId: z.number().optional(),
});

export type TObjectiveUpdateObjectBody = z.infer<
  typeof objectiveUpdateObjectBody
>;

export const validatorObjectiveUpdate = (body: unknown) => {
  const its_validated = objectiveUpdateObjectBody.parse(body);
  return its_validated;
};

export const objectiveValidator = {
  validatorObjectiveCreate,
  validatorObjectiveUpdate,
};


