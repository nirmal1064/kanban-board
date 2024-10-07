import { useColumn } from "@/hooks/useColumn";
import { Column as ColumnType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CirclePlus, Trash } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { Button } from "../ui/button";
import Task from "./Task";
import { useTasks } from "@/hooks/useTasks";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "../ui/input";

type Props = { column: ColumnType };

export default function Column({ column }: Props) {
  const { deleteColumn, updateColumn, createTask } = useColumn();
  const { tasks } = useTasks(column.id);
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const [editMode, setEditMode] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-rose-500 bg-column opacity-40"
        style={style}
        ref={setNodeRef}
      ></div>
    );
  }

  return (
    <div
      className="flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md bg-column"
      style={style}
      ref={setNodeRef}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "h-[60px] cursor-grab rounded-md rounded-b-none border-4 border-column bg-main p-3 text-lg font-bold",
          "flex items-center justify-between"
        )}
      >
        <div className="flex">
          <div className="flex items-center justify-center rounded-full bg-column px-2 py-1 text-sm">
            {tasks.length}
          </div>
          {editMode ? (
            <Input
              autoFocus
              className="outline-none focus:border-rose-500 focus-visible:ring-0"
              value={columnTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setColumnTitle(e.target.value);
              }}
              onBlur={() => {
                setEditMode(false);
                setColumnTitle(column.title);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateColumn(column.id, columnTitle);
                  setEditMode(false);
                }
              }}
            />
          ) : (
            <p onClick={() => setEditMode(true)}>{column.title}</p>
          )}
        </div>
        <Button variant={"ghost"} onClick={() => deleteColumn(column.id)}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-grow flex-col gap-3 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={taskIds}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
      <Button
        className={cn(
          "flex items-center gap-2 rounded-md border-2 border-column border-x-column p-6 active:bg-background",
          "hover:bg-main hover:text-rose-500"
        )}
        variant={"outline"}
        onClick={() => createTask(column.id)}
      >
        <CirclePlus className="h-5 w-5" />
        Add Task
      </Button>
    </div>
  );
}
