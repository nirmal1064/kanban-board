import { Models } from "appwrite";

export type ID = number | string;

export type Project = { id: ID; title: string };

export type Column = { id: ID; projectId: ID; title: string };

export type Task = { id: ID; projectId: ID; columnId: ID; content: string };

export type ProjectType = Models.Document & { title: string };

export type ColumnType = Models.Document & {
  project: ProjectType;
  title: string;
  position: number;
};

export type TaskType = Models.Document & {
  project: ProjectType;
  column: ColumnType;
  content: string;
  position: number;
};

// https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set
type AtLeastOne<T> = { [K in keyof T]: Pick<T, K> }[keyof T];

export type UpdateColumnType = AtLeastOne<{
  title: string;
  position: number;
}>;

export type UpdateTaskType = AtLeastOne<{
  content: string;
  position: number;
}>;
