import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';

import { error_object } from '../interfaces/error';

import { organizationValidator } from '../validators/organization';
import { organizationService } from '../services/organization';

const postOrganization = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = organizationValidator.validatorOrganizationCreate(body);

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const newOrganization = await organizationService.createOrganization(
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

const getOrganizations = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const data = organizationValidator.validatorOrganizationList(body);
    const organizations = await organizationService.listOrganizations(data);

    return organizations;
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

const updateOrganization = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let body = await req.json();
    const data = organizationValidator.validatorOrganizationUpdate(body);
    let organization;
    let prams_id = params.id;
    let id = parseInt(prams_id);

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    organization = await organizationService.updateOrganization(
      id,
      data,
      accessToken
    );

    return organization;
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

const deleteOrganization = async (
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

    const deletedOrganization = await organizationService.deleteOrganization(
      id,
      accessToken
    );

    return deletedOrganization;
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

export const organizationController = {
  postOrganization,
  getOrganizations,
  updateOrganization,
  deleteOrganization,
};
