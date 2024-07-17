import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import {
  custom_error,
  handle_error_http_response,
} from '../utils/error_handler';

import { error_object } from '../interfaces/error';

import { keyResultValidator } from '../validators/keyResult';
import {
  TKeyOrganizationCreateObjectBody,
  TMatrixKeyResultsUpdateBody
} from '../validators/keyResult';
import { keyResultService } from '../services/keyResult';

const postKeyResult = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const data = keyResultValidator.validatorketResultCreate(body);

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const newOrganization = await keyResultService.createKeyResult(
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

const getKeyResultsByObjective = async (req: NextRequest, id: number) => {
  try {
    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const keyResultsByObjective = await keyResultService.getKeyResultsByObjectiveDistinct(
      id,
      accessToken
    );

    return keyResultsByObjective;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0000');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
}

const getMatrixKeyResults = async (req: NextRequest, id: number) => {
  try {
    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const keyResultsByObjective = await keyResultService.getMatrixKeyResults(
      id,
      accessToken
    );

    return keyResultsByObjective;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0000');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
}

const updateMatrixKeyResults = async (req: NextRequest, id: number, body: TMatrixKeyResultsUpdateBody) => {
  try {
    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const keyResultsByObjective = await keyResultService.updateMatrixKeyResults(
      id,
      body,
      accessToken
    );

    return keyResultsByObjective;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0000');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }

}

const updateKeyResults = async (req: NextRequest, id: number) => {
  try {
    const body = await req.json();

    const data = keyResultValidator.validatorketResultUpdate(body);

    const accessToken = headers().get('Authorization');
    if (!accessToken) throw new Error('No autorizado');

    const updatedKeyResults = await keyResultService.updateKeyResults(
      id,
      data,
      accessToken
    );

    return updatedKeyResults;
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

export const keyResultController = {
  postKeyResult,
  getKeyResultsByObjective,
  getMatrixKeyResults,
  updateMatrixKeyResults,
  updateKeyResults,
};