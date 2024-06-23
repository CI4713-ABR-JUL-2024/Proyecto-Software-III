import { initiativeController } from '@/backend/controllers/initiativeType';
import { NextRequest, NextResponse } from 'next/server'


export async function PUT(
    req: NextRequest,
    params: { params: { id: string } }
  ) {
    try {
      const update_initiative = await initiativeController.update_initiative(req, params);
      return NextResponse.json(update_initiative, { status: 200 });
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      };
      return NextResponse.json(error_json, { status: err.status });
    }
  }
  