import { objectiveDetailController } from '../../../../backend/controllers/objectiveDetail';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const approach = await objectiveDetailController.deleteObjectiveDetail(req, params);
    return NextResponse.json(approach, { status: 200 });
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
  params: { params: { id: string } }
) {
  try {
    const approach = await objectiveDetailController.updateObjectiveDetail(req, params);
    return NextResponse.json(approach, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}


export async function GET(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const approach = await objectiveDetailController.getObjectiveDetail(req, params);
    return NextResponse.json(approach, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}
