import { Project } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { useBoard } from "@/hooks/useBoard";
import { cn } from "@/lib/utils";

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const { selectedProject, setSelectedProject } = useBoard();
  const isActive = project.id === selectedProject?.id;

  return (
    <Card
      className={cn(
        "cursor-pointer outline-none transition hover:ring hover:ring-rose-500",
        isActive ? "border border-rose-500 shadow-lg" : "hover:shadow-lg"
      )}
      onClick={() => setSelectedProject(project)}
    >
      <CardHeader className="p-2 py-3">
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
