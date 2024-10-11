import Board from "@/components/Board";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="m-auto flex min-h-screen items-center overflow-y-hidden overflow-x-scroll bg-background px-10 text-foreground">
        <Board />
      </main>
    </div>
  );
}
