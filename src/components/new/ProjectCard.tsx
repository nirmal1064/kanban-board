import { Project } from "@/lib/types";
import { useBoard } from "@/hooks/useBoard";
import { cn } from "@/lib/utils";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const { selectedProject, setSelectedProject } = useBoard();
  const isActive = project.id === selectedProject?.id;

  return (
    <div
      className={cn(
        "cursor-pointer rounded-md p-3 transition-all duration-150",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
      onClick={() => setSelectedProject(project)}
    >
      <h3 className="text-sm font-semibold">{project.title}</h3>
    </div>
  );
}
