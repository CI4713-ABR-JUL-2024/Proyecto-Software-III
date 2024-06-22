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
import {
  TApproachCreateObjectBody,
  TApproachUpdateObjectBody,
} from '../validators/aproach';

const arrayOfRolesAdmitted = [
  'admin',
  'change_agents',
  'project_leader',
  'agile_coach',
];

export const createApproach = async (
  body: TApproachCreateObjectBody,
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

    const newApproach = await prisma.approach.create({
      data: {
        name: body.name,
      },
    });

    const body_log = {
      user_id: userWithToken!.id,
      module: 'Approach',
      event: ' createApproach',
      date: new Date(),
    };
    await create_log(body_log);

    return newApproach;
  } catch (error) {
    throw error;
  }
};

export const listApproachs = async (search: string | null) => {
  try {
    const approachs = await prisma.approach.findMany({
      where: search
        ? {
            OR: [{ name: { contains: search, mode: 'insensitive' } }],
          }
        : {},
    });

    return approachs;
  } catch (error) {
    throw error;
  }
};

export const deleteApproach = async (id: number, token: string) => {
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

    const deletedApproach = await prisma.approach.delete({
      where: {
        id: id,
      },
    });

    const body_log = {
      user_id: userWithoutPass.id,
      module: 'Approach',
      event: ' deleteApproach',
      date: new Date(),
    };
    await create_log(body_log);

    if (!deletedApproach) {
      throw new Error('User does not exists');
    }

    return deletedApproach;
  } catch (error) {
    throw error;
  }
};

export const updateApproach = async (
  id: number,
  body: TApproachUpdateObjectBody,
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

    const foundApproach = await prisma.approach.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundApproach) {
      throw new Error('No es existe el tipo de abordaje');
    }

    const updatedApproach = await prisma.approach.update({
      where: {
        id: id,
      },
      data: body,
    });

    const body_log = {
      user_id: userWithoutPass.id,
      module: 'Approach',
      event: 'UpdateApproach',
      date: new Date(),
    };
    await create_log(body_log);

    return updatedApproach;
  } catch (error) {
    throw error;
  }
};

export const approachService = {
  createApproach,
  listApproachs,
  deleteApproach,
  updateApproach,
};
