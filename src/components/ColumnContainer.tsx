import { Column, ID, Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CirclePlus, Trash } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TaskCard from "./TaskCard";

type Props = {
  column: Column;
  deleteColumn: (id: ID) => void;
  updateColumn: (id: ID, title: string) => void;
  tasks: Task[];
  createTask: (columnId: ID) => void;
  deleteTask: (id: ID) => void;
  updateTask: (id: ID, content: string) => void;
};

export default function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  tasks,
  createTask,
  deleteTask,
  updateTask,
}: Props) {
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
  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="bg-column flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md border-2 border-rose-500 opacity-40"
        style={style}
        ref={setNodeRef}
      ></div>
    );
  }

  return (
    <div
      className="bg-column flex h-[500px] max-h-[500px] w-[350px] flex-col rounded-md"
      style={style}
      ref={setNodeRef}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "bg-main border-column h-[60px] cursor-grab rounded-md rounded-b-none border-4 p-3 text-lg font-bold",
          "flex items-center justify-between"
        )}
      >
        <div className="flex">
          <div className="bg-column flex items-center justify-center rounded-full px-2 py-1 text-sm">
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
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <Button
        className="border-column border-x-column hover:bg-main flex items-center gap-2 rounded-md border-2 p-6 hover:text-rose-500 active:bg-background"
        variant={"outline"}
        onClick={() => createTask(column.id)}
      >
        <CirclePlus className="h-5 w-5" />
        Add Task
      </Button>
    </div>
  );
}
