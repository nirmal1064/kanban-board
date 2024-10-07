import useLocalStorage from "@/hooks/useLocalStorage";
import { PROJECTS_KEY } from "@/lib/constants";
import { generateID } from "@/lib/helpers";
import { ID, Project } from "@/lib/types";
import { createContext, ReactNode, useState } from "react";

export const BoardProviderContext = createContext<
  ReturnType<typeof useBoardProvider> | undefined
>(undefined);

type Props = { children: ReactNode };

function useBoardProvider() {
  const [projects, setProjects] = useLocalStorage<Project[]>(PROJECTS_KEY, []);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  function createNewProject() {
    const project: Project = {
      id: generateID(),
      title: `Project ${projects.length + 1}`,
    };
    setProjects([...projects, project]);
  }

  function deleteProject(id: ID): void {
    const newProjects = projects.filter((p) => p.id !== id);
    setProjects(newProjects);
    // TODO: Delete Columns associated with the project
    // TODO: Delete Tasks associated with the project
  }

  return {
    projects,
    createNewProject,
    deleteProject,
    selectedProject,
    setSelectedProject,
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
