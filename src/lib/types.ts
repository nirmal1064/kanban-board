import { Models } from "appwrite";

// export type ID = number | string;
export type ID = string;

export type Project = { id: ID; title: string };

export type Column = { id: ID; projectId: ID; title: string };

export type Task = { id: ID; projectId: ID; columnId: ID; content: string };

export type ProjectType = Models.Document & { title: string };

export type ColumnType = Models.Document & { projectId: ID; title: string };

export type TaskType = Models.Document & {
  projectId: ID;
  columnId: ID;
  content: string;
};
