import prisma from '../../../prisma/prisma';
import { ProjectUpdateInput } from '../interfaces/project';

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