import {
  createProject,
  deleteProjectDoc,
  getProjects,
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

  // TODO : Test this functionality once the delete project button is created
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
