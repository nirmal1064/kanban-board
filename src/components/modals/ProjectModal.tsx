import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBoard } from "@/hooks/useBoard";
import { ProjectType } from "@/lib/types";
import { Plus } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

type CreateAction = { action: "Create"; project?: never };
type UpdateAction = { action: "Update"; project: ProjectType };
type Props = (CreateAction | UpdateAction) & { trigger?: ReactNode };

export default function ProjectModal({ action, trigger, project }: Props) {
  const { createNewProject, updateProject } = useBoard();
  const [open, setOpen] = useState(false);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    if (!title || title.trim().length === 0) return;
    if (action === "Create") {
      await createNewProject(title);
    } else {
      await updateProject(project.$id, title);
    }
    setOpen((prev) => !prev);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant={"ghost"}>
            <Plus className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{action} Project</DialogTitle>
          <DialogDescription>
            {action === "Create"
              ? "Create Your Exciting new Project."
              : "Update Your Project"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                className="col-span-3"
                name="title"
                type="text"
                defaultValue={action === "Create" ? undefined : project.title}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-rose-500 font-semibold hover:bg-rose-500/80 dark:text-primary"
            >
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
