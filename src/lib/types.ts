export type ID = number | string;

export type Column = { id: ID; title: string };

export type Task = { id: ID; columnId: ID; content: string };
