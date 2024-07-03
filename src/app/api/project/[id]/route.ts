import { NextRequest, NextResponse } from 'next/server';

import { projectController } from '@/backend/controllers/project';


/**
 * Handles the PUT request for updating a project.
 * @param req - The NextRequest object representing the incoming request.
 * @param params - An object containing the route parameters, with the project ID specified as `id`.
 * @returns A NextResponse object with the updated project data or an error message.
 */
export async function PUT(
  req: NextRequest,
  params: { params: { id: string } }
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

export async function GET(
  req: NextRequest,
  params: { params: { id: string } }
) {
  try {
    const projects = await projectController.get_project_by_id(req, params);
    return NextResponse.json(projects, { status: 200 });
  } catch (err: any) {
    const error_json = {
      error_message: err.error_message,
      error_message_detail: err.error_message_detail,
      error_code: err.error_code,
    };
    return NextResponse.json(error_json, { status: err.status });
  }
}


/**
 * Deletes a project based on the provided ID.
 * @param req - The NextRequest object.
 * @param params - The parameters object containing the ID of the project to be deleted.
 * @returns A NextResponse object with the deleted project data or an error message.
 */
export async function DELETE(
  req: NextRequest,
  params: { params: { id: string } }
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
