import Sidebar from "@/components/Sidebar";
import Board from "@/components/new/Board";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="m-auto flex min-h-screen items-center overflow-y-hidden overflow-x-scroll bg-background px-10 text-foreground">
        <Board />
      </main>
    </div>
  );
}
