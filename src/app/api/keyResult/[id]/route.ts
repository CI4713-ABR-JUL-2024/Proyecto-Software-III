import { keyResultController } from '../../../../backend/controllers/keyResult';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    params: { params: { id: string } }
  ) {
    try {
      const id = parseInt(params.params.id);
      const keyResultsByObjective = await keyResultController.getKeyResultsByObjective(req, id);
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
  
  