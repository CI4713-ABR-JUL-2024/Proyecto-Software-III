import { NextRequest } from 'next/server';
import { projectService } from '../services/project';
import { projectValidator } from '../validators/project';
import { custom_error, handle_error_http_response } from '../utils/error_handler';
import { error_object } from '../interfaces/error';
import { headers } from 'next/headers';

/**
 * Updates a project.
 *
 * @param req - The request object.
 * @param params - The parameters object containing the project ID.
 * @returns A promise that resolves to the updated project.
 * @throws {custom_error} If an error occurs during the update process.
 */
const update_project = async (
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<any> => {
  try {
    const body = await req.json();
    const accessToken : any= headers().get('Authorization');
    let id = parseInt(params.id);
    if (body.start) {
      body.start = new Date(body.start);
    }
    if (body.end) {
      body.end = new Date(body.end);
    }
    const data = projectValidator.validator_project_update(body);
    const updated_project = await projectService.update_project(id, data,accessToken);
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

/**
 * Deletes a project by its ID.
 *
 * @param req - The NextRequest object.
 * @param params - An object containing the project ID.
 * @param params.id - The ID of the project to be deleted.
 * @returns A message indicating the success of the deletion.
 * @throws {custom_error} If an error occurs during the deletion process.
 */
const delete_project = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    let id = parseInt(params.id);
    const accessToken : any = headers().get('Authorization');
    await projectService.delete_project(id,accessToken);
    return { message: 'Proyecto eliminado correctamente' };
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
