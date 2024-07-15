import { keyResultController } from '../../../backend/controllers/keyResult';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    return NextResponse.json(
      await keyResultController.postKeyResult(req),
      { status: 201 }
    );
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}
