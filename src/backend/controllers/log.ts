import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
    custom_error,
    handle_error_http_response,
} from '../utils/error_handler';
import { error_object } from '../interfaces/error';

import { logService } from '../services/log';


/**
 * Retrieves logs based on search criteria.
 * @param req - The NextRequest object containing the search parameters.
 * @returns A Promise that resolves to the retrieved logs.
 * @throws {custom_error} If an error occurs while retrieving the logs.
 */
const get_logs = async (req: NextRequest) => {
  try {
    let logs;
    const search_field = req.nextUrl.searchParams.get('search_field');
    const search_text = req.nextUrl.searchParams.get('search_text');
    if (
      (search_field != null && !search_text) ||
      (!search_field && search_text != null)
    ) {
      throw new Error(
        'Si se envía un campo de búsqueda, se debe enviar un texto de búsqueda'
      );
    }

    if (search_field != null && search_text != null) {
      let search_fields = [];
      let search_texts = [];
      search_fields = search_field.toString().includes(',')
        ? search_field.toString().split(',')
        : [search_field.toString()];
      search_texts = search_text.toString().includes(',')
        ? search_text.toString().split(',')
        : [search_text.toString()];

      logs = await logService.list_logs(search_fields, search_texts);
    } else {
      logs = await logService.list_logs();
    }

    return logs;
  } catch (error) {
    const handle_err: error_object = handle_error_http_response(error, '0001');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

export const logController = {
    get_logs,
};