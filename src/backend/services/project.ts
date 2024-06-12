import prisma from '../../../prisma/prisma';
import { ProjectUpdateInput, ProjectCreateInput } from '../interfaces/project';

/**
 * Updates a project with the specified ID.
 * @param {number} id - The ID of the project to update.
 * @param {ProjectUpdateInput} data - The updated data for the project.
 * @returns {Promise<Project>} - A promise that resolves to the updated project.
 * @throws {Error} - If the project with the specified ID does not exist.
 */
export const update_project = async (id: number, data: ProjectUpdateInput) => {
  try {
    const read_project = await prisma.project.findFirst({
      where: {
        id: id,
      },
    });

    if (!read_project) {
      throw new Error('El proyecto no existe');
    }

    const updated_project = await prisma.project.update({
      where: {
        id: id,
      },
      data,
    });

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
export const delete_project = async (id: number) => {
  try {
    await prisma.project.delete({
      where: {
        id: id,
      },
    });
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
    const projects = await prisma.project.findMany();
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