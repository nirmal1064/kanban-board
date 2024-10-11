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
import { useColumn } from "@/hooks/useColumn";
import { ColumnType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CirclePlus } from "lucide-react";
import { FormEvent, useState } from "react";

type Props = {
  column: ColumnType;
  action?: "create" | "update";
  defaultValue?: string;
};

export default function TaskModal({
  column,
  action = "create",
  defaultValue = "",
}: Props) {
  const { createTask, updateTask } = useColumn();
  const [open, setOpen] = useState(false);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const content = form.get("content") as string;
    if (!content || content.trim().length === 0) return;
    if (action === "create") {
      await createTask(column.$id, content);
    } else {
      await updateTask(column.$id, { content });
    }
    setOpen((prev) => !prev);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={cn(
            "flex items-center gap-2 rounded-md border-2 border-column border-x-column p-6 active:bg-background",
            "hover:bg-main hover:text-rose-500"
          )}
          variant={"outline"}
        >
          <CirclePlus className="h-5 w-5" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task in{" "}
            <span className="text-rose-500">{column.title}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Content
              </Label>
              <Input
                className="col-span-3"
                name="content"
                type="text"
                defaultValue={defaultValue}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-rose-500 font-semibold text-primary hover:bg-rose-500/80"
            >
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
