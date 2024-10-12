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
import { usePreviousValue } from "@/hooks/usePreviousValue";
import {
  ColumnType,
  TaskType,
  UpdateColumnType,
  UpdateTaskType,
} from "@/lib/types";
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
  const prevColumns = usePreviousValue(columns);
  const prevTasks = usePreviousValue(tasks);

  async function createNewColumn(title: string) {
    if (selectedProject) {
      const columnToAdd = {
        project: selectedProject.$id,
        title,
        position:
          columns.length === 0 ? 1 : columns[columns.length - 1].position + 1,
      };
      const column = await createColumnDoc<ColumnType>(columnToAdd);
      setColumns((prev) => [...prev, column]);
    }
  }

  async function createTask(columnId: string, content: string) {
    if (selectedProject) {
      const task = {
        project: selectedProject.$id,
        column: columnId,
        content,
        position: tasks.length === 0 ? 1 : tasks[tasks.length - 1].position + 1,
      };
      const newTask = await createTaskDoc<TaskType>(task);
      setTasks([...tasks, newTask]);
    }
  }

  async function updateColumn(id: string, data: UpdateColumnType) {
    const doc = await updateColumnDoc<ColumnType>(id, data);
    setColumns((prevCols) =>
      prevCols.map((c) => (c.$id === doc.$id ? { ...c, ...doc } : c))
    );
  }

  async function updateTask(id: string, data: UpdateTaskType) {
    const doc = await updateTaskDoc<TaskType>(id, data);
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.$id === doc.$id ? { ...t, ...doc } : t))
    );
  }

  async function deleteColumn(id: string) {
    await deleteColumnDoc(id);
    const newColumns = columns.filter((c) => c.$id !== id);
    setColumns(newColumns);
    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  async function deleteTask(id: string) {
    await deleteTaskDoc(id);
    const newTasks = tasks.filter((t) => t.$id !== id);
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
    const activeColumnIdx = columns.findIndex((c) => c.$id === activeId);
    const overColumnIdx = columns.findIndex((c) => c.$id === overId);
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

  function resetColumnsAndTasks() {
    setColumns([]);
    setTasks([]);
    setActiveColumn(undefined);
    setActiveTask(undefined);
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

  // Listen to changes in columns and act when the position is changed
  useEffect(() => {
    async function updatePosition() {
      if (columns.length === 0) return;
      if (columns.length !== prevColumns.length) return; // Do Nothing for create/delete operation
      const promises = [];
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const prevCol = prevColumns[i];
        if (col.$id !== prevCol.$id) {
          promises.push(updateColumn(col.$id, { position: prevCol.position }));
        }
      }
      await Promise.all(promises);
    }
    updatePosition();
  }, [columns, prevColumns]);

  // Listen to changes in tasks and act when the position is changed
  useEffect(() => {
    async function updatePosition() {
      if (tasks.length === 0) return;
      if (tasks.length !== prevTasks.length) return; // Do Nothing for create/delete operation
      const promises = [];
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const prevTask = prevTasks[i];
        if (task.$id !== prevTask.$id) {
          promises.push(updateTask(task.$id, { position: prevTask.position }));
        }
      }
      await Promise.all(promises);
    }
    updatePosition();
  }, [prevTasks, tasks]);

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
    resetColumnsAndTasks,
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
