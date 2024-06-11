import { NextRequest } from 'next/server';
import { projectService } from '../services/project';
import { projectValidator } from '../validators/project';
import { custom_error, handle_error_http_response } from '../utils/error_handler';
import { error_object } from '../interfaces/error';

const update_project = async (
  req: NextRequest,
  { params }: { params: { id: number } }
) => {
  try {
    const body = await req.json();
    const data = projectValidator.validator_project_update(body);
    const updated_project = await projectService.update_project(params.id, data);
    return updated_project;
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0000');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

const delete_project = async (
  req: NextRequest,
  { params }: { params: { id: number } }
) => {
  try {
    await projectService.delete_project(params.id);
    return { message: 'Project deleted successfully' };
  } catch (error: any) {
    const handle_err: error_object = handle_error_http_response(error, '0000');
    throw new custom_error(
      handle_err.error_message,
      handle_err.error_message_detail,
      handle_err.error_code,
      handle_err.status
    );
  }
};

export const projectController = {
  update_project,
  delete_project
};
