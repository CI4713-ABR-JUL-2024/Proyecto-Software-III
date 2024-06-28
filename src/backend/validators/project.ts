import { ProjectStatus } from '@prisma/client';
import { z } from 'zod';

const months = ["enero", "febrero", "marzo", "abril", "mayo",
  "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const project_update_object_body = z.object({
  description: z.string().optional(),
  start: z.date().optional(),
  end: z.date().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  trimester: z.string().optional(),
  year: z.string().optional(),
  aproach_id: z.number().optional(),
  organization_id: z.number().optional(),
  area: z.string().optional(),
}).refine(data => {
  // Si start o end no están definidos, la validación pasa
  if (!data.start || !data.end) return true;
  // Si start es después de end, la validación falla
  return data.start < data.end;
}, {
  // Mensaje de error personalizado
  message: "El tiempo de inicio debe ser menor al tiempo de fin",
}).refine(data => {
  // Si status no está definido, la validación pasa
  if (!data.status) return true;
  // Si status no es uno de los valores permitidos, la validación falla
  return ["ACTIVE", "INACTIVE"].includes(data.status)
  }, {
    // Mensaje de error personalizado
    message: "El status debe ser 'ACTIVE' o 'INACTIVE'",
    }).refine(data => {
      // Si trimester no está definido, la validación pasa
      if (!data.trimester) return true;
      // Si trimester no es la concatenación de dos meses separados por un guion, la validación falla
      const [month1, month2] = data.trimester.split("-").map(month => month.trim().toLowerCase());
      // Tambien se valida que la distancia entre los meses sea de 3 meses
      const val1 = months.includes(month1) && months.includes(month2);
      const val2 = (months.indexOf(month2) - months.indexOf(month1) === 2) || 
        (months.indexOf(month1) === 11 && months.indexOf(month2) === 1) || 
        (months.indexOf(month1) === 10 && months.indexOf(month2) === 0);
      return val1 && val2; 
    }, {
      // Mensaje de error personalizado
      message: "El trimestre debe ser de 3 meses",
    
    }).refine(data => {
      // Si year no está definido, la validación pasa
      if (!data.year) return true;
      // Si year no es un string de 4 dígitos, la validación falla
      return /^\d{4}$/.test(data.year);
    }, {
      // Mensaje de error personalizado
      message: "El año debe ser de 4 dígitos",
    });

      

const project_create_object_body = z.object({
  description: z.string(),
  start: z.date(),
  end: z.date(),
  aproach_id: z.number(),
  organization_id: z.number(),
  trimester: z.string(),
  year: z.string(),
  area: z.string().optional(),
}).refine(data => {
  return data.start < data.end;
}, {
  // Mensaje de error personalizado
  message: "El tiempo de inicio debe ser menor al tiempo de fin",
}).refine(data => {
  // Si trimester no está definido, la validación pasa
  if (!data.trimester) return true;
  // Si trimester no es la concatenación de dos meses separados por un guion, la validación falla
  const [month1, month2] = data.trimester.split("-").map(month => month.trim().toLowerCase());
  // Tambien se valida que la distancia entre los meses sea de 3 meses
  const val1 = months.includes(month1) && months.includes(month2);
  const val2 = (months.indexOf(month2) - months.indexOf(month1) === 2) || 
    (months.indexOf(month1) === 11 && months.indexOf(month2) === 1) || 
    (months.indexOf(month1) === 10 && months.indexOf(month2) === 0);
  return val1 && val2; 
}, {
  // Mensaje de error personalizado
  message: "El trimestre debe ser de 3 meses",
}).refine(data => {
  // Si year no está definido, la validación pasa
  if (!data.year) return true;
  // Si year no es un string de 4 dígitos, la validación falla
  return /^\d{4}$/.test(data.year);
}, {
  // Mensaje de error personalizado
  message: "El año debe ser de 4 dígitos",

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
  console.log("Passed validation")
  console.log(its_validated)
  return its_validated
}

export const projectValidator = {
  validator_project_update,
  validator_project_create
};