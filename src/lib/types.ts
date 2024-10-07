export type ID = number | string;

export type Project = { id: ID; title: string };

export type Column = { id: ID; projectId: ID; title: string };

export type Task = { id: ID; projectId: ID; columnId: ID; content: string };
