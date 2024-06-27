import { objectiveDetailController } from '../../../backend/controllers/objectiveDetail';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    return NextResponse.json(
      await objectiveDetailController.postObjectiveDetail(req),
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

export async function GET(req: NextRequest) {
  try {
    const approachs = await objectiveDetailController.getObjectiveDetails(req);
    return NextResponse.json(approachs, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
