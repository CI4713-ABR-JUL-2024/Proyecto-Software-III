import { logController } from "@/backend/controllers/log"
import { NextRequest, NextResponse } from 'next/server'

/**
 * Handles the GET request for logs.
 * @param req - The NextRequest object containing the request details.
 * @returns A NextResponse object with the list of logs or an error message.
 */
export async function GET(req: NextRequest) {
  try {
    const list_logs = await logController.get_logs(req)
    return NextResponse.json(list_logs, { status: 200 })
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    }
    return NextResponse.json(error_json, { status: err.status })
  }
}