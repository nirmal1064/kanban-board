import { BoardProviderContext } from "@/providers/BoardProvider";
import { useContext } from "react";

export function useBoard() {
  const context = useContext(BoardProviderContext);

  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }

  return context;
}
