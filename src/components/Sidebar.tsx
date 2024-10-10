import { useBoard } from "@/hooks/useBoard";
import { Plus } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { projects, createNewProject } = useBoard();

  return (
    <div className="hidden w-[250px] min-w-[250px] border-separate border-2 md:block">
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
        <Button variant={"outline"} onClick={() => createNewProject()}>
          <Plus className="h-5 w-5" />
          Add Project
        </Button>
      </div>
    </div>
  );
}
