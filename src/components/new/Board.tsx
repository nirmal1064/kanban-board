import { useBoard } from "@/hooks/useBoard";
import { useColumn } from "@/hooks/useColumn";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import Column from "./Column";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { createPortal } from "react-dom";
import Task from "./Task";

export default function Board() {
  const { selectedProject } = useBoard();
  const {
    columns,
    activeColumn,
    activeTask,
    createNewColumn,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useColumn();
  const columnIds = useMemo(() => columns.map((c) => c.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 1 },
    })
  );

  if (!selectedProject) {
    return <div>Please Select a Project to continue</div>;
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
              <Column key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>
        <Button
          variant={"outline"}
          className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-column bg-main ring-rose-500 hover:ring-2"
          onClick={() => createNewColumn()}
        >
          <Plus className="h-5 w-5" />
          Add Column
        </Button>
      </div>
      {createPortal(
        <DragOverlay>
          {activeColumn && <Column column={activeColumn} />}
          {activeTask && <Task task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
