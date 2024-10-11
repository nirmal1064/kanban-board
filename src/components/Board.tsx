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
import { createPortal } from "react-dom";
import Column from "./Column";
import Task from "./Task";
import ColumnModal from "./modals/ColumnModal";

export default function Board() {
  const { selectedProject } = useBoard();
  const {
    columns,
    activeColumn,
    activeTask,
    onDragStart,
    onDragOver,
    onDragEnd,
  } = useColumn();
  const columnIds = useMemo(() => columns.map((c) => c.$id), [columns]);

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
              <Column key={column.$id} column={column} />
            ))}
          </SortableContext>
        </div>
        <ColumnModal />
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
