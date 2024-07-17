import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { objectiveValidator } from '../validators/objective';
import { error_object } from '../interfaces/error';
import { objectiveService } from '../services/objective';

const post_objective = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = objectiveValidator.validatorObjectiveCreate(body);

    const accessToken = headers().get('Authorization');

    const new_objective = await objectiveService.create_objective(data, accessToken);

    return new_objective;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0024');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};


const get_objectives = async (req: NextRequest) => {
  try {
    let objectives;
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

      objectives = await objectiveService.list_objectives(search_fields, search_texts);
    } else {
        objectives = await objectiveService.list_objectives();
    }

    return objectives;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0025');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};


const update_objective = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let body = await req.json();
    const data = objectiveValidator.validatorObjectiveUpdate(body);
    let objective;
    let prams_id = params.id;
    let id = parseInt(prams_id);

    const accessToken = headers().get('Authorization');
    objective = await objectiveService.update_objective(id, data, accessToken);

    return objective;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0026');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const delete_objective = async (
    req: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      let prams_id = params.id;
      let id = parseInt(prams_id);
  
      const accessToken = headers().get('Authorization');
      if (!accessToken) {
        const handle_err: error_object = handle_error_http_response(
          new Error('No autorizado'),
          '0101'
        );
        throw new custom_error(
          handle_err.error_message,
          handle_err.error_message_detail,
          handle_err.error_code,
          handle_err.status
        );
      }
  
      const deletedObjective = await objectiveService.delete_objective(
        id,
        accessToken
      );
  
      return deletedObjective;
    } catch (error: any) {
      const handle_err: error_object = handle_error_http_response(error, '0027');
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }
  };

  const get_objective = async (
    req: NextRequest,
    { params }: { params: { id: string } }
  ) => {
    try {
      let id = parseInt(params.id); 
  
      const objective = await objectiveService.get_objective(id);
  
      return objective;
    } catch (error: any) {
      const handle_err: error_object = handle_error_http_response(error, '0022');
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }
  };

export const objectiveController = {
  post_objective,
  get_objectives,
  get_objective,
  update_objective,
  delete_objective,

};

