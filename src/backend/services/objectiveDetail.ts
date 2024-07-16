import prisma from '../../../prisma/prisma';
import { verifyJwt } from '../helpers/jwt';
import { create_log } from './log';

import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { error_object } from '../interfaces/error';

import {
  TobjetiveDetailCreateObjectBody,
  TobjetiveDetailUpdateObjectBody
} from '../validators/objectiveDetail';

const arrayOfRolesAdmitted = [
  'admin',
  'change_agents',
  'project_leader',
  'agile_coach',
];

const checkAuth = (token:string) => {
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

  return userWithToken
}

export const createObjectiveDetail = async (
  body: TobjetiveDetailCreateObjectBody,
  token: string
) => {
  try {
    const userWithToken = checkAuth(token)

    const newObjectiveDetail = await prisma.objectiveDetail.create({
      data: body,
    });

    const body_log = {
      user_id: userWithToken!.id,
      module: 'ObjectiveDetail',
      event: 'createObjectiveDetail',
      date: new Date(),
    };
    await create_log(body_log);

    return newObjectiveDetail;
  } catch (error) {
    throw error;
  }
};

export const listObjectiveDetail = async (search: string | null) => {
  try {
    const approachs = await prisma.objectiveDetail.findMany({
      where: search
        ? {
            OR: [{ objective_id: { equals: parseInt(search) } }],
          }
        : {},
    });

    return approachs;
  } catch (error) {
    throw error;
  }
};

export const getObjectiveDetail = async (id: number) => {
  try {
    const objectiveDetail = await prisma.objectiveDetail.findUniqueOrThrow({
      where: {
        id: id,
      },
    });

    return objectiveDetail;
  } catch (error) {
    throw error;
  }
};

export const deleteObjectiveDetail = async (id: number, token: string) => {
  try {
    const userWithoutPass = checkAuth(token);  

    const deletedObjectiveDetail = await prisma.objectiveDetail.delete({
      where: {
        id: id,
      },
    });

    const body_log = {
      user_id: userWithoutPass.id,
      module: 'ObjectiveDetail',
      event: 'deleteObjectiveDetail',
      date: new Date(),
    };
    await create_log(body_log);

    return deletedObjectiveDetail;
  } catch (error) {
    throw error;
  }
};

export const updateObjectiveDetail = async (
  id: number,
  body: TobjetiveDetailUpdateObjectBody,
  token: string
) => {
  try {
    const userWithoutPass = checkAuth(token)  

    const updatedObjectiveDetail = await prisma.objectiveDetail.update({
      where: {
        id: id,
      },
      data: body,
    });

    const body_log = {
      user_id: userWithoutPass.id,
      module: 'ObjectiveDetail',
      event: 'UpdateObjectiveDetail',
      date: new Date(),
    };
    await create_log(body_log);

    return updatedObjectiveDetail;
  } catch (error) {
    throw error;
  }
};

export const objectiveDetailService = {
  createObjectiveDetail,
  updateObjectiveDetail,
  deleteObjectiveDetail,
  listObjectiveDetail,
  getObjectiveDetail
};
