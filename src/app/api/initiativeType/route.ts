import { NextRequest, NextResponse } from 'next/server'
import { initiativeController } from '@/backend/controllers/initiativeType'

export async function POST(req: NextRequest) {
    try {
      const new_initiative = await initiativeController.post_initiative(req)
      return NextResponse.json(new_initiative, { status: 201 })
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      }
      return NextResponse.json(error_json, { status: err.status })
    }
  }
  
  export async function GET(req: NextRequest) {
    try {
      const list_initiatives = await initiativeController.get_initiatives(req)
      return NextResponse.json(list_initiatives, { status: 200 })
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      }
      return NextResponse.json(error_json, { status: err.status })
    }
  }