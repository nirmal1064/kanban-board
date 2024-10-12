import {
  COLUMNS_COLLECTION_ID,
  DATABASE_ID,
  PROJECTS_COLLECTION_ID,
  TASKS_COLLECTION_ID,
} from "@/lib/constants";
import { ID, Models, Query } from "appwrite";
import { db } from "./config";

/* All Create Operations start */
async function createDoc<T extends Models.Document>(
  collectionId: string,
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await db.createDocument(DATABASE_ID, collectionId, ID.unique(), data);
}

export async function createProject<T extends Models.Document>(
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await createDoc(PROJECTS_COLLECTION_ID, data);
}

export async function createColumnDoc<T extends Models.Document>(
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await createDoc(COLUMNS_COLLECTION_ID, data);
}

export async function createTaskDoc<T extends Models.Document>(
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await createDoc(TASKS_COLLECTION_ID, data);
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
  return await getDataByProject(COLUMNS_COLLECTION_ID, projectId);
}

export async function getTasks<T extends Models.Document>(
  projectId: string
): Promise<T[]> {
  return await getDataByProject(TASKS_COLLECTION_ID, projectId);
}

async function getDataByProject<T extends Models.Document>(
  collectionId: string,
  projectId: string
) {
  const query = [Query.equal("project", projectId), Query.orderAsc("position")];
  const response = await db.listDocuments<T>(DATABASE_ID, collectionId, query);
  return response.documents;
}
/* All Read Operations End */

/* All Update Operations Start */
export async function updateProjectDoc<T extends Models.Document>(
  id: string,
  data: Omit<T, keyof Models.Document>
): Promise<T> {
  return await db.updateDocument(DATABASE_ID, PROJECTS_COLLECTION_ID, id, data);
}

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
