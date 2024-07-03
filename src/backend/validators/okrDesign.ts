import { z } from 'zod';

const okrDesignCreateObjectBody = z.object({
  project_id: z.number(),
});

export type TOkrDesignCreateObjectBody = z.infer<
  typeof okrDesignCreateObjectBody
>;

export const validatorOkrDesignCreate = (body: unknown) => {
  const its_validated = okrDesignCreateObjectBody.parse(body);
  return its_validated;
};

const okrDesignUpdateObjectBody = z.object({
  project_id: z.number().optional(),
});

export type TOkrDesignUpdateObjectBody = z.infer<
  typeof okrDesignUpdateObjectBody
>;

export const validatorOkrDesignUpdate = (body: unknown) => {
  const its_validated = okrDesignUpdateObjectBody.parse(body);
  return its_validated;
};

export const okrDesignValidator = {
  validatorOkrDesignCreate,
  validatorOkrDesignUpdate,
};
