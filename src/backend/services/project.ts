import prisma from '../../../prisma/prisma';
import { ProjectUpdateInput } from '../interfaces/project';

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
      throw new Error('Project does not exist');
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

export const projectService = {
  update_project,
  delete_project,
};