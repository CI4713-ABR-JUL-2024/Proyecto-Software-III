import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { initiativeValidator } from '../validators/initiativeType';
import { error_object } from '../interfaces/error';
import { initiativeService } from '../services/initiativeType';

const post_initiative = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = initiativeValidator.validator_initiative_create(body);

    const accessToken = headers().get('Authorization');

    const new_initiative = await initiativeService.create_initiative(data, accessToken);

    return new_initiative;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0016');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};


const get_initiatives = async (req: NextRequest) => {
  try {
    let initiatives;
    const search_field = req.nextUrl.searchParams.get('search_field');
    const search_text = req.nextUrl.searchParams.get('search_text');
    if (
      (search_field != null && !search_text) ||
      (!search_field && search_text != null)
    ) {
      throw new Error(
        'both parameters (search_field and search_text) must be provided'
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

      if (search_fields.length !== search_texts.length) {
        throw new Error(
          'The search_field and search_text parameters must have the same number of elements.'
        );
      }

      initiatives = await initiativeService.list_initiatives(search_fields, search_texts);
    } else {
      initiatives = await initiativeService.list_initiatives();
    }

    return initiatives;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0017');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};


const update_initiative = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let body = await req.json();
    const data = initiativeValidator.validator_initiative_update(body);
    let initiative;
    let prams_id = params.id;
    let id = parseInt(prams_id);

    const accessToken = headers().get('Authorization');
    initiative = await initiativeService.update_initiative(id, data,accessToken);

    return initiative;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0018');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};



export const initiativeController = {
  post_initiative,
  get_initiatives,
  update_initiative

};

