import { NextRequest, NextResponse } from 'next/server';

import { projectController } from '@/backend/controllers/project';


/**
 * Get all projects
 * @param req - The NextRequest object.
 * @returns A NextResponse object with all projects data or an error message.
 */
export async function GET(
    req: NextRequest,
  ) {
    try {
      const allProjects = await projectController.get_all_projects(req);
      return NextResponse.json(allProjects, { status: 200 });
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
 * Create a new project
 * @param req - The NextRequest object containing the request details.
 * @returns A NextResponse object with the created project data or an error message.
 */
  export async function POST(
    req: NextRequest,
  ) {
    try {
      const project = await projectController.create_project(req);
      return NextResponse.json(project, { status: 200 });
    } catch (err: any) {
      const error_json = {
        error_message: err.error_message,
        error_message_detail: err.error_message_detail,
        error_code: err.error_code,
      };
      return NextResponse.json(error_json, { status: err.status });
    }
  }

