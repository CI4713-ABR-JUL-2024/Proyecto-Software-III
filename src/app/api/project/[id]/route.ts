import { NextRequest, NextResponse } from 'next/server';

import { projectController } from '@/backend/controllers/project';


export async function PUT(
  req: NextRequest,
  params: { params: { id: number } }
) {
  try {
    const updatedProject = await projectController.update_project(req, params);
    return NextResponse.json(updatedProject, { status: 200 });
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
  params: { params: { id: number } }
) {
  try {
    const deletedProject = await projectController.delete_project(req, params);
    return NextResponse.json(deletedProject, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}
