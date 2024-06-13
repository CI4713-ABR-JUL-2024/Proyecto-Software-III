import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { userValidator } from '../validators/user';
import { error_object } from '../interfaces/error';
import { userService } from '../services/user';

const post_user = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = userValidator.validator_user_create(body);

    const accessToken = headers().get('Authorization');

    const new_user = await userService.create_user(data, accessToken);

    return new_user;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0000');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const get_user = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let user;
    let prams_id = params.id;
    let id = parseInt(prams_id);
    user = await userService.read_user(id);

    return user;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0001');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const get_users = async (req: NextRequest) => {
  try {
    let users;
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

      users = await userService.list_users(search_fields, search_texts);
    } else {
      users = await userService.list_users();
    }

    return users;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0002');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const update_user = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let body = await req.json();
    const data = userValidator.validator_user_update(body);
    let user;
    let prams_id = params.id;
    let id = parseInt(prams_id);
    user = await userService.update_my_user(id, data);

    return user;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0003');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const delete_user = async (
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

    const user = await userService.delete_my_user(id, accessToken);

    return user;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0004');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const update_user_password = async (req: NextRequest) => {
  try {
    const body = await req.json();

    // Then use it like this
    let accessToken = headers().get('Authorization');

    if (!body) {
      const handle_err: error_object = handle_error_http_response(
        new Error('Body not found on request'),
        '0100'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }
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

    const validatedBody =
      userValidator.validator_user_update_password_body(body);

    const updatedUser = await userService.update_my_user_password(
      validatedBody,
      accessToken
    );

    return updatedUser;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0004');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const getSelfUser = async (req: NextRequest) => {
  // Then use it like this
  let accessToken = headers().get('Authorization');

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

  const selfUser = await userService.getSelfUser(accessToken);

  return selfUser;
};

const updateUserRole = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
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

  const body = await req.json();

  if (!body) {
    const handle_err: error_object = handle_error_http_response(
      new Error('Body not found on request'),
      '0100'
    );
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
  const userId = params.id;
  const data = userValidator.validatorUpdateUserRole(body);

  console.log({ data, userId, accessToken });
  const userUpdated = await userService.updateUserRole(
    data,
    userId,
    accessToken
  );

  return userUpdated;
};

export const userController = {
  post_user,
  get_user,
  get_users,
  update_user,
  delete_user,
  update_user_password,
  getSelfUser,
  updateUserRole,
};
