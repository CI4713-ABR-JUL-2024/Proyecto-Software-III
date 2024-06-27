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

const getObjectiveDetails = async (req: NextRequest) => {
  try {
    const search = req.nextUrl.searchParams.get('objective_id');

    const objectives = await objectiveDetailService.listObjectiveDetail(search);

    return objectives;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0023');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const getObjectiveDetail = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let id = parseInt(params.id); 

    const objective = await objectiveDetailService.getObjectiveDetail(id);

    return objective;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0022');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

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

const deleteObjectiveDetail = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {      

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    let id = parseInt(params.id);
    const deletedObjectiveDetail = await objectiveDetailService.deleteObjectiveDetail(
      id,
      accessToken
    );

    return deletedObjectiveDetail;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0021');
    throw new custom_error(
      handle_err.error_message,
      error.issues ?? error.meta,
      handle_err.error_code,
      handle_err.status
    );
  }
};

export const objectiveDetailController = {
  postObjectiveDetail,
  updateObjectiveDetail,
  deleteObjectiveDetail,
  getObjectiveDetails,
  getObjectiveDetail
};
