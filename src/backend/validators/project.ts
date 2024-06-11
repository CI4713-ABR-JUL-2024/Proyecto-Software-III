import { z } from 'zod';

const project_update_object_body = z.object({
  description: z.string().optional(),
  start: z.date().optional(),
  end: z.date().optional(),
});

export type TProject_update_object_body = z.infer<typeof project_update_object_body>;

export const validator_project_update = (body: unknown) => {
  const its_validated = project_update_object_body.parse(body);
  return its_validated;
};

export const projectValidator = {
  validator_project_update,
};