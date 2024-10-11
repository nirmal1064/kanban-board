import { useColumn } from "@/hooks/useColumn";
import { TaskType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import { DeleteAlert } from "./modals/DeleteAlert";
import TaskModal from "./modals/TaskModal";
import { Button } from "./ui/button";

type Props = { task: TaskType };

export default function Task({ task }: Props) {
  const { deleteTask } = useColumn();
  const [mouseOver, setMouseOver] = useState(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.$id,
    data: { type: "Task", task },
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-rose-500 bg-main p-2.5 text-left opacity-30"
        )}
      >
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
          {task.content}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-main p-2.5 text-left",
        "hover:ring-2 hover:ring-inset hover:ring-rose-500"
      )}
      onMouseEnter={() => setMouseOver(() => true)}
      onMouseLeave={() => setMouseOver(() => false)}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseOver && (
        <>
          <TaskModal
            trigger={
              <Button
                variant={"ghost"}
                className="absolute right-4 top-[20%] -translate-y-[20%] rounded bg-column p-2 opacity-60 hover:opacity-100"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            }
            action="Update"
            task={task}
          />
          <DeleteAlert
            trigger={
              <Button
                variant={"ghost"}
                className="absolute right-4 top-[80%] -translate-y-[80%] rounded bg-column p-2 opacity-60 hover:opacity-100"
              >
                <Trash className="h-4 w-4" />
              </Button>
            }
            description="This will delete this task from the Project"
            onDelete={() => deleteTask(task.$id)}
          />
        </>
      )}
    </div>
  );
}
