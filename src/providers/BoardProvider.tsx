import {
  createProject,
  deleteProjectDoc,
  getProjects,
  updateProjectDoc,
} from "@/appwrite/database";
import { useAuth } from "@/hooks/useAuth";
import { ProjectType } from "@/lib/types";
import { createContext, ReactNode, useEffect, useState } from "react";

export const BoardProviderContext = createContext<
  ReturnType<typeof useBoardProvider> | undefined
>(undefined);

type Props = { children: ReactNode };

function useBoardProvider() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null
  );

  async function createNewProject(title: string) {
    const newProject = await createProject<ProjectType>({ title });
    setProjects([...projects, newProject]);
  }

  async function updateProject(id: string, title: string) {
    const doc = await updateProjectDoc<ProjectType>(id, { title });
    setProjects((prevProjects) =>
      prevProjects.map((p) => (p.$id === doc.$id ? { ...p, ...doc } : p))
    );
  }

  async function deleteProject(id: string) {
    await deleteProjectDoc(id);
    const newProjects = projects.filter((p) => p.$id !== id);
    setProjects(newProjects);
  }

  function resetBoard() {
    setProjects([]);
    setSelectedProject(null);
    setLoading(true);
  }

  useEffect(() => {
    async function fetchProjects() {
      const projects = await getProjects<ProjectType>();
      setProjects(projects);
      setLoading(false);
    }
    if (user) {
      setLoading(true);
      fetchProjects();
    }
  }, [user]);

  return {
    loading,
    projects,
    createNewProject,
    updateProject,
    deleteProject,
    selectedProject,
    setSelectedProject,
    resetBoard,
  };
}

export default function BoardProvider({ children }: Props) {
  const board = useBoardProvider();

  return (
    <BoardProviderContext.Provider value={board}>
      {children}
    </BoardProviderContext.Provider>
  );
}
