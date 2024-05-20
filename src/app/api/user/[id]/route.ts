import { NextRequest, NextResponse } from 'next/server'
import { userController } from '../../../../backend/controllers/user';
import { verifyJwt } from '@/backend/helpers/jwt';


export async function GET(
  req: NextRequest,
  params: { params: { id: string } },
) {
  try {
    const read_user = await userController.get_user(req, params)
    const accessToken = req.headers.get('Authorization')
    if (!accessToken || !verifyJwt(accessToken)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(read_user, { status: 200 })
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    }
    return NextResponse.json(error_json, { status: err.status })
  }
}

export async function DELETE(
  req: NextRequest,
  params: { params: { id: string } },
) {
  try {
    const user = await userController.delete_user(req, params)
    return NextResponse.json(user, { status: 200 })
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    }
    return NextResponse.json(error_json, { status: err.status })
  }
}

export async function PUT(
  req: NextRequest,
  params: { params: { id: string } },
) {
  try {
    const list_users = await userController.update_user(req, params)
    return NextResponse.json(list_users, { status: 200 })
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    }
    return NextResponse.json(error_json, { status: err.status })
  }
}
