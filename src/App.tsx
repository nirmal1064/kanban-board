import { useEffect } from "react";
import KanbanBoard from "./components/KanbanBoard";

export default function App() {
  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <main className="m-auto flex min-h-screen items-center overflow-x-auto overflow-y-hidden bg-background px-10 text-foreground">
      <KanbanBoard />
    </main>
  );
}
