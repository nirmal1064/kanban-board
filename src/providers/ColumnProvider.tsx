import {
  createColumnDoc,
  createTaskDoc,
  deleteColumnDoc,
  deleteTaskDoc,
  getColumns,
  getTasks,
  updateColumnDoc,
  updateTaskDoc,
} from "@/appwrite/database";
import { useBoard } from "@/hooks/useBoard";
import { ColumnType, TaskType } from "@/lib/types";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createContext, ReactNode, useEffect, useState } from "react";

type Props = { children: ReactNode };

export const ColumnProviderContext = createContext<
  ReturnType<typeof useColumnProvider> | undefined
>(undefined);

function useColumnProvider() {
  const { selectedProject } = useBoard();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [activeColumn, setActiveColumn] = useState<ColumnType>();
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [activeTask, setActiveTask] = useState<TaskType>();

  async function createNewColumn() {
    if (selectedProject) {
      const columnToAdd = {
        project: selectedProject.$id,
        title: `Column ${columns.length + 1}`,
      };
      const column = await createColumnDoc<ColumnType>(columnToAdd);
      setColumns((prev) => [...prev, column]);
    }
  }

  // TODO
  async function deleteColumn(id: string) {
    await deleteColumnDoc(id);
    const newColumns = columns.filter((c) => c.$id !== id);
    setColumns(newColumns);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  // TODO
  async function updateColumn(id: string, title: string) {
    const doc = await updateColumnDoc<ColumnType>(id, { title });
    const updatedColumns = columns.map((c) =>
      c.$id === doc.$id ? { ...c, title } : c
    );
    setColumns(updatedColumns);
  }

  // TODO
  async function createTask(columnId: string) {
    if (selectedProject) {
      const task = {
        project: selectedProject.$id,
        column: columnId,
        content: `Task ${tasks.length + 1}`,
      };
      const newTask = await createTaskDoc<TaskType>(task);
      setTasks([...tasks, newTask]);
    }
  }

  // TODO
  async function updateTask(id: string, content: string) {
    const doc = await updateTaskDoc<TaskType>(id, { content });
    const updatedTasks = tasks.map((task) =>
      task.$id === doc.$id ? { ...task, content } : task
    );
    setTasks(updatedTasks);
  }

  // TODO
  async function deleteTask(id: string) {
    await deleteTaskDoc(id);
    const newTasks = tasks.filter((t) => t.$id !== id);
    setTasks(newTasks);
  }

  // TODO
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
    console.log(e);
    setActiveColumn(undefined);
    setActiveTask(undefined);
    const { active, over } = e;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const activeColumnIdx = columns.findIndex((c) => c.$id === activeId);
    const overColumnIdx = columns.findIndex((c) => c.$id === overId);
    setColumns((prevCols) =>
      arrayMove(prevCols, activeColumnIdx, overColumnIdx)
    );
  }

  function onDragOver(e: DragOverEvent) {
    console.log(e);
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
        const activeIdx = tasks.findIndex((t) => t.$id === activeId);
        const overIdx = tasks.findIndex((t) => t.$id === overId);
        tasks[activeIdx].column.$id = tasks[overIdx].column.$id;
        return arrayMove(tasks, activeIdx, overIdx);
      });
    }

    // Dropping a task over another in the different column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIdx = tasks.findIndex((t) => t.$id === activeId);
        tasks[activeIdx].column.$id = overId as string;
        return arrayMove(tasks, activeIdx, activeIdx);
      });
    }
  }

  useEffect(() => {
    async function fetchColumnsAndTasks(id: string) {
      const [cols, tasks] = await Promise.all([
        getColumns<ColumnType>(id),
        getTasks<TaskType>(id),
      ]);
      setColumns(cols);
      setTasks(tasks);
    }
    if (selectedProject) {
      fetchColumnsAndTasks(selectedProject.$id);
    }
  }, [selectedProject]);

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
