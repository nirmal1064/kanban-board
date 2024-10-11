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
import { useColumn } from "@/hooks/useColumn";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";

export default function ColumnModal() {
  const { createNewColumn } = useColumn();
  const { selectedProject } = useBoard();
  const [open, setOpen] = useState(false);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    if (!title || title.trim().length === 0) return;
    await createNewColumn(title);
    setOpen((prev) => !prev);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-column bg-main ring-rose-500 hover:ring-2"
        >
          <Plus className="h-5 w-5" />
          Add Column
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Column</DialogTitle>
          <DialogDescription>
            Create a column in{" "}
            <span className="text-rose-500">{selectedProject?.title}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input className="col-span-3" name="title" type="text" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-rose-500 font-semibold hover:bg-rose-500/80 dark:text-primary"
            >
              Create Column
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
