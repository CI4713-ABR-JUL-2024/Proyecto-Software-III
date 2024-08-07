import z from 'zod';
import { error_message_dictionary, error_object } from '../interfaces/error';

export class custom_error extends Error {
  public error_message: string;
  public error_message_detail: string;
  public error_code: string;
  public status: number;

  constructor(
    error_message: string,
    error_message_detail: string,
    error_code: string,
    status: number
  ) {
    super(error_message);
    this.error_message = error_message;
    this.error_message_detail = error_message_detail;
    this.error_code = error_code;
    this.status = status;

    Object.setPrototypeOf(this, custom_error.prototype);
  }
}

export const handle_error_http_response = (
  error: any,
  error_code: string
): error_object => {
  var error_object;
  if (error instanceof z.ZodError) {
    error_object = {
      error_message: get_message_for_code(error_code) + '. ' + error.errors[0].message,
      error_message_detail: 'Error en validación',
      error_code,
      status: 400,
    };
  } else {
    console.log(error.message);
    error_object = {
      error_message: get_message_for_code(error_code),
      error_message_detail: error.message,
      error_code,
      status: 500,
    };
  }

  return error_object;
};

const error_message_dict: error_message_dictionary = {
  '0000': 'Error creando usuario',
  '0001': 'Error obteniendo usuario',
  '0002': 'Error listando usuarios',
  '0003': 'Error modificando usuario',
  '0004': 'Error borrando usuario',
  '0005': 'Error modificando contraseña de usuario ',
  '0006': 'Error modificando role de usuario',
  '0007': 'Error obteniendo roles',
  '0008': 'Error creando rol',
  '0009': 'Error modificando rol',
  '0010': 'Error borrando rol',
  '0011': 'Error obteniendo proyectos',
  '0012': 'Error creando proyecto',
  '0013': 'Error modificando proyecto',
  '0014': 'Error borrando proyecto',
  '0015': 'Error obteniendo logs',
  '0016': 'Error creando tipo de iniciativa',
  '0017': 'Error Listando tipo de iniciativa',
  '0018': 'Error actualizando tipo de iniciativa',
  '0019': 'Error creando detalles de objetivo',
  '0020': 'Error actualizando detalles de objetivo',
  '0021': 'Error eliminando detalles de objetivo',
  '0022': 'Error buscando detalles de objetivo',
  '0023': 'Error listando detalles de objetivos',
  '0024': 'Error creando nuevo objetivo',
  '0025': 'Error listando objetivos',
  '0026': 'Error actualizando objetivo',
  '0027': 'Error borrando objetivo',
  '0028': 'Error creando nuevo okr design',
  '0029': 'Error listando okr designs',
  '0030': 'Error actualiazndo okr design',
  '0031': 'Error eliminando okr design'

};

function get_message_for_code(code: string): string {
  return error_message_dict[code] || 'Unknown Error';
}
