import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';

import { error_object } from '../interfaces/error';

import { objectiveDetailValidator } from '../validators/objectiveDetail';
import { objectiveDetailService } from '../services/objectiveDetail';

const postObjectiveDetail = async (req: NextRequest) => {
  try {
    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const body = await req.json(); 
    const data = objectiveDetailValidator.validatorObjectiveDetailCreate(body);

    return await objectiveDetailService.createObjectiveDetail(
      data,
      accessToken
    );

  } catch (error: any) { 
    const handle_err: error_object = handle_error_http_response(error, '0019');   
    throw new custom_error(
      handle_err.error_message,
      error.issues ?? error.meta,
      handle_err.error_code,
      handle_err.status
    );
  }
};

// const getApproachs = async (req: NextRequest) => {
//   try {
//     const search = req.nextUrl.searchParams.get('search');

//     const approachs = await approachService.listApproachs(search);

//     return approachs;
//   } catch (error: any) {
//     const handle_err: error_object = handle_error_http_response(error, '0002');
//     throw new custom_error(
//       handle_err.error_message,
//       handle_err.error_message_detail,
//       handle_err.error_code,
//       handle_err.status
//     );
//   }
// };

const updateObjectiveDetail = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let body = await req.json();
    const data = objectiveDetailValidator.validatorObjectiveDetailUpdate(body);

    let id = parseInt(params.id);    

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    return await objectiveDetailService.updateObjectiveDetail(id, data, accessToken);

  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0020');
    throw new custom_error(
      handle_err.error_message,
      error.issues ?? error.meta,
      handle_err.error_code,
      handle_err.status
    );
  }
};

// const deleteApproach = async (
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) => {
//   try {
//     let prams_id = params.id;
//     let id = parseInt(prams_id);

//     const accessToken = headers().get('Authorization');
//     if (!accessToken) {
//       const handle_err: error_object = handle_error_http_response(
//         new Error('No autorizado'),
//         '0101'
//       );
//       throw new custom_error(
//         handle_err.error_message,
//         handle_err.error_message_detail,
//         handle_err.error_code,
//         handle_err.status
//       );
//     }

//     const deletedApproach = await approachService.deleteApproach(
//       id,
//       accessToken
//     );

//     return deletedApproach;
//   } catch (error: any) {
//     const handle_err: error_object = handle_error_http_response(error, '0004');
//     throw new custom_error(
//       handle_err.error_message,
//       handle_err.error_message_detail,
//       handle_err.error_code,
//       handle_err.status
//     );
//   }
// };

export const objectiveDetailController = {
  postObjectiveDetail,
  updateObjectiveDetail
};
