import { ProjectStatus } from "@prisma/client";

export interface ProjectUpdateInput {
  description?: string;
  start?: Date;
  end?: Date;
  status?: ProjectStatus;
  trimester?: string;
  year?: string;
  aproach_id?: number;
  organization_id?: number;
}

export interface ProjectCreateInput {
  description: string;
  start: Date;
  end: Date;
  aproach_id: number;
  organization_id: number;
  trimester: string;
  year: string;
}