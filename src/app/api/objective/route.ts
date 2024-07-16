import { NextRequest, NextResponse } from 'next/server'
import { objectiveController } from '@/backend/controllers/objective'

export async function POST(req: NextRequest) {
    try {
      const new_objective = await objectiveController.post_objective(req)
      return NextResponse.json(new_objective, { status: 201 })
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
      const list_objectives = await objectiveController.get_objectives(req)
      return NextResponse.json(list_objectives, { status: 200 })
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      }
      return NextResponse.json(error_json, { status: err.status })
    }
  }