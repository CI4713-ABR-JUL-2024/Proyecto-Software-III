import prisma from '../../../prisma/prisma';
import bcrypt from 'bcrypt';
import { verifyJwt } from '../helpers/jwt';
import { create_log } from './log';

import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { error_object } from '../interfaces/error';

import { add_object_to_array, add_property } from '../utils/utils';

import {
  TOrganizationCreateObjectBody,
  TOrganizationListObject,
  TOrganizationUpdateObjectBody,
} from '../validators/organization';

const arrayOfRolesAdmitted = [
  'admin',
  'change_agents',
  'project_leader',
  'agile_coach',
];

export const createOrganization = async (
  body: TOrganizationCreateObjectBody,
  token: string
) => {
  try {
    const userWithToken = verifyJwt(token);

    if (!userWithToken) {
      const handle_err: error_object = handle_error_http_response(
        new Error('Error en el token'),
        '0000'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    if (!arrayOfRolesAdmitted.includes(userWithToken.role_name)) {
      const handle_err: error_object = handle_error_http_response(
        new Error(
          'Error no posee los permisos adecuados para realizar esta acción'
        ),
        '0000'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    const newOrganization = await prisma.organization.create({
      data: {
        name: body.name,
        country: body.country,
        email: body.email,
        cellphone: body.cellphone,
        estate: body.estate,
        personResponsible: body.personResponsible,
      },
    });

    const body_log = {
      user_id: userWithToken!.id,
      module: 'Organization',
      event: ' createOrganization',
      date: new Date(),
    };
    await create_log(body_log);

    return newOrganization;
  } catch (error) {
    throw error;
  }
};

export const listOrganizations = async (data: TOrganizationListObject) => {
  try {
    const { search } = data;

    const organizations = await prisma.organization.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { country: { contains: search, mode: 'insensitive' } },
              { estate: { contains: search, mode: 'insensitive' } },
              { cellphone: { contains: search, mode: 'insensitive' } },
              { personResponsible: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
    });

    return organizations;
  } catch (error) {
    throw error;
  }
};

export const deleteOrganization = async (id: number, token: string) => {
  try {
    const userWithoutPass = verifyJwt(token);

    const { role_name } = userWithoutPass;

    if (!userWithoutPass) {
      const handle_err: error_object = handle_error_http_response(
        new Error('Error en el token'),
        '0000'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    if (!arrayOfRolesAdmitted.includes(role_name)) {
      const handle_err: error_object = handle_error_http_response(
        new Error(
          'Error no posee los permisos adecuados para realizar esta acción'
        ),
        '0000'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    const deletedOrganization = await prisma.organization.delete({
      where: {
        id: id,
      },
    });

    const body_log = {
      user_id: userWithoutPass.id,
      module: 'Organization',
      event: ' deleteOrganization',
      date: new Date(),
    };
    await create_log(body_log);

    if (!deletedOrganization) {
      throw new Error('User does not exists');
    }

    return deletedOrganization;
  } catch (error) {
    throw error;
  }
};

export const updateOrganization = async (
  id: number,
  body: TOrganizationUpdateObjectBody,
  token: string
) => {
  try {
    const userWithoutPass = verifyJwt(token);

    if (!userWithoutPass) {
      const handle_err: error_object = handle_error_http_response(
        new Error('Error en el token'),
        '0000'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    if (!arrayOfRolesAdmitted.includes(userWithoutPass.role_name)) {
      const handle_err: error_object = handle_error_http_response(
        new Error(
          'Error no posee los permisos adecuados para realizar esta acción'
        ),
        '0000'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    const foundOrganization = await prisma.organization.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundOrganization) {
      throw new Error('User does not exists');
    }

    const updatedOrganization = await prisma.user.update({
      where: {
        id: id,
      },
      data: body,
    });

    const body_log = {
      user_id: userWithoutPass.id,
      module: 'Organization',
      event: 'UpdateOrganization',
      date: new Date(),
    };
    await create_log(body_log);

    return updatedOrganization;
  } catch (error) {
    throw error;
  }
};

export const organizationService = {
  createOrganization,
  listOrganizations,
  deleteOrganization,
  updateOrganization,
};
