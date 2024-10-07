import { ID } from "@/lib/types";
import { ColumnProviderContext } from "@/providers/ColumnProvider";
import { useContext } from "react";
import { useBoard } from "./useBoard";

export function useTasks(columnId: ID) {
  const context = useContext(ColumnProviderContext);
  const { selectedProject } = useBoard();

  if (context === undefined) {
    throw new Error(
      "useTasks must be used within a BoardProvider and a ColumnProvider"
    );
  }

  const { tasks } = context;
  const filteredTasks = selectedProject
    ? tasks.filter(
        (task) =>
          task.projectId === selectedProject.id && task.columnId === columnId
      )
    : [];

  return { tasks: filteredTasks };
}
