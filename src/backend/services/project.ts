import prisma from '../../../prisma/prisma';
import { verifyJwt } from '../helpers/jwt';
import { ProjectUpdateInput, ProjectCreateInput } from '../interfaces/project';
import { create_log } from './log';

/**
 * Updates a project with the specified ID.
 * @param {number} id - The ID of the project to update.
 * @param {ProjectUpdateInput} data - The updated data for the project.
 * @returns {Promise<Project>} - A promise that resolves to the updated project.
 * @throws {Error} - If the project with the specified ID does not exist.
 */
export const update_project = async (id: number, data: ProjectUpdateInput,token: string ) => {
  try {
    const read_project = await prisma.project.findFirst({
      where: {
        id: id,
      },
    });

     const userWithoutPass = verifyJwt(token);

    if (!read_project) {
      throw new Error('El proyecto no existe');
    }

    const updated_project = await prisma.project.update({
      where: {
        id: id,
      },
      data,
    });
    const body_log = {
      user_id:userWithoutPass.id,
      module:"User",
      event:" update_project",
      date: new Date()
    }
    const log = await create_log(body_log);
    return updated_project;
  } catch (error) {
    throw error;
  }
};

/**
 * Deletes a project with the specified ID.
 * @param id - The ID of the project to delete.
 * @throws Throws an error if the deletion fails.
 */
export const delete_project = async (id: number,token: string ) => {
  try {
    const userWithoutPass = verifyJwt(token);

    await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        status: 'DELETED',
      },
    });
    const body_log = {
      user_id:userWithoutPass.id,
      module:"User",
      event:" delete_project",
      date: new Date()
    }
    const log = await create_log(body_log);

  } catch (error) {
    throw error;
  }
};

/**
 * Retrieve all projects
 * @returns A promise that resolves to an array of project objects.
 */
export const get_all_projects = async () => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: {
          in: ['ACTIVE', 'INACTIVE'],
        },
      },
    });
    return projects;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new project
 * @param data - The project data to create a new project.
 * @returns A promise that resolves to the created project object.
 */
export const create_project = async (data: ProjectCreateInput) => {
  try {
    const project = await prisma.project.create({ data });
    return project;
  } catch (error) {
    throw error;
  }
};

export const projectService = {
  update_project,
  delete_project,
  get_all_projects,
  create_project,
};