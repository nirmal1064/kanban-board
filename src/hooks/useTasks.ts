import { ColumnProviderContext } from "@/providers/ColumnProvider";
import { useContext } from "react";
import { useBoard } from "./useBoard";

export function useTasks(columnId: string) {
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
          task.project.$id === selectedProject.$id &&
          task.column.$id === columnId
      )
    : [];

  return { tasks: filteredTasks };
}
