import { z } from 'zod';

const project_update_object_body = z.object({
  description: z.string().optional(),
  start: z.date().optional(),
  end: z.date().optional(),
}).refine(data => {
  // Si start o end no están definidos, la validación pasa
  if (!data.start || !data.end) return true;
  // Si start es después de end, la validación falla
  return data.start < data.end;
}, {
  // Mensaje de error personalizado
  message: "El tiempo de inicio debe ser menor al tiempo de fin",
});

const project_create_object_body = z.object({
  description: z.string(),
  start: z.date(),
  end: z.date(),
}).refine(data => {
  return data.start < data.end;
}, {
  // Mensaje de error personalizado
  message: "El tiempo de inicio debe ser menor al tiempo de fin",
});

export type TProject_update_object_body = z.infer<typeof project_update_object_body>;
export type TProject_create_object_body = z.infer<typeof project_create_object_body>;

/**
 * Validates the update body of a project.
 * @param body - The body to be validated.
 * @returns The validated body.
 */
export const validator_project_update = (body: unknown) => {
  const its_validated = project_update_object_body.parse(body);
  return its_validated;
};

export const validator_project_create = (body: any) => {
  const its_validated = project_create_object_body.parse(body)
  return its_validated
}

export const projectValidator = {
  validator_project_update,
  validator_project_create
};