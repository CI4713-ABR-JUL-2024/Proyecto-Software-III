import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';

import { error_object } from '../interfaces/error';

import { approachValidator } from '../validators/aproach';
import { approachService } from '../services/aproach';

const postApproach = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = approachValidator.validatorApproachCreate(body);

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const newOrganization = await approachService.createApproach(
      data,
      accessToken
    );

    return newOrganization;
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

const getApproachs = async (req: NextRequest) => {
  try {
    const search = req.nextUrl.searchParams.get('search');

    const approachs = await approachService.listApproachs(search);

    return approachs;
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

const updateApproach = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let body = await req.json();
    const data = approachValidator.validatorApproachUpdate(body);
    let approach;
    let prams_id = params.id;
    let id = parseInt(prams_id);

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    approach = await approachService.updateApproach(id, data, accessToken);

    return approach;
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

const deleteApproach = async (
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

    const deletedApproach = await approachService.deleteApproach(
      id,
      accessToken
    );

    return deletedApproach;
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

export const approachController = {
  postApproach,
  getApproachs,
  updateApproach,
  deleteApproach,
};
