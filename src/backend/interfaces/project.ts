import { ProjectStatus } from "@prisma/client";

export interface ProjectUpdateInput {
  description?: string;
  start?: Date;
  end?: Date;
  status?: ProjectStatus;
}

export interface ProjectCreateInput {
  description: string;
  start: Date;
  end: Date;
}