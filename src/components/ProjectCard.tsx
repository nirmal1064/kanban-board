import { Button } from "@/components/ui/button";
import { useBoard } from "@/hooks/useBoard";
import { ProjectType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Edit, Trash2 } from "lucide-react";
import { DeleteAlert } from "./modals/DeleteAlert";
import ProjectModal from "./modals/ProjectModal";

type Props = { project: ProjectType };

export default function ProjectCard({ project }: Props) {
  const { selectedProject, setSelectedProject, deleteProject } = useBoard();
  const isActive = project.$id === selectedProject?.$id;

  function handleDelete() {
    deleteProject(project.$id);
    if (isActive) {
      setSelectedProject(null);
    }
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-md p-2.5 transition-all duration-150",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <h3
        className="flex-grow text-sm font-semibold"
        onClick={() => setSelectedProject(project)}
      >
        {project.title}
      </h3>
      <div className="flex items-center gap-1.5">
        <ProjectModal
          action="Update"
          project={project}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-[18px] w-[18px] focus-visible:ring-0"
            >
              <Edit className="h-full w-full" />
              <span className="sr-only">Edit project</span>
            </Button>
          }
        />
        <DeleteAlert
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="h-[18px] w-[18px] focus-visible:ring-0"
            >
              <Trash2 className="h-full w-full" />
              <span className="sr-only">Delete project</span>
            </Button>
          }
          description="This will delete the project and all its contents. This actions is irreversible"
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
