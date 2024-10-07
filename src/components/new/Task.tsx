import { useColumn } from "@/hooks/useColumn";
import { Task as TaskType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Textarea } from "../ui/textarea";

type Props = { task: TaskType };

export default function Task({ task }: Props) {
  const { deleteTask, updateTask } = useColumn();
  const [mouseOver, setMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [taskContent, setTaskContent] = useState(task.content);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function toggleEditMode() {
    setEditMode((prev) => !prev);
    setMouseOver(false);
  }

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

  if (editMode) {
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
      >
        <Textarea
          ref={(textarea) => {
            // TO position the cursor at the end of the text
            if (textarea) {
              const length = textarea.value.length;
              textarea.setSelectionRange(length, length);
            }
          }}
          autoFocus
          className="h-[90%] w-full resize-none border-none bg-transparent focus:outline-none focus-visible:ring-0"
          value={taskContent}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setTaskContent(e.target.value);
          }}
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.shiftKey) {
              return;
            }
            if (e.key === "Enter" && e.shiftKey) {
              return;
            }
            if (e.key === "Enter") {
              updateTask(task.id, taskContent);
              toggleEditMode();
            }
          }}
        />
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
      onMouseEnter={() => setMouseOver(true)}
      onMouseLeave={() => setMouseOver(false)}
      onClick={toggleEditMode}
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseOver && (
        <Button
          variant={"ghost"}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-column p-2 opacity-60 hover:opacity-100"
          onClick={() => deleteTask(task.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
