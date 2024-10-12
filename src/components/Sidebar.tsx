import { useAuth } from "@/hooks/useAuth";
import { useBoard } from "@/hooks/useBoard";
import { useColumn } from "@/hooks/useColumn";
import { cn } from "@/lib/utils";
import { Kanban, Loader, LogOut } from "lucide-react";
import ProjectModal from "./modals/ProjectModal";
import ProjectCard from "./ProjectCard";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { projects, loading, resetBoard } = useBoard();
  const { logOutUser } = useAuth();
  const { resetColumnsAndTasks } = useColumn();

  async function handleLogOut() {
    await logOutUser();
    resetBoard();
    resetColumnsAndTasks();
  }

  return (
    <div className="hidden w-[250px] min-w-[250px] border-separate flex-col border-2 md:flex">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Kanban className="h-6 w-6 text-rose-500" strokeWidth={3} />
          <h1
            className={cn(
              "bg-gradient-to-r from-rose-400 via-pink-500 to-red-500 bg-clip-text text-2xl font-bold text-transparent",
              "pointer-events-none select-none"
            )}
          >
            Kanban Board
          </h1>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex flex-grow flex-col gap-2">
        <h1 className="text-lg font-bold text-primary">Projects</h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader
              className={cn("h-8 w-8 text-rose-500", "animate-spin")}
              strokeWidth={3}
            />
          </div>
        ) : projects.length === 0 ? (
          <div>No Projects Found. Create a New Project to continue</div>
        ) : (
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <ProjectCard key={project.$id} project={project} />
            ))}
          </div>
        )}
        <ProjectModal />
      </div>
      <div className="w-full pb-2">
        <Button
          type="submit"
          className="flex w-full items-center gap-2 bg-rose-500 font-semibold hover:bg-rose-500/80 dark:text-primary"
          onClick={handleLogOut}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
