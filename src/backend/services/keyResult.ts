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

interface KeyResult {
  id: number;
  keyResult: string;
  keyIndicator: string;
  initiative: string;
  initiativeType_id: number;
  priority: number;
  value: number;
  typeOfValue: string;
}
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

    const promises = body.objectiveDetail.map(async (objectiveDetail) => {
      const obj = await prisma.objectiveDetail.findUnique({
        where: {
          id: objectiveDetail,
        },
      });
      return await prisma.objectiveDetail.findMany({
        where: {
          objective_id: obj?.objective_id,
          keyResult_id: {
            not: null,
          }
        },
        });
    });
  
    const arrayForEach = (await Promise.all(promises)).flat();

    const keyResultsByObjective = await prisma.keyResult.findMany({
      where: {
        id: {
          in: arrayForEach.map((item) => item?.keyResult_id).filter((id) => id !== null && id !== undefined) as number[],
        },
      },
    });

    for (let i = 0; i < keyResultsByObjective.length; i++) {
        if (keyResultsByObjective[i].initiative !== body.initiative) {
          console.log('objectiveDetailsByObjective[j]', keyResultsByObjective[i]);
          await prisma.keyResult.create({
            data: {
              keyResult: body.keyResult,
              keyIndicator: body.keyIndicator,
              initiative: keyResultsByObjective[i].initiative,
              initiativeType_id: body.initiativeType_id,
              priority: 0,
              value: 0.0,
              typeOfValue: 'entero'
            },
          });
          await prisma.keyResult.create({
            data: {
              keyResult: keyResultsByObjective[i].keyResult,
              keyIndicator: keyResultsByObjective[i].keyIndicator,
              initiative: body.initiative,
              initiativeType_id: keyResultsByObjective[i].initiativeType_id,
              priority: 0,
              value: 0.0,
              typeOfValue: 'entero'
            },
          });
        }
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


    const finalKeyResultsArray: KeyResult[] = keyResultsArray.map(keyResult => ({ ...keyResult }));
    console.log('finalKeyResultsArray', finalKeyResultsArray);
    for (let i = 0; i < keyResultsArray.length; i++) {
      const keyResult = keyResultsArray[i];
      const others = await prisma.keyResult.findMany({
        where: {
          keyResult: keyResult.keyResult,
          keyIndicator: keyResult.keyIndicator,
          initiativeType_id: keyResult.initiativeType_id,
          id: { not: keyResult.id }
        },
      });
      console.log('others', others);
      
      if (others.length > 0) {
        for (let j = 0; j < others.length; j++) {
          finalKeyResultsArray.push(others[j]);
        }
      }
    }

    
    return finalKeyResultsArray;
  } catch (error) {
    throw error;
  }
}

const getKeyResultsByObjectiveDistinct = async (id: number, token: string) => {
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

const getMatrixKeyResults = async (id: number, token: string) => {
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

    const keyResultsByObjective = await getKeyResultsByObjective(id, token);
    keyResultsByObjective.sort((a, b) => a.id - b.id);

    
    const groupedByKeyResult = keyResultsByObjective.reduce<Record<string, KeyResult[]>>((acc, keyResult) => {
      if (!acc[keyResult.initiative]) {
        acc[keyResult.initiative] = [];
      }
      acc[keyResult.initiative].push(keyResult);
      return acc;
    }, {});

    const groupedByInitiativeKeyResult = keyResultsByObjective.reduce<Record<string, string[]>>((acc, keyResult) => {
      if (!acc[keyResult.initiative]) {
        acc[keyResult.initiative] = [];
      }
      acc[keyResult.initiative].push(keyResult.keyResult);
      return acc;
    }, {});

    Object.keys(groupedByInitiativeKeyResult).forEach(key => {
      groupedByInitiativeKeyResult[key].sort();
    });

    const uniqueInitiatives = Object.keys(groupedByKeyResult);
    
    const matrix: Record<string, Record<string, number | string>> = {};
    for (let i = 0; i < uniqueInitiatives.length; i++) {
      if (i === 0) {
        matrix['tipos'] = {};
      }
      const initiative = uniqueInitiatives[i];
      matrix[initiative] = {};
      for (let j = 0; j < groupedByInitiativeKeyResult[initiative].length; j++) {
        
        const keyResult = groupedByInitiativeKeyResult[initiative][j];
        console.log('keyResult', keyResultsByObjective);
        const keyResultData = keyResultsByObjective.find(kr => kr.keyResult === keyResult && kr.initiative === initiative);
        matrix[initiative][keyResult] = keyResultData?.value || 0.0;
        if (i === 0) { 
          matrix['tipos'][j] = keyResultData?.typeOfValue || 'entero';
        }
      }
      matrix[initiative]['prioridad'] = keyResultsByObjective.find(kr => kr.initiative === initiative)?.priority || 0;
    }
    return matrix;
  } catch (error) {
    throw error;
  }
}


    

export const keyResultService = {
    createKeyResult,
    getKeyResultsByObjectiveDistinct,
    getMatrixKeyResults,
};