export interface ProjectUpdateInput {
  description?: string;
  start?: Date;
  end?: Date;
}

export interface ProjectCreateInput {
  description: string;
  start: Date;
  end: Date;
}