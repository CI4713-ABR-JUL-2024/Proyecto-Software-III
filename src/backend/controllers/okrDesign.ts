import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { okrDesignValidator } from '../validators/okrDesign';
import { error_object } from '../interfaces/error';
import { okrDesignService } from '../services/okrDesign';

const post_okrdesign = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = okrDesignValidator.validatorOkrDesignCreate(body);

    const accessToken = headers().get('Authorization');

    const new_okrdesign = await okrDesignService.create_okrdesign(data, accessToken);

    return new_okrdesign;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0028');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};


const get_okrdesigns = async (req: NextRequest) => {
  try {
    let okrdesigns;
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

      okrdesigns = await okrDesignService.list_okrdesigns(search_fields, search_texts);
    } else {
        okrdesigns = await okrDesignService.list_okrdesigns();
    }

    return okrdesigns;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0029');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};


const update_okrdesign = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let body = await req.json();
    const data = okrDesignValidator.validatorOkrDesignUpdate(body);
    let okrdesign;
    let prams_id = params.id;
    let id = parseInt(prams_id);

    const accessToken = headers().get('Authorization');
    okrdesign = await okrDesignService.update_okrdesign(id, data, accessToken);

    return okrdesign;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0030');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const delete_okrdesign = async (
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
  
      const deletedOkrDesign = await okrDesignService.delete_okrdesign(
        id,
        accessToken
      );
  
      return deletedOkrDesign;
    } catch (error: any) {
      const handle_err: error_object = handle_error_http_response(error, '0031');
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }
  };

export const okrDesignController = {
  post_okrdesign,
  get_okrdesigns,
  update_okrdesign,
  delete_okrdesign,

};

