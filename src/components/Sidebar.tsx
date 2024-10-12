import { useAuth } from "@/hooks/useAuth";
import { useBoard } from "@/hooks/useBoard";
import { useColumn } from "@/hooks/useColumn";
import { cn } from "@/lib/utils";
import { Kanban, Loader, LogOut, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./modals/ProjectModal";
import ProjectCard from "./ProjectCard";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { projects, loading, resetBoard } = useBoard();
  const { logOutUser } = useAuth();
  const { resetColumnsAndTasks } = useColumn();
  const navigate = useNavigate();

  async function handleLogOut() {
    await logOutUser();
    resetBoard();
    resetColumnsAndTasks();
    navigate("/login");
  }

  return (
    <div className="hidden h-screen w-[275px] min-w-[275px] flex-col border-r border-border md:flex">
      <div className="flex items-center justify-between border-b border-border px-2 py-4">
        <div className="flex items-center gap-2">
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

      <div className="flex justify-between border-b p-2">
        <h2 className="text-lg font-bold text-primary">Projects</h2>
        <ProjectModal action="Create" />
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader
              className={cn("h-8 w-8 text-rose-500", "animate-spin")}
              strokeWidth={3}
            />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-center text-muted-foreground">
              No Projects Found. Create a New Project to continue
            </h2>
            <ProjectModal
              action="Create"
              trigger={
                <Button variant={"secondary"} className="flex gap-2">
                  <Plus className="h-5 w-5" />
                  Add project
                </Button>
              }
            />
          </div>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <ProjectCard key={project.$id} project={project} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <Button
          className="flex w-full items-center justify-center gap-2 bg-rose-500 font-bold text-white hover:bg-rose-600"
          onClick={handleLogOut}
        >
          <LogOut className="h-4 w-4" strokeWidth={3} />
          Logout
        </Button>
      </div>
    </div>
  );
}
