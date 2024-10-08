import { ID, Models, Query } from "appwrite";
import {
  COLUMNS_COLLECTION_ID,
  DATABASE_ID,
  PROJECTS_COLLECTION_ID,
  TASKS_COLLECTION_ID,
} from "@/lib/constants";
import { db } from "./config";

/* All Create Operations start */
async function createDoc<T extends Models.Document>(
  databaseId: string,
  collectionId: string,
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await db.createDocument(databaseId, collectionId, ID.unique(), data);
}

export async function createProject<T extends Models.Document>(
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return createDoc(DATABASE_ID, PROJECTS_COLLECTION_ID, data);
}

export async function createColumnDoc<T extends Models.Document>(
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return createDoc(DATABASE_ID, COLUMNS_COLLECTION_ID, data);
}

export async function createTaskDoc<T extends Models.Document>(
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return createDoc(DATABASE_ID, TASKS_COLLECTION_ID, data);
}
/* All Create Operations End */

/* All Read Operations Start */
export async function getProjects<T extends Models.Document>(): Promise<T[]> {
  const response = await db.listDocuments<T>(
    DATABASE_ID,
    PROJECTS_COLLECTION_ID
  );
  return response.documents;
}

export async function getColumns<T extends Models.Document>(
  projectId: string
): Promise<T[]> {
  const response = await db.listDocuments<T>(
    DATABASE_ID,
    COLUMNS_COLLECTION_ID,
    [Query.equal("projectId", projectId)]
  );
  return response.documents;
}
/* All Read Operations End */

/* All Update Operations Start */
export async function updateColumnDoc<T extends Models.Document>(
  id: string,
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await db.updateDocument(DATABASE_ID, COLUMNS_COLLECTION_ID, id, data);
}

export async function updateTaskDoc<T extends Models.Document>(
  id: string,
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await db.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, id, data);
}
/* All Update Operations End */

/* All Delete Operations Start */
export async function deleteProjectDoc(projectId: string) {
  return await db.deleteDocument(
    DATABASE_ID,
    PROJECTS_COLLECTION_ID,
    projectId
  );
}

export async function deleteColumnDoc(columnId: string) {
  return await db.deleteDocument(DATABASE_ID, COLUMNS_COLLECTION_ID, columnId);
}

export async function deleteTaskDoc(taskId: string) {
  return await db.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId);
}
/* All Delete Operations End */
