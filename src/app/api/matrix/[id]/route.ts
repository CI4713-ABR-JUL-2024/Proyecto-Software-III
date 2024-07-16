import { keyResultController } from '../../../../backend/controllers/keyResult';
import { validatormatrixUpdate } from '../../../../backend/validators/keyResult';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    params: { params: { id: string } }
  ) {
    try {
      const id = parseInt(params.params.id);
      const keyResultsByObjective = await keyResultController.getMatrixKeyResults(req, id);

      return NextResponse.json(keyResultsByObjective, { status: 200 });
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      };
      return NextResponse.json(error_json, { status: err.status });
    }
  }

  export async function PUT(
    req: NextRequest,
    params: { params: { id: string } },
  ) {
    try {
      const id = parseInt(params.params.id);
      const body = await req.json();
      console.log('id', id);
      console.log('body', body);
      const data = validatormatrixUpdate(body);
      console.log('data', data);
      const keyResultsByObjective = await keyResultController.updateMatrixKeyResults(req, id, data);

      return NextResponse.json(keyResultsByObjective, { status: 200 });
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      };
      return NextResponse.json(error_json, { status: err.status });
    }
  }
  