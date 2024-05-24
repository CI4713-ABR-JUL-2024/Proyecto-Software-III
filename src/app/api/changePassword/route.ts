
import { NextRequest, NextResponse } from 'next/server'
import { userController } from '../../../backend/controllers/user';
import { custom_error, handle_error_http_response } from '@/backend/utils/error_handler';
import { error_object } from '@/backend/interfaces/error';


export async function POST(request: NextRequest) {
  try {
    const updatedUser = await userController.update_user_password(request)
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.log(error)
    const handle_err: error_object = handle_error_http_response(
      new Error('User not found'),
      '0005',
    )
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status,
    )
  }
}
