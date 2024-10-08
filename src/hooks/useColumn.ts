import { ColumnProviderContext } from "@/providers/ColumnProvider";
import { useContext } from "react";
import { useBoard } from "./useBoard";

export function useColumn() {
  const context = useContext(ColumnProviderContext);
  const { selectedProject } = useBoard();

  if (context === undefined) {
    throw new Error(
      "useColumn must be used within a BoardProvider and ColumnProvider"
    );
  }

  const { columns } = context;

  const filteredColumns = selectedProject
    ? columns.filter((column) => column.projectId === selectedProject.$id)
    : [];

  return { ...context, columns: filteredColumns };
}
