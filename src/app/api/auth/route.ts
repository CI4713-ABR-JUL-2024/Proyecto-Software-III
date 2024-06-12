import prisma from '../../../../prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcrypt'
import { signJwtAccessToken } from '@/backend/helpers/jwt'
import { userController } from '@/backend/controllers/user'
import { create_log } from '@/backend/services/log'


interface RequestBody {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  const body: RequestBody = await request.json()

  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
    },
  })

  if (!user) {
    return NextResponse.json(
      { message: 'Incorrect email or password' },
      { status: 401 },
    )
  }

  if (user?.password === null) {
    return NextResponse.json(
      { message: 'Incorrect email or password' },
      { status: 401 },
    )
  }

  if (body.password && user.password) {
    const passwordMatches = await bcrypt.compare(body.password, user.password)

    if (user && passwordMatches) {
      
      const { password, ...userWithoutPass } = user
      const accessToken = signJwtAccessToken(userWithoutPass)
      const result = {
        ...userWithoutPass,
        accessToken,
      }
      const body_log = {
        user_id:userWithoutPass.id,
        module:"Auth",
        event:"Login",
        date: new Date()
      }
      const log = await create_log(body_log);

      return new NextResponse(JSON.stringify(result))
    } else
      return NextResponse.json(
        { message: 'Incorrect email or password' },
        { status: 401 },
      )
  } else {
    console.log('One argument is undefined')
  }

  return NextResponse.json({ message: 'An unexpected error occurred.' }, { status: 500 });
}

export async function GET(req: NextRequest) {
  try {
    const selfUser = await userController.getSelfUser(req)
    return NextResponse.json(selfUser, { status: 200 })
  } catch (err:any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    }
    return NextResponse.json(error_json, { status: err.status })
  }
}
