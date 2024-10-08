/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_APPWRITE_PROJECTS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_COLUMNS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_TASKS_COLLECTION_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
