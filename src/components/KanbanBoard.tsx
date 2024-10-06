import { generateID } from "@/lib/helpers";
import { Column, ID, Task } from "@/lib/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import { Button } from "./ui/button";
import TaskCard from "./TaskCard";

export default function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column>();
  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task>();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    })
  );

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateID(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: ID): void {
    const newColumns = columns.filter((c) => c.id !== id);
    setColumns(newColumns);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: ID, title: string) {
    const updatedColumns = columns.map((c) =>
      c.id === id ? { ...c, title } : c
    );
    setColumns(updatedColumns);
  }

  function createTask(columnId: ID) {
    const task: Task = {
      id: generateID(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, task]);
  }

  function updateTask(id: ID, content: string) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, content } : task
    );
    setTasks(updatedTasks);
  }

  function deleteTask(id: ID): void {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
  }

  function onDragStart(e: DragStartEvent) {
    console.log(e);
    if (e.active.data.current?.type === "Column") {
      setActiveColumn(e.active.data.current.column);
      return;
    }
    if (e.active.data.current?.type === "Task") {
      setActiveTask(e.active.data.current.task);
      return;
    }
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveColumn(undefined);
    setActiveTask(undefined);
    const { active, over } = e;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const activeColumnIdx = columns.findIndex((c) => c.id === activeId);
    const overColumnIdx = columns.findIndex((c) => c.id === overId);
    setColumns((prevCols) =>
      arrayMove(prevCols, activeColumnIdx, overColumnIdx)
    );
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type == "Task";
    const isOverATask = over.data.current?.type == "Task";

    if (!isActiveATask) return;

    // Dropping a task over another in the same column
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIdx = tasks.findIndex((t) => t.id === activeId);
        const overIdx = tasks.findIndex((t) => t.id === overId);
        tasks[activeIdx].columnId = tasks[overIdx].columnId;
        return arrayMove(tasks, activeIdx, overIdx);
      });
    }

    // Dropping a task over another in the different column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIdx = tasks.findIndex((t) => t.id === activeId);
        tasks[activeIdx].columnId = overId;
        return arrayMove(tasks, activeIdx, activeIdx);
      });
    }
  }

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      sensors={sensors}
    >
      <div className="mx-auto flex gap-4">
        <div className="flex gap-4">
          <SortableContext items={columnIds}>
            {columns.map((column) => (
              <ColumnContainer
                column={column}
                key={column.id}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                tasks={tasks.filter((t) => t.columnId === column.id)}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </SortableContext>
        </div>
        <Button
          variant={"outline"}
          className="bg-main border-column flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 ring-rose-500 hover:ring-2"
          onClick={() => createNewColumn()}
        >
          <Plus className="h-5 w-5" />
          Add Column
        </Button>
      </div>
      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <ColumnContainer
              column={activeColumn}
              deleteColumn={deleteColumn}
              updateColumn={updateColumn}
              tasks={tasks.filter((t) => t.columnId === activeColumn.id)}
              createTask={createTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
          {activeTask && (
            <TaskCard
              task={activeTask}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
