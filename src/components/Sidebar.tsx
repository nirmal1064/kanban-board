import { useBoard } from "@/hooks/useBoard";
import { cn } from "@/lib/utils";
import { Kanban } from "lucide-react";
import ProjectModal from "./modals/ProjectModal";
import ProjectCard from "./ProjectCard";
import { ThemeToggle } from "./ThemeToggle";

export default function Sidebar() {
  const { projects } = useBoard();

  return (
    <div className="hidden w-[250px] min-w-[250px] border-separate border-2 md:block">
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
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-bold text-primary">Projects</h1>
        {projects.length === 0 ? (
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
    </div>
  );
}
