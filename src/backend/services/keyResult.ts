import prisma from '../../../prisma/prisma';
import { verifyJwt } from '../helpers/jwt';
import { create_log } from './log';
import { objectiveDetailService } from './objectiveDetail';

import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';
import { error_object } from '../interfaces/error';

import {
  TKeyOrganizationCreateObjectBody,
} from '../validators/keyResult';

const arrayOfRolesAdmitted = [
  'admin',
  'change_agents',
  'project_leader',
  'agile_coach',
];

export const createKeyResult = async (
  body: TKeyOrganizationCreateObjectBody,
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

    const newKeyResult = await prisma.keyResult.create({
      data: {
        keyResult: body.keyResult,
        keyIndicator: body.keyIndicator,
        initiative: body.initiative,
        initiativeType_id: body.initiativeType_id,
        priority: 0,
        value: 0.0,
        typeOfValue: 'entero'
      },
    });

    const id_keyResult = {
      keyResult_id: newKeyResult.id,
    };

    for (let i = 0; i < body.objectiveDetail.length; i++) {
      objectiveDetailService.updateObjectiveDetail(body.objectiveDetail[i], id_keyResult, token);
    }

    return newKeyResult;
  } catch (error) {
    throw error;
  }
};

export const getKeyResultsByObjective = async (id: number, token: string) => {
  try {
    const userWithToken = verifyJwt(token);

    if (!userWithToken) {
      const handle_err: error_object = handle_error_http_response(
        new Error('Error en el token'),
        '0024'
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
        '0024'
      );
      throw new custom_error(
        handle_err.error_message,
        handle_err.error_message_detail,
        handle_err.error_code,
        handle_err.status
      );
    }

    const objectiveDetailsByObjective = await prisma.objectiveDetail.findMany({
      where: {
        objective_id: id,
      },
    });

    // Inicializar un Set para almacenar los keyResults únicos
    const keyResultsIdSet: Set<number> = new Set();
    
    for (let i = 0; i < objectiveDetailsByObjective.length; i++) {
      if (objectiveDetailsByObjective[i].keyResult_id) {
        const keyId = objectiveDetailsByObjective[i].keyResult_id as number;
        keyResultsIdSet.add(keyId);
      }
    }
    // Encontrar los keyResults con los id obtenidos
    const keyResultsArray = await prisma.keyResult.findMany({
      where: {
        id: {
          in: Array.from(keyResultsIdSet),
        },
      },
    });
    
    return keyResultsArray;
  } catch (error) {
    throw error;
  }
}

export const keyResultService = {
    createKeyResult,
    getKeyResultsByObjective,
};