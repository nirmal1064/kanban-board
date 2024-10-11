import { useBoard } from "@/hooks/useBoard";
import ProjectModal from "./modals/ProjectModal";
import ProjectCard from "./ProjectCard";

export default function Sidebar() {
  const { projects } = useBoard();

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
        <ProjectModal />
      </div>
    </div>
  );
}
