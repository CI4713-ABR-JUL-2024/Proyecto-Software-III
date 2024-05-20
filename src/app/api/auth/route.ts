import prisma from '../../../../prisma/prisma'
import { NextRequest, NextResponse } from 'next/server'
import * as bcrypt from 'bcrypt'
import { signJwtAccessToken } from '@/backend/helpers/jwt'


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
