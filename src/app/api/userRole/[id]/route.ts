import { NextRequest, NextResponse } from 'next/server';

import { userController } from '@/backend/controllers/user';

export async function PUT(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const updatedUser = await userController.updateUserRole(req, params);
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}
