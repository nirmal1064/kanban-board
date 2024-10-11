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
import { Label } from "@/components/ui/label";
import { useColumn } from "@/hooks/useColumn";
import { ColumnType, TaskType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CirclePlus } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";
import { Textarea } from "../ui/textarea";

type CreateAction = {
  action: "Create";
  column: ColumnType;
  task?: never;
};

type UpdateAction = {
  action: "Update";
  task: TaskType;
  column?: never;
};

type Props = (CreateAction | UpdateAction) & {
  trigger?: ReactNode;
  defaultValue?: string;
};

export default function TaskModal({ action, column, task, trigger }: Props) {
  const { createTask, updateTask } = useColumn();
  const [open, setOpen] = useState(false);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const content = form.get("content") as string;
    if (!content || content.trim().length === 0) return;
    if (action === "Create") {
      await createTask(column.$id, content);
    } else {
      await updateTask(task.$id, { content });
    }
    setOpen((prev) => !prev);
  }

  const title = action === "Create" ? column.title : task.column.title;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
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
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{action} Task</DialogTitle>
          <DialogDescription>
            {action} the task in <span className="text-rose-500">{title}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="name" className="text-right">
                Content
              </Label>
              <Textarea
                ref={(textarea) => {
                  // To position the cursor at the end of the text
                  if (textarea) {
                    const length = textarea.value.length;
                    textarea.setSelectionRange(length, length);
                  }
                }}
                name="content"
                autoFocus
                className="h-[90%] w-full resize-none border-none bg-transparent outline outline-1 focus:outline-none focus-visible:ring-rose-500"
                defaultValue={action === "Create" ? undefined : task.content}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-rose-500 font-semibold hover:bg-rose-500/80 dark:text-primary"
            >
              {action} Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
