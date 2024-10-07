import { useBoard } from "@/hooks/useBoard";
import useLocalStorage from "@/hooks/useLocalStorage";
import { COLUMNS_KEY, TASKS_KEY } from "@/lib/constants";
import { generateID } from "@/lib/helpers";
import { Column, ID, Task } from "@/lib/types";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, ReactNode, useState } from "react";

type Props = { children: ReactNode };

export const ColumnProviderContext = createContext<
  ReturnType<typeof useColumnProvider> | undefined
>(undefined);

function useColumnProvider() {
  const { selectedProject } = useBoard();
  const [columns, setColumns] = useLocalStorage<Column[]>(COLUMNS_KEY, []);
  const [activeColumn, setActiveColumn] = useState<Column>();
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);
  const [activeTask, setActiveTask] = useState<Task>();

  function createNewColumn() {
    if (selectedProject) {
      const columnToAdd: Column = {
        id: generateID(),
        projectId: selectedProject.id,
        title: `Column ${columns.length + 1}`,
      };
      setColumns([...columns, columnToAdd]);
    }
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
    if (selectedProject) {
      const task: Task = {
        id: generateID(),
        projectId: selectedProject.id,
        columnId,
        content: `Task ${tasks.length + 1}`,
      };
      setTasks([...tasks, task]);
    }
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

  return {
    columns,
    createNewColumn,
    updateColumn,
    deleteColumn,
    activeColumn,
    tasks,
    createTask,
    updateTask,
    deleteTask,
    activeTask,
    onDragStart,
    onDragEnd,
    onDragOver,
  };
}

export default function ColumnProvider({ children }: Props) {
  const columnProvider = useColumnProvider();

  return (
    <ColumnProviderContext.Provider value={columnProvider}>
      {children}
    </ColumnProviderContext.Provider>
  );
}
