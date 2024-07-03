import { objectiveController } from '@/backend/controllers/objective';
import { NextRequest, NextResponse } from 'next/server'


export async function PUT(
    req: NextRequest,
    params: { params: { id: string } }
  ) {
    try {
      const update_objective = await objectiveController.update_objective(req, params);
      return NextResponse.json(update_objective, { status: 200 });
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      };
      return NextResponse.json(error_json, { status: err.status });
    }
  }

  export async function DELETE(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const objective = await objectiveController.delete_objective(req, params);
    return NextResponse.json(objective, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}
  
